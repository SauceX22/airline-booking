import { z } from "zod";

import {
  SeatClassPriceRestriction,
  SeatClassWeightRestriction,
} from "@/config/site";
import {
  newBookingFormSchema,
  updateTicketSchema,
} from "@/lib/validations/general";
import {
  createTRPCRouter,
  protectedAdminProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

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
  getThisUserTickets: protectedProcedure
    .input(
      z.object({
        filter: z
          .object({
            flightId: z.string(),
          })
          .partial()
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.ticket.findMany({
        where: {
          flightId: input.filter?.flightId,
          OR: [
            { bookedById: ctx.session.user.id },
            { passengerEmail: ctx.session.user.email },
          ],
        },
        include: {
          Payment: {
            include: {
              Card: true,
            },
          },
          BookedBy: true,
        },
      });
    }),
  getAllTickets: protectedAdminProcedure
    .input(
      z.object({
        filter: z
          .object({
            flightId: z.string(),
            bookedById: z.string(),
          })
          .partial()
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.ticket.findMany({
        where: {
          flightId: input.filter?.flightId,
          bookedById: input.filter?.bookedById,
        },
        include: {
          Payment: {
            include: {
              Card: true,
            },
          },
          BookedBy: true,
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
            create: {
              date: new Date(),
              Card: { connect: { id: input.cardId } },
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
