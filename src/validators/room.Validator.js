const yup = require("yup");

module.exports = {
  booking: {
    checkIn: yup
      .date()
      .min(new Date(), "Check-in date must be in the future.")
      .required("Check-in date is required."),
    checkout: yup
      .date()
      .min(
        yup.ref("checkIn"),
        "Checkout date must be later than check-in date."
      )
      .test(
        "min-duration",
        "Checkout date must be at least 1 day after check-in date.",
        function (value) {
          const { checkIn } = this.parent; // Lấy giá trị checkIn từ context
          if (!checkIn || !value) return true; // Bỏ qua kiểm tra nếu không có giá trị
          const diffTime =
            new Date(value).getTime() - new Date(checkIn).getTime();
          const diffDays = diffTime / (1000 * 60 * 60 * 24); // Chuyển đổi sang số ngày
          return diffDays >= 1; // Điều kiện: phải ít nhất 1 ngày
        }
      )
      .required("Checkout date is required."),
    guests: yup
      .number()
      .min(1, "Guests must be at least 1")
      .required("Number of guests is required."),
    adults: yup
      .number()
      .min(1, "Adults must be at least 1")
      .required("Number of adults is required."),
    children: yup
      .number()
      .min(0, "Children must be at least 0")
      .required("Number of children is required."),
    infants: yup
      .number()
      .min(0, "Infants must be at least 0")
      .required("Number of infants is required."),
    pets: yup
      .number()
      .min(0, "Pets must be at least 0")
      .required("Number of pets is required."),
  },
};
