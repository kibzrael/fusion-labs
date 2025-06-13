import { createTransport } from "nodemailer";

export const nodemailer = createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.MAIL_APP_USER,
    pass: process.env.MAIL_APP_PASSWORD,
  },
});
