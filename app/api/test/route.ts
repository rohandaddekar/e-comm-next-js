import { dbConnect } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await dbConnect();

    return NextResponse.json({
      success: true,
      message: "Test route is working fine",
    });
  } catch (error) {
    console.error("Error in GET /api/test:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
