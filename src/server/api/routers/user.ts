import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import { z } from "zod";

import { userAuthRegisterSchema } from "@/lib/validations/auth";
import {
  createTRPCRouter,
  protectedAdminProcedure,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(userAuthRegisterSchema)
    .mutation(async ({ ctx, input }) => {
      const exists = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (exists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User with this email already exists",
        });
      }

      let hashedPassword;
      try {
        hashedPassword = await bcrypt.hash(input.password, 10);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to hash password",
          cause: error,
        });
      }

      return await ctx.db.user.create({
        data: {
          ...input,
          passwordHash: hashedPassword,
        },
      });
    }),
  getAll: protectedAdminProcedure.query(async ({ ctx }) => {
    return await ctx.db.user.findMany({
      where: {
        id: {
          not: ctx.session.user.id,
        },
      },
    });
  }),
  getUser: protectedAdminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.user.findUnique({ where: { id: input.id } });
    }),
  updateUsername: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          name: input.name,
        },
      });
    }),
  updateUser: protectedAdminProcedure
    .input(
      z
        .object({
          id: z.string(),
        })
        .and(
          z
            .object({
              name: z.string(),
              email: z.string().email(),
            })
            .partial()
        )
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.update({
        where: { id: input.id },
        data: {
          name: input.name,
          email: input.email,
        },
      });
    }),
  deleteUser: protectedAdminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.delete({ where: { id: input.id } });
    }),
});
