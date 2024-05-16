"use server";

import BookingConfirmationEmailTemplate, {
  type BookingConfirmationEmailTemplateProps,
} from "emails/booking-confirmation";
import { Resend } from "resend";

import { env } from "@/env.mjs";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendConfirmationEmail({
  ticket,
}: BookingConfirmationEmailTemplateProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Airlines Tickets <noreply@saucex.cc>",
      to: [ticket.passengerEmail],
      subject: "Booking Confirmation",
      text: "Your booking has been confirmed.",
      react: BookingConfirmationEmailTemplate({ ticket }),
    });

    console.error("Emailll:", data, error);
    if (error) {
      return Response.json({ error }, { status: 500 });
    }
    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
