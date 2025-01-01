var express = require("express");
var router = express.Router();
const resUtil = require("../utils/res.util");

const cors = require("cors");
const whitelist = [process.env.HOSTING_USER, process.env.HOSTING_ADMIN];

const corsOptions = {
  origin: function (origin, callback) {
    if (process.env.NODE_ENV === "development") {
      return callback(null, true);
    }
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(
        new resUtil.Error({
          status: 403,
          message: "Not allowed by CORS",
        })
      );
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

router.use(cors(corsOptions));

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Hello" });
});

router.use("/", require("./api"));

module.exports = router;
