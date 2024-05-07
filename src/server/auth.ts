import { PrismaAdapter } from "@auth/prisma-adapter";
import type Prisma from "@prisma/client";
import bcrypt from "bcrypt";
import NextAuth, { type DefaultSession } from "next-auth";
import { decode, encode } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { z, ZodError } from "zod";

import { env } from "@/env.mjs";
import { db } from "@/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: Omit<Prisma.User, "passwordHash">;
  }
}

export const signInSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(6, "Password must be more than 6 characters")
    .max(32, "Password must be less than 32 characters"),
});

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
  session: {
    strategy: "jwt",
  },
  jwt: { encode, decode },
  secret: env.AUTH_SECRET,
  debug: env.NODE_ENV === "development",
  pages: {
    signIn: "/auth/login",
  },
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      id: "credentials",
      name: "Credentials",
      type: "credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          if (!credentials?.email || !credentials.password) {
            return null;
          }

          const { email, password } =
            await signInSchema.parseAsync(credentials);

          // autorize user usnig prisma
          const user = await db.user.findUnique({
            where: {
              email: email,
            },
          });

          if (!user) {
            return null;
          }

          const passwordMatch = await bcrypt.compare(
            password,
            user.passwordHash
          );

          if (!passwordMatch) {
            return null;
          }

          if (!user.enabled) {
            // throw a 401 error if the user is not enabled
            throw new Error("BannedError");
          }

          return user;
        } catch (error) {
          return null;
        }
      },
    }),
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
