import { unstable_noStore } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { format, minutesToHours } from "date-fns";
import { TicketIcon } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { TicketItemActions } from "@/components/tickets/ticket-actions";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";

type TicketDetailsPageProps = {
  params: { id: string };
};

export default async function TicketDetailsPage({
  params: { id: ticketId },
}: TicketDetailsPageProps) {
  unstable_noStore();
  const session = await auth();
  const ticket = await api.ticket.getTicket.query({ ticketId });

  if (!session?.user) {
    return redirect("/auth/login");
  }

  if (!ticket) {
    return notFound();
  }

  return (
    <DashboardShell>
      <DashboardHeader heading={ticket?.Flight.name} text="Ticket Details">
        <TicketItemActions ticket={ticket} />
      </DashboardHeader>
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-950 sm:p-8 md:p-10 lg:p-12">
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Ticket Details</h1>
            <div className="inline-flex items-center gap-2 rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-900 dark:bg-gray-800 dark:text-gray-50">
              <TicketIcon className="h-4 w-4" />
              <span>INV-1234</span>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  Passenger Name
                </span>
                <span className="font-medium">{ticket.passengerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  Passenger Email
                </span>
                <span className="font-medium">{ticket.passengerEmail}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  Seat Class
                </span>
                <span className="font-medium">{ticket.class}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  Seat Number
                </span>
                <span className="font-medium">{ticket.seat}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  Booking Date
                </span>
                <span className="font-medium">
                  {format(ticket.bookingDate, "MMM do, yyy")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  Payment Status
                </span>
                <div className="font-medium">
                  {ticket.paymentStatus === "CONFIRMED" ? "Paid" : "Pending"}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  Payment Date
                </span>
                <span className="font-medium">
                  {ticket.paymentStatus === "CONFIRMED" && ticket.Payment?.date
                    ? format(ticket.Payment?.date, "MMM do, yyy")
                    : "-"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  Price
                </span>
                <span className="font-medium">{ticket.price}</span>
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  Flight Name
                </span>
                <span className="font-medium">{ticket.Flight.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  Flight Date
                </span>
                <span className="font-medium">
                  {format(ticket.Flight.date, "MMM do, yyy")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  Flight Duration
                </span>
                <span className="font-medium">
                  {/* change ticket.Flight.duration to a good fromat from minutes */}
                  {minutesToHours(ticket.Flight.duration)} hours and{" "}
                  {ticket.Flight.duration % 60} minutes
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  Source Airport
                </span>
                <span className="font-medium">{ticket.Flight.source}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  Destination Airport
                </span>
                <span className="font-medium">{ticket.Flight.destination}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  Plane Name
                </span>
                <span className="font-medium">{ticket.Flight.Plane.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  Plane Type
                </span>
                <span className="font-medium">{ticket.Flight.Plane.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  Total Economy Seats
                </span>
                <span className="font-medium">
                  {ticket.Flight.Plane.nEconomySeats}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  Total Business Seats
                </span>
                <span className="font-medium">
                  {ticket.Flight.Plane.nBusinessSeats}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  Total First Class Seats
                </span>
                <span className="font-medium">
                  {ticket.Flight.Plane.nFirstClassSeats}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  Last Maintenance Date
                </span>
                <span className="font-medium">
                  {format(
                    ticket.Flight.Plane.lastMaintenanceDate,
                    "MMM do, yyy"
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  First Flight Date
                </span>
                <span className="font-medium">
                  {format(ticket.Flight.Plane.firstFlightDate, "MMM do, yyy")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
