"use server";

import { getUserByEmail } from "@/data/user";
import prisma from "@/prisma/db";
import { RegisterData, RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (data: RegisterData) => {
  const verified = RegisterSchema.safeParse(data);
  if (!verified.success) return { error: "Invalid Data Provided.." };

  const { name, email, password } = verified.data;
  const exsitingUser = await getUserByEmail(email);

  if (exsitingUser) return { error: "Email already exists.." };

  const hashed = await bcrypt.hash(password, 15);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      image: "/user.png",
    },
  });

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(email, verificationToken.token);

  return { success: "Verification email sent.." };
};
