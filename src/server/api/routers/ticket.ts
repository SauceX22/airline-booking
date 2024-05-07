import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  SeatClassPriceRestriction,
  SeatClassWeightRestriction,
} from "@/config/site";
import { generateRandomSeat } from "@/lib/utils";
import {
  newBookingFormSchema,
  updateTicketSchema,
} from "@/lib/validations/general";
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
          passengerName: passenger.name,
          passengerEmail: passenger.email,
          seat: passenger.seat,
          class: seatClass,
          weightKG: SeatClassWeightRestriction[seatClass],
          price: SeatClassPriceRestriction[seatClass],
          paymentStatus: "PENDING",
          flightId: input.flightId,
          bookedById: ctx.session.user.id,
        })),
      });
    }),
  updateTicket: protectedProcedure
    .input(
      updateTicketSchema.extend({
        ticketId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.ticket.update({
        where: { id: input.ticketId },
        data: {
          passengerName: input.name,
          passengerEmail: input.email,
          seat: input.seat,
          class: input.seatClass,
        },
      });
    }),
  getTicket: protectedProcedure
    .input(
      z.object({
        ticketId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.ticket.findUnique({
        where: { id: input.ticketId },
        include: {
          Flight: {
            include: {
              Plane: true,
            },
          },
          Payment: {
            include: {
              Card: true,
            },
          },
        },
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
        include: {
          Payment: {
            include: {
              Card: true,
            },
          },
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
        include: {
          Payment: {
            include: {
              Card: true,
            },
          },
        },
      });
    }),
  payTicket: protectedProcedure
    .input(
      z.object({
        ticketId: z.string(),
        cardId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.ticket.update({
        where: { id: input.ticketId },
        data: {
          paymentStatus: "CONFIRMED",
          Payment: {
            upsert: {
              where: {
                AND: [{ ticketId: input.ticketId }, { cardId: input.cardId }],
              },
              update: {
                date: new Date(),
                Card: { connect: { id: input.cardId } },
              },
              create: {
                date: new Date(),
                Card: { connect: { id: input.cardId } },
              },
            },
          },
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
