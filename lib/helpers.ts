import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface ResponseHandlerParams {
  success: boolean;
  statusCode: number;
  message: string;
  data?: unknown;
  error?: unknown;
}

interface MongoError {
  code?: number;
  keyPattern?: Record<string, unknown>;
  message?: string;
}

interface ErrorResponseHandlerParams {
  error: MongoError;
  statusCode?: number;
  message?: string;
}

export const responseHandler = ({
  success,
  statusCode,
  message,
  data = null,
  error = null,
}: ResponseHandlerParams) => {
  return NextResponse.json(
    {
      success,
      message,
      data,
      error,
    },
    { status: statusCode }
  );
};

export const errorResponseHandler = ({
  error,
  statusCode = 500,
  message = "Internal Server Error",
}: ErrorResponseHandlerParams) => {
  let finalMessage = message;

  if (error.code === 11000 && error.keyPattern) {
    const keys = Object.keys(error.keyPattern).join(", ");
    finalMessage = `Duplicate fields: ${keys}. These fields must be unique.`;
  }

  let errorObj = {};

  if (process.env.NODE_ENV === "development") {
    errorObj = {
      message: error.message || "Unknown error",
      error,
    };
  } else {
    errorObj = {
      message: finalMessage,
    };
  }

  return responseHandler({
    success: false,
    statusCode,
    message: finalMessage,
    error: errorObj,
  });
};

export const generateOtp = (digits: number = 6) => {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  const otp = Math.floor(min + Math.random() * (max - min + 1));
  return otp.toString();
};

export const isAuthenticated = async (role: "user" | "admin") => {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.has("access_token")) {
      return {
        isAuth: false,
      };
    }

    const access_token = cookieStore.get("access_token");

    const { payload } = await jwtVerify(
      access_token?.value || "",
      new TextEncoder().encode(process.env.SECRET_KEY)
    );

    if (payload.role !== role) {
      return { isAuth: false };
    }

    return { isAuth: true, userId: payload.userId };
  } catch (error) {
    console.error("Authentication error: ", error);
    return { isAuth: false };
  }
};
