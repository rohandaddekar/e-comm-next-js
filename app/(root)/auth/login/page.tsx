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
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import Link from "next/link";
import { APP_REGISTER } from "@/routes/app";

const formSchema = zSchema
  .pick({
    email: true,
  })
  .extend({
    password: z.string().min(6, "Password is required"),
  });

const defaultValues = {
  email: "",
  password: "",
};

const LoginPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("login form values: ", values);
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

        <div className="text-center mt-4">
          <h1 className="font-bold text-3xl mb-2">Login Into Account</h1>
          <p>Login into your account by filling out the form below.</p>
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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>

                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <AppButton
                  type="submit"
                  text="Login"
                  loading={loading}
                  onClick={form.handleSubmit(handleSubmit)}
                  className="w-full"
                />
              </div>

              <div>
                <Link
                  href="#"
                  className="block text-center text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="flex justify-center items-center gap-1">
                <p>Don&apos;t have an account?</p>
                <Link
                  href={APP_REGISTER}
                  className="text-primary hover:underline"
                >
                  Create an account
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginPage;
