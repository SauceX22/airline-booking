import { PrismaAdapter } from "@auth/prisma-adapter";
import { type User } from "@prisma/client";

import { env } from "@/env.mjs";
import { db } from "@/server/db";
import NextAuth, { type DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    session: async ({ session }) => {
      if (!session.user.email) {
        throw new Error("Session token is invalid");
      }
      const user = await db.user.findUnique({
        where: {
          email: session.user.email,
        },
      });
      if (!user) {
        throw new Error("User not found");
      }

      return {
        expires: session.expires,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        },
      };
    },
  },
  secret: env.AUTH_SECRET,
  debug: env.NODE_ENV === "development",
  pages: {
    signIn: "/auth/login",
  },
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
});
