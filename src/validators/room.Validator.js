const yup = require("yup");

module.exports = {
  booking: {
    paymentMethod: yup.string().required("paymentMethod is required"),
    amount: yup
      .number()
      .required({
        message: "amount is required",
      })
      .min(0, {
        message: "amount must be greater than 0",
      }),
  },
};
