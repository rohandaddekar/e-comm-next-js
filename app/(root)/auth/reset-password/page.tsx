"use client";

import { Card, CardContent } from "@/components/ui/card";
import { zSchema } from "@/lib/zodSchema";
import Logo from "@/public/assets/images/logo-black.png";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AppButton from "@/components/app/Button";
import { useState } from "react";
import Link from "next/link";
import { APP_LOGIN } from "@/routes/app";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import OtpVerification, {
  otpVerificationSchema,
} from "@/components/app/OtpVerification";
import UpdatePassword from "@/components/app/UpdatePassword";

const formSchema = zSchema.pick({
  email: true,
});

const defaultValues = {
  email: "",
};

const ResetPasswordPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [otpVerificationLoading, setOtpVerificationLoading] =
    useState<boolean>(false);
  const [otpEmail, setOtpEmail] = useState<string | null>(null);
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        "/api/auth/reset-password/send-otp",
        values
      );

      if (!data?.success)
        throw new Error(data?.message || "Sending OTP failed");

      setOtpEmail(values.email);

      toast.success(data?.message || "OTP sent successfully!");
    } catch (error: unknown) {
      console.error("OTP sending error: ", error);

      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError?.response?.data?.message || "OTP sending failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async (
    values: z.infer<typeof otpVerificationSchema>
  ) => {
    try {
      setOtpVerificationLoading(true);

      const { data } = await axios.post(
        "/api/auth/reset-password/verify-otp",
        values
      );

      if (!data?.success)
        throw new Error(data?.message || "OTP verification failed");

      setIsOtpVerified(true);

      toast.success(data?.message || "OTP verification successful!");
    } catch (error: unknown) {
      console.error("OTP verification error: ", error);

      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError?.response?.data?.message || "OTP verification failed!"
      );
    } finally {
      setOtpVerificationLoading(false);
    }
  };

  return (
    <Card className="w-[450px]">
      <CardContent>
        <div className="flex justify-center">
          <Image
            src={Logo.src}
            alt="Logo"
            width={Logo.width}
            height={Logo.height}
            className="max-w-[150px]"
          />
        </div>

        {!otpEmail ? (
          <>
            <div className="text-center mt-4">
              <h1 className="font-bold text-3xl mb-2">Reset Password</h1>
              <p>Reset your password by filling out the form below.</p>
            </div>

            <div className="mt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-4"
                >
                  <div>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="example@gmail.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <AppButton
                      type="submit"
                      text="Send Reset Link"
                      loading={loading}
                      onClick={form.handleSubmit(handleSubmit)}
                      className="w-full"
                    />
                  </div>

                  <div className="flex justify-center items-center gap-1">
                    <Link
                      href={APP_LOGIN}
                      className="text-primary hover:underline"
                    >
                      Back to Login
                    </Link>
                  </div>
                </form>
              </Form>
            </div>
          </>
        ) : !isOtpVerified ? (
          <>
            <div className="text-center mt-4">
              <h1 className="font-bold text-3xl mb-2">OTP Verification</h1>
              <p>Enter the OTP sent to your email to verify your account.</p>
            </div>

            <div className="mt-6">
              <OtpVerification
                email={otpEmail}
                onSubmit={handleOtpVerification}
                loading={otpVerificationLoading}
              />
            </div>
          </>
        ) : (
          <>
            <div className="text-center mt-4">
              <h1 className="font-bold text-3xl mb-2">Update Password</h1>
              <p>Enter your new password below.</p>
            </div>

            <div className="mt-6">
              <UpdatePassword email={otpEmail} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ResetPasswordPage;
