"use server";

import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import prisma from "@/prisma/db";

export const verifyToken = async (token: string) => {
  const verificationToken = await getVerificationTokenByToken(token);

  if (!verificationToken) return { error: "Token does not exist!" };

  const hasExpired = new Date(verificationToken.expires) < new Date();
  if (hasExpired) return { error: "Token has Expired!" };

  const user = await getUserByEmail(verificationToken.email);
  if (!user) return { error: "Email does not exist!" };

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      emailVerified: new Date(),
      email: verificationToken.email,
    },
  });

  return { success: "Email verified!!" };
};
