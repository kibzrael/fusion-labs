import { Queue } from "bullmq";
import { connection } from "./bullmq.js";

const queueSingleton = (name: string) => {
  const q = new Queue(name, {
    connection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 10_000,
      },
    },
  });
  globalForQueue[name] = q;
  return q;
};

type QueueSingleton = ReturnType<typeof queueSingleton>;

const globalForQueue = globalThis as unknown as {
  [key: string]: QueueSingleton | undefined;
};

const queue = (name: string) => globalForQueue[name] ?? queueSingleton(name);

export default queue;
