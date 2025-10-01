import { zSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import AppButton from "@/components/app//Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

interface OtpVerificationProps {
  email: string;
  onSubmit: (values: z.infer<typeof otpVerificationSchema>) => void;
  loading: boolean;
}

export const otpVerificationSchema = zSchema.pick({
  email: true,
  otp: true,
});

const OtpVerification: React.FC<OtpVerificationProps> = ({
  email,
  onSubmit,
  loading,
}) => {
  const [resendOtpLoading, setResendOtpLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof otpVerificationSchema>>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: { otp: "", email },
  });

  const handleSubmit = async (
    values: z.infer<typeof otpVerificationSchema>
  ) => {
    onSubmit(values);
  };

  const resendOtp = async () => {
    try {
      setResendOtpLoading(true);

      const { data } = await axios.post("/api/auth/resend-otp", { email });

      if (!data?.success) throw new Error(data?.message || "Resend OTP failed");

      toast.success(data?.message || "Resend OTP successful!");
    } catch (error: unknown) {
      console.error("Resend OTP error: ", error);

      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError?.response?.data?.message || "Resend OTP failed!");
    } finally {
      setResendOtpLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div>
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.value = target.value.replace(/[^0-9]/g, ""); // remove non-numeric
                      field.onChange(target.value);
                    }}
                    {...field}
                  >
                    <InputOTPGroup className="w-full gap-2 justify-center">
                      <InputOTPSlot
                        index={0}
                        className="text-xl size-11 rounded-md"
                      />
                      <InputOTPSlot
                        index={1}
                        className="text-xl size-11 rounded-md"
                      />
                      <InputOTPSlot
                        index={2}
                        className="text-xl size-11 rounded-md"
                      />
                      <InputOTPSlot
                        index={3}
                        className="text-xl size-11 rounded-md"
                      />
                      <InputOTPSlot
                        index={4}
                        className="text-xl size-11 rounded-md"
                      />
                      <InputOTPSlot
                        index={5}
                        className="text-xl size-11 rounded-md"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <AppButton
            type="submit"
            text="Verify OTP"
            loading={loading}
            onClick={form.handleSubmit(handleSubmit)}
            className="w-full"
          />

          <div className="text-center mt-4">
            <button
              type="button"
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={resendOtp}
              disabled={resendOtpLoading}
            >
              {resendOtpLoading ? "Resending OTP..." : "Resend OTP"}
            </button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default OtpVerification;
