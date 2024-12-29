const REDIS_CONNECT_TIMEOUT = 10000;
const REDIS_CONNECT_MESSAGE = {
  status: -99,
  message: "Redis connection error",
};

module.exports = {
    REDIS_CONNECT_TIMEOUT,
    REDIS_CONNECT_MESSAGE
}