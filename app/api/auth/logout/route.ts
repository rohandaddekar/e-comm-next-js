import { dbConnect } from "@/lib/db";
import { errorResponseHandler, responseHandler } from "@/lib/helpers";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    cookieStore.delete("access_token");

    return responseHandler({
      success: true,
      message: "Logout successfully",
      statusCode: 200,
      data: null,
    });
  } catch (error) {
    console.error("Logout error: ", error);
    return errorResponseHandler({
      error: error as Error,
    });
  }
};
