import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

interface SendMailOptions {
  to: string;
  subject: string;
  body: string;
}

const NODEMAILER_HOST = process.env.NODEMAILER_HOST as string;
const NODEMAILER_PORT = parseInt(process.env.NODEMAILER_PORT || "587", 10);
const NODEMAILER_USER = process.env.NODEMAILER_USER as string;
const NODEMAILER_PASSWORD = process.env.NODEMAILER_PASSWORD as string;

export const sendMail = async ({ to, subject, body }: SendMailOptions) => {
  const transporter = nodemailer.createTransport({
    host: NODEMAILER_HOST,
    port: NODEMAILER_PORT,
    secure: false, // use true for 465, false for other ports
    auth: {
      user: NODEMAILER_USER,
      pass: NODEMAILER_PASSWORD,
    },
  } as SMTPTransport.Options);

  const mailOptions = {
    from: `"Ecomm App" <${NODEMAILER_USER}>`,
    to,
    subject,
    html: body,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: (error as Error).message };
  }
};
