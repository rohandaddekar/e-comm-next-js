import { dbConnect } from "@/lib/db";
import {
  errorResponseHandler,
  isAuthenticated,
  responseHandler,
} from "@/lib/helpers";
import Media from "@/models/media";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
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

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "0", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const deleteType = searchParams.get("deleteType"); // It can be SD (soft delete) | RSD (restore soft delete) | PD (permanent delete)

    let filter = {};

    if (deleteType === "SD") {
      filter = {
        deletedAt: null,
      };
    } else if (deleteType === "PD") {
      filter = {
        deletedAt: { $ne: null },
      };
    }

    const medias = await Media.find(filter)
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .skip(page * limit) // Skip the documents for previous pages
      .limit(limit); // Limit the number of documents to return

    const totalMedias = await Media.countDocuments(filter);

    return responseHandler({
      success: true,
      message: "Media fetched successfully",
      statusCode: 200,
      data: { medias, hasMore: totalMedias > (page + 1) * limit },
    });
  } catch (error) {
    console.log("Failed to fetch media: ", error);
    return errorResponseHandler({
      error: error as Error,
    });
  }
};
