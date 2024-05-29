import prisma from "@/prisma/db";
import { v4 as uuidv4 } from "uuid";

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  await prisma.verificationToken.deleteMany({
    where: {
      email,
    },
  });

  const verificationToken = await prisma.verificationToken.create({
    data: {
      token,
      expires,
      email,
    },
  });

  return verificationToken;
};
