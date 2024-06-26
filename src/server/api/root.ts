import { creditCardRouter } from "@/server/api/routers/credit-card";
import { flightRouter } from "@/server/api/routers/flight";
import { planeRouter } from "@/server/api/routers/plane";
import { ticketRouter } from "@/server/api/routers/ticket";
import { userRouter } from "@/server/api/routers/user";
import { createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  ticket: ticketRouter,
  flight: flightRouter,
  plane: planeRouter,
  user: userRouter,
  creditCard: creditCardRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
