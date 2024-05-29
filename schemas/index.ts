import z from "zod";

// Login
export const LoginSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type LoginData = z.infer<typeof LoginSchema>;

// Register User
export const RegisterSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name should contains at least 3 Characters" }),
  email: z.string().email(),
  password: z.string(),
});

export type RegisterData = z.infer<typeof RegisterSchema>;

// Reset-Password
export const ResetSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
});

export type ResetData = z.infer<typeof ResetSchema>;

export const NewPasswordSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Password should be at least 6 characters long" }),
});

export type NewPasswordData = z.infer<typeof NewPasswordSchema>;
