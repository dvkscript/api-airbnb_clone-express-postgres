const Photo = require("../enums/photo");

class CatchError extends Error {
  constructor({ message, status, errors }) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

module.exports = {
  req: null,
  success: (res, { status = 200, message, data = null }) => {
    const response = {
      ok: true,
      status,
      message,
      data,
      errors: null,
    };
    return res.status(response.status).json(response);
  },
  error: (res, { status = 500, message, errors = {} }) => {
    const response = {
      ok: false,
      status,
      message,
      data: null,
      errors,
    };
    return res.status(response.status).json(response);
  },
  CatchError,
  catchError: function (promise) {
    return async (req, res, next) => {
      try {
        return await promise(req, res, next);
      } catch (error) {
        console.log("\x1b[31m%s\x1b[0m", `error: ${error.message}`);
        return this.error(res, error);
      }
    };
  },
  imageParse: function (req, photoData = {}) {
    const fullUrl = req.protocol + "://" + req.get("host");
    const { type, url, format } = photoData;

    switch (type) {
      case Photo.TYPE.CLOUD:
        const randomId = new Date().getTime().toString().slice(0, 10);
        if (req.isImgRandomId) {
          return (
            fullUrl +
            `/api/v1/cloud/image/v${randomId}/${url}${
              format ? `.${format?.toLowerCase()}` : ""
            }`
          );
        }
        return (
          fullUrl +
          `/api/v1/cloud/image/${url}${
            format ? `.${format?.toLowerCase()}` : ""
          }`
        );
      case Photo.TYPE.LOCAL:
        return fullUrl + `/${url}`;
      default:
        return url;
    }
  },
};
