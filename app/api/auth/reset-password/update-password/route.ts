import { dbConnect } from "@/lib/db";
import { errorResponseHandler, responseHandler } from "@/lib/helpers";
import { zSchema } from "@/lib/zodSchema";
import User from "@/models/user";
import { NextRequest } from "next/server";

export const PUT = async (req: NextRequest) => {
  try {
    await dbConnect();

    const payload = await req.json();

    const validationSchema = zSchema.pick({
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

    const { email, password } = validatedData.data;

    const user = await User.findOne({ email, deletedAt: null }).select(
      "+password"
    );
    if (!user) {
      return responseHandler({
        success: false,
        message: "User not found",
        statusCode: 404,
      });
    }

    user.password = password;
    await user.save();

    return responseHandler({
      success: true,
      message: "Password updated successfully",
      statusCode: 200,
      data: null,
    });
  } catch (error) {
    console.error("Error in updating password: ", error);

    return errorResponseHandler({
      error: error as Error,
    });
  }
};
