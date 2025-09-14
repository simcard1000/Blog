import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 24 * 3600 * 1000);

  try {
    // Delete any existing verification token for this email
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    const verificationToken = await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    return verificationToken;
  } catch (error) {
    console.error("Error generating verification token:", error);
    throw new Error("Failed to generate verification token");
  }
};