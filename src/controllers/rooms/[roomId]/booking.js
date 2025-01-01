const resUtil = require("../../../utils/res.util");
const {
  addMinutes,
  differenceInMilliseconds,
  differenceInDays,
} = require("date-fns");
const { getRedLock } = require("../../../libs/redis.lib");
const roomService = require("../../../services/room.service");
const { getStripe } = require("../../../libs/stripe.lib");
const roomValidator = require("../../../validators/room.Validator");
const stripe = getStripe();
const redLock = getRedLock();
const Discount = require("../../../enums/room").Discount;

module.exports = resUtil.catchError(async (req, res, next) => {
  const roomId = req.params.roomId;
  const currentUserId = req.user.id;

  const body = await req.validate(req.body, roomValidator.booking);

  if (body.guests !== body.adults + body.children) {
    throw new resUtil.CatchError({
      status: 400,
      message: '"adults" and "children" must be equal to "guests"',
    });
  }

  const context = {
    paymentIntent: null,
    lockRoom: null,
  };

  const targetTime = addMinutes(new Date(), 10);
  const milliseconds = differenceInMilliseconds(targetTime, new Date());

  try {
    try {
      context.lockRoom = await redLock.acquire(
        [`room-locks:${roomId}`],
        milliseconds
      );
    } catch {
      throw new resUtil.CatchError({
        status: 409,
        message: "An error has occurred, please try again in a few minutes.",
      });
    }

    // // => validate
    const room = await roomService.getRoomDetails(roomId, currentUserId);

    if (!room) {
      throw new resUtil.CatchError({
        status: 404,
        message: "Room not found",
      });
    }

    const roomDiscounts = room.discounts;
    const roomFee = room.fee;
    if (!roomDiscounts || !roomFee) {
      throw new resUtil.CatchError({
        status: 500,
        message: "Server Error",
      });
    }

    const countNight = differenceInDays(body.checkout, body.checkIn);

    const discounts = roomDiscounts.filter((rd) => {
      if (countNight > 28) {
        return !!rd;
      }
      if (countNight > 5) {
        return (
          rd.conditions === Discount.WEEKLY ||
          rd.conditions === Discount.NEW_USER
        );
      }
      return rd.conditions === Discount.NEW_USER;
    });

    const maxDiscount = discounts.reduce((maxObj, item) => {
      return (item?.percent || -Infinity) > maxObj.percent ? item : maxObj;
    }, null);

    const basePrice = room.original_price;

    // Xác định số tiền giảm giá mỗi đêm
    const discountPercent = maxDiscount?.percent || 0;
    const roomDiscountPrice = (discountPercent / 100) * basePrice; // Giá trị giảm giá dương

    // Tổng giá gốc và giá sau giảm giá
    const totalBasePrice = basePrice * countNight;
    const discountedNightPrice = basePrice - roomDiscountPrice; // Giá sau giảm giá mỗi đêm
    const totalDiscountedPrice = discountedNightPrice * countNight; // Tổng giá sau giảm giá

    // Các phí bổ sung
    const serviceFeePrice = totalBasePrice * roomFee.app_fee; // Phí dịch vụ
    const cleaningCharge = totalBasePrice * roomFee.service_fee; // Phí dọn dẹp

    // Tổng số tiền cần thanh toán (sau giảm giá, cộng phí)
    const amount = Math.round(
      (totalDiscountedPrice + serviceFeePrice + cleaningCharge) * 100
    ); // x100 vì là USD (cents)

    // => create payment intent
    if (amount > 0) {
      context.paymentIntent = await stripe.paymentIntents.create({
        amount,
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

    // // unlock
    await context.lockRoom.release();

    return resUtil.success(res, {
      message: "success",
      data: body,
    });
  } catch (error) {
    await context.lockRoom.release();
    throw new resUtil.CatchError(error);
  }
});
