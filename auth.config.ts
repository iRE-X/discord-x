import { getUserByEmail } from "@/data/user";
import { LoginSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export default {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
        Credentials({
            async authorize(credentials) {
                const validate = LoginSchema.safeParse(credentials);

                if (!validate.success) return null;

                const { email, password } = validate.data;

                const user = await getUserByEmail(email);
                if (!user || !user.password) return null;

                const verify = await bcrypt.compare(password, user.password);

                if (!verify) return null;

                return user;
            },
        }),
    ],
    secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;
