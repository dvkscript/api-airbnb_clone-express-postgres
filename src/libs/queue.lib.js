const { Queue, Worker, QueueEvents } = require("bullmq");

const connection = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  username: process.env.REDIS_USERNAME || "default",
  password: process.env.REDIS_PASSWORD,
  database: process.env.REDIS_DATABASE || 0,
};

const jobs = require("../jobs");
const resUtil = require("../utils/res.util");
const renderConnection = require("../jobs/render-connection");

const queues = jobs.map((job) => {
  return {
    bull: new Queue(job.key, {
      connection,
    }),
    name: job.key,
    handle: job.handle,
  };
});

const add = (name, data, opts) => {
  const job = queues.find((queue) => queue.name === name);
  if (!job) {
    throw new resUtil.CatchError({
      message: "Queue not found",
      status: 500,
    });
  }
  return job.bull.add(name, data, opts);
};

const initQueues = () => {
  queues.forEach(async (queue) => {
    const queueEvents = new QueueEvents(queue.name, {
      connection,
    });

    await queueEvents.waitUntilReady();

    new Worker(queue.name, queue.handle, {
      ...(queue.workerOptions || {}),
      connection,
    });

    queueEvents.on("completed", ({ jobId }) => {
      console.log("done painting: ", jobId);
    });

    queueEvents.on("failed", ({ jobId, failedReason }) => {
      console.error("error painting", failedReason, "-", jobId);
    });
  });
  
  if (process.env.NODE_ENV !== "development") {
    setInterval(() => {
      add(renderConnection.key, {
        url: "https://api-airbnb-clone-express-postgres.onrender.com",
      });
    }, 14 * 60 * 1000);
  }
};

const queue = {
  queues,
  add,
  initQueues,
};

module.exports = queue;
