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
