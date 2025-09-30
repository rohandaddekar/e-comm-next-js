import { emailVerificationLink } from "@/emails/emailVerificationLink";
import { dbConnect } from "@/lib/db";
import { errorResponseHandler, responseHandler } from "@/lib/helpers";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import User from "@/models/user";
import { SignJWT } from "jose";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await dbConnect();

    const payload = await req.json();

    const validationSchema = zSchema.pick({
      name: true,
      email: true,
      password: true,
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

    const { name, email, password } = validatedData.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return responseHandler({
        success: false,
        statusCode: 400,
        message: "User already exists",
      });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);

    const token = await new SignJWT({ userId: newUser._id.toString() })
      .setIssuedAt()
      .setExpirationTime("1h")
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    await sendMail({
      to: newUser.email,
      subject: "Verify your email",
      body: emailVerificationLink(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`
      ),
    });

    return responseHandler({
      success: true,
      statusCode: 201,
      message: "User registered successfully, please verify your email",
      data: newUser,
    });
  } catch (error) {
    console.error("Error during user registration:", error);

    return errorResponseHandler({
      error: error as Error,
    });
  }
};
