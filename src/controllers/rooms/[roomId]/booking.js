const resUtil = require("../../../utils/res.util");
const { addMinutes, differenceInMilliseconds } = require("date-fns");
const { getRedLock } = require("../../../libs/redis.lib");
const roomService = require("../../../services/room.service");
const { getStripe } = require("../../../libs/stripe.lib");
const roomValidator = require("../../../validators/room.Validator");
const stripe = getStripe();
const redLock = getRedLock();

module.exports = resUtil.catchError(async (req, res, next) => {
  const roomId = req.params.roomId;

  const body = await req.validate(req.body, roomValidator.booking);

  const context = {
    paymentIntent: null,
    amount: body?.amount || 0,
    resource: `room-locks:${roomId}`,
    lockRoom: null,
  };

  context.amount = Math.round(Number((context.amount * 100).toFixed(1)));

  // => validate
  const room = await roomService.getRoomById(roomId);

  if (!room) {
    throw new resUtil.CatchError({
      status: 404,
      message: "Room not found",
    });
  }

  // => lock room
  context.resource = `room-locks:${roomId}`;

  const targetTime = addMinutes(new Date(), 10);
  const milliseconds = differenceInMilliseconds(targetTime, new Date());

  try {
    context.lockRoom = await redLock.acquire([context.resource], milliseconds);
  } catch {
    throw new resUtil.CatchError({
      status: 409,
      message: "An error has occurred, please try again in a few minutes.",
    });
  }

  if (!context.lockRoom) {
    throw new resUtil.CatchError({
      status: 500,
      message: "Server error",
    });
  }

  // => create payment intent
  if (context.amount > 0) {
    context.paymentIntent = await stripe.paymentIntents.create({
      amount: context.amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
      confirm: true,
      payment_method: body.paymentMethod,
    });
  } else {
    context.paymentIntent = await stripe.setupIntents.create({
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
      payment_method: body.paymentMethod,
      usage: "off_session",
    });
  }

  if (!context.paymentIntent) {
    await context.lockRoom.release();
    throw new resUtil.CatchError({
      status: 500,
      message: "Server error",
    });
  }

  // unlock 
  await context.lockRoom.release();

  return resUtil.success(res, {
    message: "success",
    data: context.paymentIntent,
  });
});
