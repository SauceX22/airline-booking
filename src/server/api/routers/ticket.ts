import { z } from "zod";

import { createTRPCRouter, protectedManagerProcedure } from "@/server/api/trpc";

export const ticketRouter = createTRPCRouter({
  deleteTicket: protectedManagerProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.ticket.delete({ where: { id: input.id } });
    }),
});
