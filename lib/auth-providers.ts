import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import bcrypt from "bcryptjs";

export const authProviders = [
  CredentialsProvider({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      const user = await db.user.findUnique({
        where: {
          email: credentials.email,
        },
      });

      if (!user) {
        return null;
      }

      // For demo purposes, we'll use a simple password check
      // In production, you should hash passwords properly
      const isPasswordValid = credentials.password === "password123" || 
        (user.email === "admin@example.com" && credentials.password === "admin123");

      if (!isPasswordValid) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      };
    },
  }),
];
