import { isSameDay } from "date-fns";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedAdminProcedure,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const DEFAULT_PAGE_SIZE = 9;

export const planeRouter = createTRPCRouter({
  getPlane: protectedAdminProcedure
    .input(
      z.object({
        planeId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.plane.findUnique({
        where: { id: input.planeId },
        include: {
          Flights: true,
        },
      });
    }),
  getPlaneReport: protectedAdminProcedure
    .input(
      z.object({
        planeId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const plane = await ctx.db.plane.findUnique({
        where: { id: input.planeId },
        include: {
          Flights: {
            include: {
              Tickets: {
                include: {
                  Flight: true,
                },
              },
            },
          },
        },
      });

      if (!plane) {
        return null;
      }

      return {
        ...plane,
        Flights: plane.Flights.map((flight) => ({
          ...flight,
          bookingPercentage:
            (flight.Tickets.length /
              (plane.nEconomySeats +
                plane.nBusinessSeats +
                plane.nFirstClassSeats)) *
            100,
        })),
        Statistics: {
          averageLoadFactor:
            (plane.Flights.reduce(
              (acc, flight) =>
                acc +
                flight.Tickets.length /
                  (plane.nEconomySeats +
                    plane.nBusinessSeats +
                    plane.nFirstClassSeats),
              0
            ) /
              plane.Flights.length) *
            100,
          confirmedTickets: plane.Flights.flatMap((flight) =>
            flight.Tickets.filter(
              (ticket) => ticket.status === "CONFIRMED"
            )
          ),
          cancelledTickets: plane.Flights.flatMap((flight) =>
            flight.Tickets.filter(
              (ticket) => ticket.status === "CANCELLED"
            )
          ),
        },
      };
    }),
  listPlanes: protectedAdminProcedure.query(async ({ ctx }) => {
    return await ctx.db.plane.findMany({
      orderBy: {
        id: "desc",
      },
    });
  }),
  deletePlane: protectedAdminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.plane.delete({ where: { id: input.id } });
    }),
});
