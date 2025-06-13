import { Worker } from "bullmq";
import dotenv from "dotenv";
import type { EmailJob } from "./types/email.js";
import prisma from "./utils/prisma.js";

dotenv.config();

const { connection } = await import("./utils/bullmq.js");
const { nodemailer } = await import("./utils/nodemailer.js");

const sendEmail = async (subject: string, message: string, data: EmailJob) => {
  await nodemailer.sendMail({
    from: `"Fusion" <${process.env.MAIL_APP_USER}>`,
    to: data.email,
    subject,
    text: message,
  });

  await prisma.emailNotification.create({
    data: {
      email: data.email,
      purchaseId: data.purchaseId,
      type: "delivery",
    },
  });
};

const worker = new Worker(
  "email-notifications",
  async (job) => {
    const data: EmailJob = job.data;

    switch (job.name) {
      case "confirmation-email":
        await sendEmail(
          "Your order has been confirmed",
          `
            Hello, thanks for your order for ${data.model}. We'll send you an email when your laptop is delivered.

            Track your order using this Order ID: ${data.purchaseId}
          `,
          data
        );
        break;
      case "delivery-email":
        await sendEmail(
          "Your laptop has been delivered",
          `
            Hello, your ${data.model} laptop has been delivered. Pick it up at the store and enjoy!

            Show this Order ID during pickup: ${data.purchaseId}
          `,
          data
        );
        break;
    }
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job.id} has failed: ${err.message}`);
});

console.log("[*] Listening for email notifications");
