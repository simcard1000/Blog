import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import authConfig from "@/auth.config";
import { headers } from "next/headers";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
    async signIn({ user, account, profile, isNewUser }) {
      try {
        // Get client IP address
        const headersList = await headers();
        const forwarded = headersList.get('x-forwarded-for');
        const realIP = headersList.get('x-real-ip');
        const clientIP = forwarded?.split(',')[0] || realIP || '';

        // Update user's last login information
        await prisma.user.update({
          where: { id: user.id },
          data: {
            lastLoginIP: clientIP || null,
            lastLoginAt: new Date(),
          },
        });
      } catch (error) {
        console.error('Error updating user login info:', error);
        // Don't fail the sign-in if IP update fails
      }
    },
  },
});
