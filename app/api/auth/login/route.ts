import { emailVerificationLink } from "@/emails/emailVerificationLink";
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
import { SignJWT } from "jose";
import { NextRequest } from "next/server";
import z from "zod";

export const POST = async (request: NextRequest) => {
  try {
    await dbConnect();

    const payload = await request.json();

    const validationSchema = zSchema
      .pick({
        email: true,
      })
      .extend({
        password: z.string(),
      });

    const validatedData = validationSchema.safeParse(payload);
    if (!validatedData.success) {
      return responseHandler({
        success: false,
        message: "Invalid data",
        statusCode: 400,
        error: validatedData.error,
      });
    }

    const { email, password } = validatedData.data;

    const user = await User.findOne({ email, deletedAt: null }).select(
      "+password"
    );

    if (!user) {
      return responseHandler({
        success: false,
        message: "Invalid credentials",
        statusCode: 401,
      });
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return responseHandler({
        success: false,
        message: "Invalid credentials",
        statusCode: 401,
      });
    }

    if (!user.isEmailVerified) {
      const secret = new TextEncoder().encode(process.env.SECRET_KEY);

      const token = await new SignJWT({ userId: user._id.toString() })
        .setIssuedAt()
        .setExpirationTime("1h")
        .setProtectedHeader({ alg: "HS256" })
        .sign(secret);

      await sendMail({
        to: user.email,
        subject: "Verify your email",
        body: emailVerificationLink(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`
        ),
      });

      return responseHandler({
        success: false,
        statusCode: 401,
        message:
          "Please verify your email to login. A new verification link has been sent to your email.",
      });
    }

    await Otp.deleteMany({ email });

    const otp = generateOtp();

    const newOtp = new Otp({
      email,
      otp,
    });
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
    console.error("Login error: ", error);
    return errorResponseHandler({
      error: error as Error,
    });
  }
};
