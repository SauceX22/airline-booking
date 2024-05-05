import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  SeatClassPriceRestriction,
  SeatClassWeightRestriction,
} from "@/config/site";
import { generateRandomSeat } from "@/lib/utils";
import { newBookingFormSchema } from "@/lib/validations/general";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const ticketRouter = createTRPCRouter({
  createTickets: protectedProcedure
    .input(
      newBookingFormSchema.extend({
        flightId: z.string(),
        payLater: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.ticket.createMany({
        data: input.passengers.map(({ seatClass, ...passenger }) => ({
          passengerName: passenger.name,
          passengerEmail: passenger.email,
          seat: passenger.seat,
          class: seatClass,
          weightKG: SeatClassWeightRestriction[seatClass],
          price: SeatClassPriceRestriction[seatClass],
          paymentStatus: input.payLater ? "PENDING" : "CONFIRMED",
          paymentDate: input.payLater ? undefined : new Date(),
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
