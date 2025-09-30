import { z } from "zod";

export const zSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Enter a valid email address" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(64, { message: "Password must be at most 64 characters" })
    .regex(/[a-z]/, { message: "Include at least one lowercase letter" })
    .regex(/[A-Z]/, { message: "Include at least one uppercase letter" })
    .regex(/\d/, { message: "Include at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Include at least one symbol" }),

  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be at most 50 characters" }),
});

export type ZSchema = z.infer<typeof zSchema>;
