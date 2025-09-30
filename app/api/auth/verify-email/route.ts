import { dbConnect } from "@/lib/db";
import { errorResponseHandler, responseHandler } from "@/lib/helpers";
import User from "@/models/user";
import { jwtVerify } from "jose";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await dbConnect();

    const { token } = await req.json();

    if (!token)
      return responseHandler({
        success: false,
        message: "Token is required",
        statusCode: 400,
      });

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);

    const decodedToken = await jwtVerify(token, secret);

    const userId = decodedToken.payload.userId;

    const user = await User.findById(userId);
    if (!user)
      return responseHandler({
        success: false,
        message: "User not found",
        statusCode: 404,
      });

    user.isEmailVerified = true;
    await user.save();

    return responseHandler({
      success: true,
      message: "Email verified successfully",
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error in email verification: ", error);

    return errorResponseHandler({
      error: error as Error,
    });
  }
};
