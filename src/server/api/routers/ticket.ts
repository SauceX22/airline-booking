import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  MAX_WAITLIST_TICKETS,
  SeatClassPriceRestriction,
  SeatClassWeightRestriction,
} from "@/config/site";
import { getFine } from "@/lib/utils";
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
          status: "PENDING",
          flightId: input.flightId,
          bookedById: ctx.session.user.id,
        })),
      });
    }),
  createWaitlistTickets: protectedProcedure
    .input(
      newBookingFormSchema.extend({
        flightId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const waitlistTicketsCount = await ctx.db.ticket.count({
        where: {
          flightId: input.flightId,
          status: "WAITLISTED",
          waitlistOrder: {
            // 0 not counted as a waitlist ticket
            gt: 0,
          },
        },
      });
      // if waitlist tickets count is greater than the max allowed
      if (waitlistTicketsCount >= MAX_WAITLIST_TICKETS) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Maximum number of waitlist tickets reached (10). Please try again later.",
        });
      }
      // if they are trying to book more tickets than available waitlist seats
      if (
        waitlistTicketsCount + input.passengers.length >
        MAX_WAITLIST_TICKETS
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "You can't book more tickets than available waitlist seats (10). Please try again later.",
        });
      }
      const waitlistOrderStart = waitlistTicketsCount + 1;
      return await ctx.db.ticket.createMany({
        data: input.passengers.map(({ seatClass, ...passenger }, index) => ({
          passengerName: passenger.name,
          passengerEmail: passenger.email,
          seat: passenger.seat,
          class: seatClass,
          weightKG: SeatClassWeightRestriction[seatClass],
          price: SeatClassPriceRestriction[seatClass],
          status: "WAITLISTED",
          waitlistOrder: waitlistOrderStart + index,
          flightId: input.flightId,
          bookedById: ctx.session.user.id,
        })),
      });
    }),
  promoteTicket: protectedProcedure
    .input(
      z.object({
        ticketId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // promote ticket to confirmed, and push all other waitlisted tickets 1 order down
      const ticket = await ctx.db.ticket.findUniqueOrThrow({
        where: { id: input.ticketId },
      });

      await ctx.db.ticket.updateMany({
        where: {
          status: "WAITLISTED",
          waitlistOrder: { gt: ticket.waitlistOrder },
        },
        data: {
          waitlistOrder: { decrement: 1 },
        },
      });

      return await ctx.db.ticket.update({
        where: { id: input.ticketId },
        data: {
          status: "CONFIRMED",
          waitlistOrder: 0,
        },
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
              Tickets: true,
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
          status: "CONFIRMED",
          Payment: {
            create: {
              date: new Date(),
              Card: { connect: { id: input.cardId } },
            },
          },
        },
      });
    }),
  cancelTicket: protectedProcedure
    .input(
      z.object({
        ticketId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.db.ticket.findUniqueOrThrow({
        where: { id: input.ticketId },
        include: {
          BookedBy: true,
          Payment: {
            include: {
              Card: {
                include: {
                  CardOwner: true,
                },
              },
            },
          },
        },
      });
      if (ticket.status === "CANCELLED") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Ticket is already cancelled",
        });
      }

      const cancellationFine = getFine({
        ticketPrice: ticket.price,
        cause: "CANCELLED",
      });

      // waitlisted tickets are not fined for cancellation
      if (ticket.status !== "WAITLISTED") {
        if (ticket.BookedBy.role === "USER") {
          // if a normal user booked the ticket, fine them
          await ctx.db.user.update({
            where: { id: ticket.BookedBy.id },
            data: {
              fine: {
                increment: cancellationFine,
              },
            },
          });
        } else if (
          ticket.BookedBy.role === "ADMIN" &&
          ticket.status === "CONFIRMED" &&
          ticket.Payment?.Card.CardOwner
        ) {
          // if an admin booked the ticket, but someone payed for it, fine them
          await ctx.db.user.update({
            where: { id: ticket.Payment.Card.CardOwner.id },
            data: {
              fine: {
                increment: cancellationFine,
              },
            },
          });
        } else if (
          ticket.BookedBy.role === "ADMIN" &&
          ticket.status === "PENDING"
        ) {
          // if an admin booked the ticket for someone that may not be in teh system, fine them
          await ctx.db.user.upsert({
            where: { email: ticket.passengerEmail },
            update: {
              fine: {
                increment: cancellationFine,
              },
            },
            create: {
              email: ticket.passengerEmail,
              fine: cancellationFine,
            },
          });
        } else {
          // otherwise, just fine the admin for tracking purposes
          await ctx.db.user.update({
            where: { id: ticket.BookedBy.id },
            data: {
              fine: {
                increment: cancellationFine,
              },
            },
          });
        }
      }

      const updatedTicket = await ctx.db.ticket.update({
        where: { id: input.ticketId },
        data: {
          status: "CANCELLED",
        },
        include: {
          BookedBy: true,
        },
      });

      return updatedTicket;
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
