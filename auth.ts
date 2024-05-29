import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import prisma from "@/prisma/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { LOGIN_URL, REGISTER_URL } from "@/routes";
import { getUserById } from "@/data/user";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: LOGIN_URL,
    newUser: REGISTER_URL,
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      if (!user.id) return false;
      const existingUser = await getUserById(user.id);

      return !!existingUser?.emailVerified;
    },
    async session({ token, session }) {
      if (token.sub) {
        session.user.id = token.sub;
      }

      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});
