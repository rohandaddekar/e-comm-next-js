import mongoose, { Document, Schema } from "mongoose";

interface IOTP extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
}

const otpSchema = new Schema<IOTP>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
      trim: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
    },
  },
  { timestamps: true }
);

otpSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 } // TTL index to auto-delete expired OTPs
);

const Otp =
  mongoose.models.Otp || mongoose.model<IOTP>("Otp", otpSchema, "otps");

export default Otp;
