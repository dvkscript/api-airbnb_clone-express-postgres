const yup = require("yup");

module.exports = {
  post: {
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
