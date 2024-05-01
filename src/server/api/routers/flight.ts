import { isSameDay } from "date-fns";
import { coerce, z } from "zod";

import {
  createTRPCRouter,
  protectedManagerProcedure,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const DEFAULT_PAGE_SIZE = 9;

export const flightRouter = createTRPCRouter({
  search: publicProcedure
    .input(
      z.object({
        source: z.coerce.string().optional(),
        dest: z.coerce.string().optional(),
        date: z.coerce.string().datetime().optional(),
        page: z.coerce
          .number()
          .int()
          .transform((page) =>
            // clamp min to 0
            page < 0 ? 0 : page
          )
          .default(0),
        pageSize: z.coerce.number().int().positive().default(DEFAULT_PAGE_SIZE),
      })
    )
    .query(async ({ ctx, input }) => {
      const flights = await ctx.db.flight.findMany({
        where: {
          source: input.source,
          destination: input.dest,
        },
        include: {
          Tickets: true,
          Plane: true,
        },
        orderBy: {
          date: "desc",
        },
        take: input.pageSize,
        skip: input.pageSize * input.page,
      });

      if (input.date) {
        const filteredFlights = flights.filter((flight) =>
          isSameDay(flight.date, input.date!)
        );
        return filteredFlights;
      }

      return flights;
    }),
  listCities: publicProcedure.query(async ({ ctx }) => {
    // get all unique cities from all flights, either source or destination (through db call only)
    const cityCombos = await ctx.db.flight.findMany({
      select: {
        source: true,
        destination: true,
      },
      distinct: ["source", "destination"],
    });

    const cities = new Set<string>();

    for (const cityCombo of cityCombos) {
      cities.add(cityCombo.source);
      cities.add(cityCombo.destination);
    }

    return Array.from(cities);
  }),
  deleteFlight: protectedManagerProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.flight.delete({ where: { id: input.id } });
    }),
});
