import { unstable_noStore } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { BookTicketSection } from "@/app/(dashboard)/flights/[id]/flight-booking-section";
import { cn } from "@/lib/utils";
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
        }>
        {isAdmin && (
          <Link
            prefetch
            href={`/flights/${flight.id}/details`}
            className={cn(buttonVariants())}>
            Flight Details
          </Link>
        )}
      </DashboardHeader>
      <BookTicketSection
        flight={flight}
        existingUserTickets={existingUserTickets}
      />
    </DashboardShell>
  );
}
