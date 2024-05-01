import { z } from "zod";

import {
  createTRPCRouter,
  protectedManagerProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

export const ticketRouter = createTRPCRouter({
  getUserTickets: protectedProcedure
    .input(
      z.object({
        bookedById: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.ticket.findMany({
        where: {
          bookedById: ctx.session.user.id,
        },
      });
    }),
  deleteTicket: protectedManagerProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.ticket.delete({ where: { id: input.id } });
    }),
});
