import cloudinary from "@/lib/cloudinary";
import { dbConnect } from "@/lib/db";
import {
  errorResponseHandler,
  isAuthenticated,
  responseHandler,
} from "@/lib/helpers";
import Media from "@/models/media";
import { NextRequest } from "next/server";
import mongoose from "mongoose";

export const PUT = async (req: NextRequest) => {
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

    const payload = await req.json();

    const ids = payload.ids || [];
    const deleteType = payload.deleteType || "SD";

    if (!Array.isArray(ids) || ids.length === 0) {
      return responseHandler({
        success: false,
        message: "No media IDs provided or invalid format",
        statusCode: 400,
        data: null,
      });
    }

    const media = await Media.find({ _id: { $in: ids } });
    if (media.length === 0) {
      return responseHandler({
        success: false,
        message: "No media found for the provided IDs",
        statusCode: 404,
        data: null,
      });
    }

    if (!["SD", "RSD"].includes(deleteType)) {
      return responseHandler({
        success: false,
        message: "Invalid delete type, must be 'SD' or 'RSD'",
        statusCode: 400,
        data: null,
      });
    }

    if (deleteType === "SD") {
      await Media.updateMany(
        {
          _id: { $in: ids },
        },
        {
          $set: {
            deletedAt: new Date().toISOString(),
          },
        }
      );
    } else {
      await Media.updateMany(
        {
          _id: { $in: ids },
        },
        {
          $set: {
            deletedAt: null,
          },
        }
      );
    }

    return responseHandler({
      success: true,
      message:
        deleteType === "SD"
          ? "Media soft deleted successfully"
          : "Media restored successfully",
      statusCode: 200,
      data: null,
    });
  } catch (error) {
    console.error("Failed to update media: ", error);
    return errorResponseHandler({
      error: error as Error,
    });
  }
};

export const DELETE = async (req: NextRequest) => {
  const session = await mongoose.startSession();
  session.startTransaction();

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

    const payload = await req.json();

    const ids = payload.ids || [];
    const deleteType = payload.deleteType || "SD";

    if (!Array.isArray(ids) || ids.length === 0) {
      return responseHandler({
        success: false,
        message: "No media IDs provided or invalid format",
        statusCode: 400,
        data: null,
      });
    }

    const media = await Media.find({ _id: { $in: ids } }).session(session);
    if (media.length === 0) {
      return responseHandler({
        success: false,
        message: "No media found for the provided IDs",
        statusCode: 404,
        data: null,
      });
    }

    if (deleteType !== "PD") {
      return responseHandler({
        success: false,
        message: "Invalid delete type, must be 'PD'",
        statusCode: 400,
        data: null,
      });
    }

    await Media.deleteMany({ _id: { $in: ids } }).session(session);

    const publicIds = media.map((file) => file.public_id);
    try {
      await cloudinary.api.delete_resources(publicIds);
    } catch (error) {
      console.error("Failed to delete media from Cloudinary: ", error);
      await session.abortTransaction();
      session.endSession();
    }

    await session.commitTransaction();
    session.endSession();

    return responseHandler({
      success: true,
      message: "Media permanently deleted successfully",
      statusCode: 200,
      data: null,
    });
  } catch (error) {
    console.error("Failed to update media: ", error);
    return errorResponseHandler({
      error: error as Error,
    });
  }
};
