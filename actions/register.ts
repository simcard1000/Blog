"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { RegisterSchema } from "@/schemas";
import { prisma } from "@/lib/prisma";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>, redirectTo?: string) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields." };
  }

  // Check honeypot field
  if (validatedFields.data.website) {
    return { error: "Invalid submission." };
  }

  const { username, password, email } = validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  // Check for existing email
  const existingUserByEmail = await getUserByEmail(email);
  if (existingUserByEmail) {
    return { error: "Email already exists." };
  }

  // Create new user
  await prisma.user.create({
    data: {
      name: username,
      email,
      password: hashedPassword,
    },
  });

  const verificationToken = await generateVerificationToken(email);
  
  // Create verification URL
  const verificationUrl = redirectTo 
    ? `${process.env.NEXT_PUBLIC_APP_URL}/new-verification?token=${verificationToken.token}&redirect=${encodeURIComponent(redirectTo)}`
    : `${process.env.NEXT_PUBLIC_APP_URL}/new-verification?token=${verificationToken.token}`;
  
  await sendVerificationEmail(verificationToken.email, verificationToken.token, verificationUrl);

  return { success: "Successfully registered. Verify your email!" };
};