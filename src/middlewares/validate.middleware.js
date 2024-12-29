const { object } = require("yup");
const xss = require("xss");
const resUtil = require("../utils/res.util");

module.exports = resUtil.catchError((req, res, next) => {
  if (req.method === "GET") {
    const {
      limit = "10",
      page = "1",
      order = "desc",
      sort = "",
      ...rest
    } = req.query;
    if (limit !== "all") {
      req.query = {
        ...rest,
        limit: +limit > 0 ? +limit : 10,
        page: +page > 0 ? +page : 1,
      };
    }
    req.query = {
      ...req.query,
      order: order !== "asc" ? "desc" : "asc",
      sort,
    };
  }

  req.validate = async (data, rules = {}) => {
    const schema = object(rules);
    try {
      let body = await schema.validate(data, {
        abortEarly: false,
      });
      if (typeof body === "object") {
        body = Object.keys(body).reduce((resp, key) => {
          const newValue = body[key];
          if (typeof newValue === "string") {
            resp[key] = xss(
              newValue
                .replace(/[ \t]+/g, " ")
                .replace(/\n\s*\n/g, "\n")
                .trim()
            );
          } else {
            resp[key] = newValue;
          }
          return resp;
        }, {});
        return body;
      }
      return body;
    } catch (e) {
      const errors = Object.fromEntries(
        e.inner.map((item) => [item.path, item.message])
      );
      throw new resUtil.CatchError({
        status: 400,
        message: "Bad request",
        errors,
      });
    }
  };
  next();
});
