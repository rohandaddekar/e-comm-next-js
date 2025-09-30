"use client";

import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { use, useEffect, useState } from "react";
import VERIFIED_IMG from "@/public/assets/images/verified.gif";
import VERIFICATION_FAILD_IMG from "@/public/assets/images/verification-failed.gif";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { APP_HOME } from "@/routes/app";

interface EmailVerificationProps {
  params: Promise<{ token: string }>;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ params }) => {
  const { token } = use(params);

  const [isVerified, setIsVerified] = useState<boolean>(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const { data } = await axios.post("/api/auth/verify-email", { token });

      if (data.success) setIsVerified(true);
    };

    verifyEmail();
  }, [token]);

  return (
    <Card className="w-[450px]">
      <CardContent>
        {isVerified ? (
          <div>
            <div className="flex justify-center items-center">
              <Image
                src={VERIFIED_IMG}
                alt="Email Verified"
                height={VERIFIED_IMG.height}
                width={VERIFIED_IMG.width}
                className="w-auto h-[100px]"
              />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold my-5 text-gray-500">
                Email Verified Successfully
              </h1>

              <Button asChild>
                <Link href={APP_HOME}>Continue Shopping</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-center items-center">
              <Image
                src={VERIFICATION_FAILD_IMG}
                alt="Email Verification Failed"
                height={VERIFICATION_FAILD_IMG.height}
                width={VERIFICATION_FAILD_IMG.width}
                className="w-auto h-[100px]"
              />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold my-5 text-red-500">
                Email Verification Failed
              </h1>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailVerification;
