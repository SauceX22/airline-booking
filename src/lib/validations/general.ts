import { SeatClass } from "@prisma/client";
import { z } from "zod";

export const newBookingFormSchema = z.object({
  passengers: z
    .array(
      z.object({
        name: z.string().min(1).max(30),
        email: z.string().email(),
        seat: z.string().min(2).max(5),
        seatClass: z.nativeEnum(SeatClass).default("ECONOMY"),
      })
    )
    .min(1)
    .max(10),
});

export const updateTicketSchema =
  newBookingFormSchema.shape.passengers.element.partial();

export const flightFilterFormSchema = z.object({
  source: z.string().optional(),
  dest: z.string().optional(),
  date: z.date().optional(),
});
