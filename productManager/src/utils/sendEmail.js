import nodemailer from "nodemailer";
import { envConfig } from "../config/envConfig.js";

const transport = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true,
  auth: {
    user: envConfig.gmailUserApp,
    pass: envConfig.gmailUserPassword,
  },
});

export const sendEmail = async ({ subject, html }) =>
  transport.sendMail({
    from: "axeldearias@gmail.com",
    to: "axeldearias@gmail.com",
    subject,
    html,
  });
