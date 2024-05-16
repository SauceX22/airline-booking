/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { unstable_noStore } from "next/cache";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { WaitlistActions } from "@/app/(dashboard)/flights/[id]/details/waitlist-actions";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";

import { getFlightStats, getInitials } from "../../../../../lib/utils";

type FlightDetailsPageProps = {
  params: { id: string };
};

export default async function FlightDetailsPage({
  params: { id: flightId },
}: FlightDetailsPageProps) {
  unstable_noStore();
  const session = await auth();
  const isAdmin = session?.user.role === "ADMIN";

  if (!session?.user) {
    redirect("/auth/login");
  }

  if (!isAdmin) {
    return notFound();
  }

  const flight = await api.flight.getFlight.query({ flightId });

  if (!flight) {
    return notFound();
  }

  const { confirmedAndPendingTickets, waitlistedTickets } =
    getFlightStats(flight);

  return (
    <DashboardShell>
      <DashboardHeader heading={flight?.name} text="Flight details" />
      <div className="px-2">
        <Separator className="my-4" />
        <div className="flex flex-1 flex-row gap-4">
          <div className="flex w-full flex-col gap-4">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold md:text-2xl">Passengers</h1>
              <Button className="ml-auto" size="sm">
                <Link href={`/flights/${flight.id}`}>Book Flight</Link>
              </Button>
            </div>
            <div className="w-full rounded-lg border shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="max-w-[150px]">Name</TableHead>
                    <TableHead>Booking Date</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {confirmedAndPendingTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">
                        {ticket.passengerName}
                      </TableCell>
                      <TableCell className="font-medium">
                        {format(ticket.bookingDate, "MMM do, yyyy")}
                      </TableCell>
                      <TableCell>{ticket.passengerEmail}</TableCell>
                      <TableCell>
                        <Badge
                          variant={(() => {
                            switch (ticket.status) {
                              case "CONFIRMED":
                                return "success";
                              case "PENDING":
                                return "outline";
                              case "WAITLISTED":
                                return "warning";
                              default:
                                return "destructive";
                            }
                          })()}>
                          {ticket.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="flex w-full flex-col gap-4">
            <div className="flex min-h-9 items-center justify-start">
              <h2 className="text-lg font-semibold md:text-2xl">
                Waitlisted Passengers
              </h2>
            </div>
            <div className="w-full rounded-lg border shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Avatar</TableHead>
                    <TableHead className="max-w-[150px]">Name</TableHead>
                    <TableHead>Booked On</TableHead>
                    <TableHead>Wait Order</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {waitlistedTickets
                    .sort((a, b) => a.waitlistOrder - b.waitlistOrder)
                    .map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell>
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {getInitials(ticket.passengerName)}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">
                          {ticket.passengerName}
                        </TableCell>
                        <TableCell className="font-medium">
                          {format(ticket.bookingDate, "MMM do, yyyy")}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="warning"
                            className="flex w-full items-center justify-center font-medium">
                            {ticket.waitlistOrder}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <WaitlistActions ticket={ticket} />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
