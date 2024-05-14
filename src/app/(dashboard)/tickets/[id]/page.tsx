import { unstable_noStore } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { format, minutesToHours } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { TicketItemActions } from "@/components/tickets/ticket-actions";
import { cn } from "@/lib/utils";
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
      <div className="grid grid-cols-1 gap-2 text-lg font-medium md:grid-cols-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-3xl">Ticket Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="grid grid-cols-3 gap-y-2">
              <div className="text-muted-foreground">Ticket Number:</div>
              <div className="col-span-2">{ticket.Flight.name}</div>
              <div className="text-muted-foreground">Passenger Name:</div>
              <div className="col-span-2">{ticket.passengerName}</div>
              <div className="text-muted-foreground">Passenger Email:</div>
              <div className="col-span-2">{ticket.passengerEmail}</div>
              <div className="text-muted-foreground">Seat Class:</div>
              <div className="col-span-2">{ticket.class}</div>
              <div className="text-muted-foreground">Seat Number:</div>
              <div className="col-span-2">{ticket.seat}</div>
              <div className="text-muted-foreground">Booking Date:</div>
              <div className="col-span-2">
                {format(ticket.bookingDate, "MMM do, yyyy")}
              </div>
              <div className="text-muted-foreground">Payment Status:</div>
              <div
                className={cn(
                  "col-span-2",
                  ticket.status === "CONFIRMED" && ticket.Payment?.date
                    ? "text-success"
                    : "text-destructive"
                )}>
                  {ticket.status}
              </div>
              <div className="text-muted-foreground">Payment Date:</div>
              <div className="col-span-2">
                {ticket.Payment
                  ? format(ticket.Payment.date, "MMM do, yyyy")
                  : "-"}
              </div>
              <div className="text-muted-foreground">Price:</div>
              <div className="col-span-2">${ticket.price}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-3xl">Flight Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="grid grid-cols-2 gap-y-2">
              <div className="text-muted-foreground">Flight Name:</div>
              <div>{ticket.Flight.name}</div>
              <div className="text-muted-foreground">Flight Date:</div>
              <div>{format(ticket.Flight.date, "MMM do, yyyy")}</div>
              <div className="text-muted-foreground">Flight Duration:</div>
              <div>
                {minutesToHours(ticket.Flight.duration)} hours and{" "}
                {ticket.Flight.duration % 60} minutes
              </div>
              <div className="text-muted-foreground">Source Airport:</div>
              <div>{ticket.Flight.source}</div>
              <div className="text-muted-foreground">Destination Airport:</div>
              <div>{ticket.Flight.destination}</div>
              <div className="text-muted-foreground">Plane Name:</div>
              <div>{ticket.Flight.Plane.name}</div>
              <div className="text-muted-foreground">Plane Type:</div>
              <div>{ticket.Flight.Plane.type}</div>
              <div className="text-muted-foreground">Total Economy Seats:</div>
              <div>{ticket.Flight.Plane.nEconomySeats}</div>
              <div className="text-muted-foreground">Total Business Seats:</div>
              <div>{ticket.Flight.Plane.nBusinessSeats}</div>
              <div className="text-muted-foreground">
                Total First Class Seats:
              </div>
              <div>{ticket.Flight.Plane.nFirstClassSeats}</div>
              <div className="text-muted-foreground">
                Last Maintenance Date:
              </div>
              <div>
                {format(
                  ticket.Flight.Plane.lastMaintenanceDate,
                  "MMM do, yyyy"
                )}
              </div>
              <div className="text-muted-foreground">First Flight Date:</div>
              <div>
                {format(ticket.Flight.Plane.firstFlightDate, "MMM do, yyyy")}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
