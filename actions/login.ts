"use server";

import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginData, LoginSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import prisma from "@/prisma/db";
import { AuthError } from "next-auth";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";

export const login = async (data: LoginData) => {
  const verified = LoginSchema.safeParse(data);
  if (!verified.success) return { error: "Invalid Credentials.." };

  const { email, password } = verified.data;
  const user = await getUserByEmail(email);

  if (!user) return { error: "User not found.." };
  if (!user.password)
    return { error: "Invalid Login method. Use Google/GitHub Login" };

  const psk = await bcrypt.compare(password, user.password);
  if (!psk) return { error: "Invalid Password.." };

  if (!user.emailVerified) {
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(email, verificationToken.token);
    return { success: "Verification email sent!" };
  }

  await prisma.verificationToken.deleteMany({
    where: {
      email,
    },
  });

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: "invalid credentials",
          };
        default:
          return {
            error: "something went wrong",
          };
      }
    }

    throw error;
  }

  return { error: "Something Went Wrong..." };
};
