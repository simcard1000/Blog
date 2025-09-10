import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./db"
import { authProviders } from "./auth-providers"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: authProviders,
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
}
