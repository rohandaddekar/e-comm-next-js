import { otpEmail } from "@/emails/otp";
import { dbConnect } from "@/lib/db";
import {
  errorResponseHandler,
  generateOtp,
  responseHandler,
} from "@/lib/helpers";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import Otp from "@/models/otp";
import User from "@/models/user";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await dbConnect();

    const payload = await req.json();

    const validationSchema = zSchema.pick({
      email: true,
    });

    const validatedData = validationSchema.safeParse(payload);
    if (!validatedData.success) {
      return responseHandler({
        success: false,
        statusCode: 400,
        message: "Invalid request data",
        data: validatedData.error,
      });
    }

    const { email } = validatedData.data;

    const user = await User.findOne({ email, deletedAt: null });
    if (!user) {
      return responseHandler({
        success: false,
        message: "User not found",
        statusCode: 404,
      });
    }

    await Otp.deleteMany({ email });

    const otp = generateOtp();

    const newOtp = new Otp({ email, otp });
    await newOtp.save();

    const otpEmailStatus = await sendMail({
      to: email,
      subject: "Your OTP Code",
      body: otpEmail(otp),
    });
    if (!otpEmailStatus.success) {
      return responseHandler({
        success: false,
        message: "Failed to send OTP",
        statusCode: 500,
      });
    }

    return responseHandler({
      success: true,
      message: "OTP sent to your email",
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error in OTP resend: ", error);

    return errorResponseHandler({
      error: error as Error,
    });
  }
};
