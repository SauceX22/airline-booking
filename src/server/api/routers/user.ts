import { z } from "zod";

import {
  createTRPCRouter,
  protectedManagerProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  getAll: protectedManagerProcedure.query(async ({ ctx }) => {
    return await ctx.db.user.findMany({
      where: {
        id: {
          not: ctx.session.user.id,
        },
      },
    });
  }),
  getUser: protectedManagerProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.user.findUnique({ where: { id: input.id } });
    }),
  updateUsername: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          name: input.name,
        },
      });
    }),
  updateUser: protectedManagerProcedure
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
            .partial(),
        ),
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
  deleteUser: protectedManagerProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.delete({ where: { id: input.id } });
    }),
});
