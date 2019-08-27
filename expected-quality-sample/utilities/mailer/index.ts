import nodemailer, { SendMailOptions } from "nodemailer";
import { mailCredentials } from "../../config";

const transporter = nodemailer.createTransport({
  service: mailCredentials.service,
  auth: {
    user: mailCredentials.user,
    pass: mailCredentials.password
  }
});

export const sendMail = async (options: SendMailOptions) => {
  return transporter.sendMail(options);
};

export { SendMailOptions };
