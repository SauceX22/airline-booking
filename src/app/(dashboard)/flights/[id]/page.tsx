import { unstable_noStore } from "next/cache";
import { notFound } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { BookTicketSection } from "@/app/(dashboard)/flights/[id]/flight-booking-section";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";

type FlightDetailsPageProps = {
  params: { id: string };
};

export default async function FlightDetailsPage({
  params: { id: flightId },
}: FlightDetailsPageProps) {
  unstable_noStore();
  const session = await auth();
  const isAdmin = session?.user.role === "ADMIN";

  const flight = await api.flight.getFlight.query({ flightId });
  const existingUserTickets = await api.ticket.getThisUserTickets.query({
    filter: { flightId },
  });

  if (!flight) {
    return notFound();
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={flight?.name}
        text={
          isAdmin
            ? "Edit flight details"
            : "Reserve this flight for your next adventure."
        }
      />
      <BookTicketSection
        flight={flight}
        existingUserTickets={existingUserTickets}
      />
    </DashboardShell>
  );
}
