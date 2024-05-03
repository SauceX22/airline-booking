import { SeatClass } from "@prisma/client";
import { z } from "zod";

import {
  SeatClassPriceRestriction,
  SeatClassWeightRestriction,
} from "@/config/site";
import { newBookingFormSchema } from "@/lib/validations/general";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const ticketRouter = createTRPCRouter({
  createTickets: protectedProcedure
    .input(
      newBookingFormSchema.extend({
        flightId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.ticket.createMany({
        data: input.passengers.map(({ seatClass, ...passenger }) => ({
          name: passenger.name,
          email: passenger.email,
          seat: seatClass,
          weightKG: SeatClassWeightRestriction[seatClass],
          price: SeatClassPriceRestriction[seatClass],
          class: seatClass,
          flightId: input.flightId,
          bookedById: ctx.session.user.id,
        })),
      });
    }),
  getUserFlightTickets: protectedProcedure
    .input(
      z.object({
        flightId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.ticket.findMany({
        where: {
          flightId: input.flightId,
          bookedById: ctx.session.user.id,
        },
      });
    }),
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
  payTicket: protectedProcedure
    .input(
      z.object({
        ticketId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.ticket.update({
        where: { id: input.ticketId },
        data: {
          paymentStatus: "CONFIRMED",
          paymentDate: new Date(),
        },
      });
    }),
  deleteTicket: protectedProcedure
    .input(
      z.object({
        ticketId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.ticket.delete({ where: { id: input.ticketId } });
    }),
});
