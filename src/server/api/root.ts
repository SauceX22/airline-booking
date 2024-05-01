import { userRouter } from "@/server/api/routers/user";
import { ticketRouter } from "@/server/api/routers/ticket";
import { flightRouter } from "@/server/api/routers/flight";
import { createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  ticket: ticketRouter,
  flight: flightRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
