import cloudinary from "@/lib/cloudinary";
import { dbConnect } from "@/lib/db";
import {
  errorResponseHandler,
  isAuthenticated,
  responseHandler,
} from "@/lib/helpers";
import Media from "@/models/media";
import { NextRequest } from "next/server";

interface UploadedFile {
  public_id: string;
  [key: string]: unknown; // allow other fields without strict typing
}

export const POST = async (req: NextRequest) => {
  const payload: UploadedFile[] = await req.json();

  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return responseHandler({
        success: false,
        message: "Unauthorized",
        statusCode: 403,
        data: null,
      });
    }

    await dbConnect();

    const newMedia = await Media.insertMany(payload);

    return responseHandler({
      success: true,
      message: "Media created successfully",
      statusCode: 200,
      data: newMedia,
    });
  } catch (err: unknown) {
    console.error("Failed to create media: ", err);

    if (payload && payload.length > 0) {
      const publicIds = payload.map((file: UploadedFile) => file.public_id);

      try {
        await cloudinary.api.delete_resources(publicIds);
      } catch (deleteError) {
        console.error("Failed to clean up Cloudinary resources:", deleteError);
        // safely extend err
        (err as Record<string, unknown>).cloudinary = deleteError;
      }
    }

    return errorResponseHandler({
      error: err as Error, // safe cast for your helper
    });
  }
};
