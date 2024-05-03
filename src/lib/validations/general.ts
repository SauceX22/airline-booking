import { SeatClass } from "@prisma/client";
import { z } from "zod";

export const newBookingSchema = z.object({
  passengers: z
    .array(
      z.object({
        name: z.string().min(5).max(30),
        email: z.string().email(),
        seatClass: z.nativeEnum(SeatClass).default("ECONOMY"),
      })
    )
    .min(1)
    .max(10),
});

export const updateBookingSchema = newBookingSchema.partial();

export const ratingSchema = z.coerce.number().int().min(1).max(5);

export const filterFormSchema = z.object({
  source: z.string().optional(),
  dest: z.string().optional(),
  date: z.date().optional(),
});
