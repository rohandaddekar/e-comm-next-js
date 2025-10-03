import cloudinary from "@/lib/cloudinary";
import { errorResponseHandler } from "@/lib/helpers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const payload = await req.json();
    const { paramsToSign } = payload;

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_SECRET_KEY!
    );

    return NextResponse.json({ signature });
  } catch (error) {
    console.error("Cloudinary signature error: ", error);
    return errorResponseHandler({
      error: error as Error,
    });
  }
};
