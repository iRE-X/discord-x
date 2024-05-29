"use server";

import { getUserByEmail } from "@/data/user";
import prisma from "@/prisma/db";
import { NewPasswordData, NewPasswordSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { getVerificationTokenByToken } from "@/data/verification-token";

export const newPassword = async (
  values: NewPasswordData,
  token: string | null,
) => {
  if (!token) return { error: "Token missing!" };

  const validate = NewPasswordSchema.safeParse(values);
  if (!validate.success) return { error: "Invalid password!" };

  const xToken = await getVerificationTokenByToken(token);
  if (!xToken) return { error: "Invalid token!" };

  const user = await getUserByEmail(xToken.email);
  if (!user) return { error: "Email does not exist!" };

  const { password } = validate.data;
  const hashed = await bcrypt.hash(password, 15);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed },
  });

  await prisma.verificationToken.delete({
    where: { id: xToken.id },
  });

  return { success: "Password updated!" };
};
