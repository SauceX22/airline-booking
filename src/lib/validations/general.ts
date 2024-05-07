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

export const newCardFormSchema = z.object({
  name: z.string().min(1).max(30),
  number: z.string().min(16).max(16),
  expiry: z.string().min(5).max(5),
  cvc: z.string().min(3).max(3),
});

export const ticketPaymentFormSchema = z.object({
  cardId: z.string(),
});
