import { dbConnect } from "@/lib/db";
import { errorResponseHandler, responseHandler } from "@/lib/helpers";
import { zSchema } from "@/lib/zodSchema";
import Otp from "@/models/otp";
import User from "@/models/user";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await dbConnect();

    const payload = await req.json();

    const validationSchema = zSchema.pick({
      email: true,
      otp: true,
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

    const { email, otp } = validatedData.data;

    const otpData = await Otp.findOne({ email, otp });
    if (!otpData) {
      return responseHandler({
        success: false,
        statusCode: 400,
        message: "Invalid OTP or expired OTP",
      });
    }

    const user = await User.findOne({ email, deletedAt: null });
    if (!user) {
      return responseHandler({
        success: false,
        message: "User not found",
        statusCode: 404,
      });
    }

    const loggedInUserData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      role: user.role,
    };

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const token = await new SignJWT({ userId: user._id.toString() })
      .setIssuedAt()
      .setExpirationTime("1h")
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    const cookieStore = await cookies();
    cookieStore.set({
      name: "access_token",
      value: token,
      httpOnly: process.env.NODE_ENV === "production",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    await otpData.deleteOne();

    return responseHandler({
      success: true,
      message: "OTP verified successfully",
      statusCode: 200,
      data: { user: loggedInUserData },
    });
  } catch (error) {
    console.error("Error in OTP verification: ", error);

    return errorResponseHandler({
      error: error as Error,
    });
  }
};
