var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
const flash = require("connect-flash");
var fileupload = require("express-fileupload");
var indexRouter = require("./routes");
const resUtil = require("./utils/res.util");
const passport = require("./passport");
const redis = require("./libs/redis.lib");
redis.initRedis();
const queue = require("./libs/queue.lib");

queue.initQueues(); 

var app = express();

const rootDir = path.resolve(__dirname, "..");
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    // cookie: {
    //   secure: true,
    // },
  })
);
app.use(flash());
app.use(fileupload());
app.use(passport.initialize());
app.use(passport.session());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(rootDir, "public")));

app.use(indexRouter);

app.use((req, res, next) => {
  const methodsForPath = app._router.stack
    .filter((layer) => layer.route?.path === req.path)
    .map((layer) => Object.keys(layer.route.methods).join(", ").toUpperCase());

  if (methodsForPath.length && !methodsForPath[0].includes(req.method)) {
    const error = new Error(`Method ${req.method} not allowed on this route`);
    error.status = 405; // HTTP 405 Method Not Allowed
    return next(error);
  }

  next();
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  return resUtil.error(res, {
    status: err.status || 500,
    message: err.message,
    errors: err.errors,
  });
});

module.exports = app;
