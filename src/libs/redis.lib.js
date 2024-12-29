const {
  REDIS_CONNECT_TIMEOUT,
  REDIS_CONNECT_MESSAGE,
} = require("../configs/constant.config");
const resUtil = require("../utils/res.util");
const { Redis } = require("ioredis");
const { default: RedLock } = require("redlock");

const connection = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  username: process.env.REDIS_USERNAME || "default",
  password: process.env.REDIS_PASSWORD,
  database: process.env.REDIS_DATABASE || 0,
};

const redis = new Redis({
  db: connection.database,
  host: connection.host,
  port: connection.port,
  username: connection.username,
  password: connection.password,
});

const redLock = new RedLock([redis], {
  retryCount: 5, // Số lần thử lại
  retryDelay: 200, // Thời gian đợi giữa các lần thử (ms)
  retryJitter: 50, // Độ trễ ngẫu nhiên (tránh xung đột)
  automaticExtensionThreshold: 500, // Tự động gia hạn TTL nếu cần
});

const statusConnectRedis = {
  CONNECT: "connect",
  END: "end",
  RECONNECT: "reconnecting",
  ERROR: "error",
};

let connectionTimeout = null;

const handleTimeOutError = () => {
  connectionTimeout = setTimeout(() => {
    throw new resUtil.CatchError({
      status: REDIS_CONNECT_MESSAGE.status,
      message: REDIS_CONNECT_MESSAGE.message,
    });
  }, REDIS_CONNECT_TIMEOUT);
};

const handleEventConnection = ({ connectionRedis }) => {
  connectionRedis.on(statusConnectRedis.CONNECT, () => {
    console.log(`ConnectionRedis - Connection status: connected`);
    clearTimeout(connectionTimeout);
  });

  connectionRedis.on(statusConnectRedis.END, () => {
    console.log(`ConnectionRedis - Connection status: disconnected`);
    handleTimeOutError();
  });

  connectionRedis.on(statusConnectRedis.RECONNECT, () => {
    console.log(`ConnectionRedis - Connection status: reconnecting`);
    clearTimeout(connectionTimeout);
  });

  connectionRedis.on(statusConnectRedis.ERROR, (error) => {
    console.log(`ConnectionRedis - Connection status: error ${error.message}`);
    handleTimeOutError();
  });
};

const initRedis = () => {
  handleEventConnection({
    connectionRedis: redis,
  });
};

const getRedis = () => redis;

const getRedLock = () => redLock;

const closeRedis = () => {
  redis.disconnect();
};

module.exports = {
  initRedis,
  getRedis,
  closeRedis,
  getRedLock,
  connection,
};
