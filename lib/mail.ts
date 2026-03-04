import nodemailer from "nodemailer";
import handlebars from "handlebars";
import toast from "react-hot-toast";
import { ThankyouTemplate } from "./designs/thankyou";
import { SendSelectedTemplate } from "./designs/send-selected";
import { SendRejectedTemplate } from "./designs/send-rejected";
export const sendMail = async ({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) => {
  const { SMTP_PASSWORD, SMTP_EMAIL } = process.env;
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  try {
    await transport.verify();
  } catch (error) {
    console.log(error);
    toast.error((error as Error)?.message);
    return;
  }
  try {
    const sendResult = await transport.sendMail({
      from: SMTP_EMAIL,
      to,
      subject,
      html: body,
    });
    return sendResult;
  } catch (error) {
    console.log(error);
    toast.error((error as Error)?.message);
  }
};

export const compileThankyouEmailTemplate = (name: string) => {
  const template = handlebars.compile(ThankyouTemplate);

  const htmlBody = template({
    name: name,
  });

  return htmlBody;
};

export const compileSendSelectedEmailTemplate = (name: string) => {
  const template = handlebars.compile(SendSelectedTemplate);

  const htmlBody = template({
    name: name,
  });

  return htmlBody;
};

export const compileSendRejectedEmailTemplate = (name: string) => {
  const template = handlebars.compile(SendRejectedTemplate);

  const htmlBody = template({
    name: name,
  });

  return htmlBody;
};
