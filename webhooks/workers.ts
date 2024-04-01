import { webhooksWorker } from "./webhook-worker";
import { taskWorker } from "./task-worker";
import { Queue } from "bullmq";
import config from "./config";

const taskQueueScheduler = new Queue(config.taskQueueName, {
  connection: config.connection,
});

const webhookQueueScheduler = new Queue(config.webhooksQueueName, {
  connection: config.connection,
});

console.log(`Started workers: ${webhooksWorker.name} and ${taskWorker.name}`);

taskWorker.on("error", (err) =>
  console.log("Failed processing task job", err)
);
webhookQueueScheduler.on("error", (err: any) =>
  console.log("Failed processing webhook job", err)
);
