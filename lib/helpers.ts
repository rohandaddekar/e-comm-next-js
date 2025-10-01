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
