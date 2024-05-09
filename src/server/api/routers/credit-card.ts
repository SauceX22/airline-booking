import { z } from "zod";

import { newCardFormSchema } from "@/lib/validations/general";
import {
  createTRPCRouter,
  protectedAdminProcedure,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const creditCardRouter = createTRPCRouter({
  create: protectedProcedure
    .input(newCardFormSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.creditCard.create({
        data: {
          name: input.name,
          number: input.number,
          expiry: input.expiry,
          cvc: input.cvc,
          User: { connect: { id: ctx.session.user.id } },
        },
      });
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.creditCard.findMany({
      orderBy: {
        id: "desc",
      },
    });
  }),
});
