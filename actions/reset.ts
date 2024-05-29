"use server";

import { ResetData, ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";

export const reset = async (values: ResetData) => {
  const validate = ResetSchema.safeParse(values);

  if (!validate.success) return { error: "Invalid email!" };

  const { email } = validate.data;
  const user = await getUserByEmail(email);

  if (!user) return { error: "User not found!" };

  const passwordResetToken = await generateVerificationToken(email);
  await sendPasswordResetEmail(email, passwordResetToken.token);

  return { success: "Reset email sent!" };
};
