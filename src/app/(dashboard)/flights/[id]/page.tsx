import { unstable_noStore } from "next/cache";
import { notFound } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  const existingUserTickets = await api.ticket.getUserFlightTickets.query({
    flightId,
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
      {isAdmin ? (
        <div className="grid grid-cols-3 gap-2">
          {/* <FlightEditSection flight={flight} className="col-span-1" /> */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>All {flight.name} Bookings</CardTitle>
              <CardDescription>
                This is a list of all bookings for this flight made by users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>
                  A list of all bookings for this flight.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] text-center">
                      User
                    </TableHead>
                    <TableHead>Strat Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Is Past</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* {flight.reservations
                    .sort((a, b) => compareDesc(a.startDate, b.startDate))
                    .map((res) => (
                      <TableRow
                        key={res.id}
                        className={cn({
                          "text-muted hover:text-muted-foreground": isPast(
                            res.endDate
                          ),
                        })}>
                        <TableCell className="font-medium">
                          {res.reservedBy.name ?? res.reservedBy.email}
                        </TableCell>
                        <TableCell>
                          {format(res.startDate, "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>
                          {format(res.endDate, "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>
                          {isPast(res.endDate) ? "Yes" : "No"}
                        </TableCell>
                        <TableCell>{res.rating ?? "N/A"}</TableCell>
                        <TableCell>
                          <DeleteReservationButton
                            reservation={res}
                            reservedBy={res.reservedBy}
                          />
                        </TableCell>
                      </TableRow>
                    ))} */}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={4} className="text-right">
                      Average Rating
                    </TableCell>
                    <TableCell>
                      {/* {flight.reservations.filter((res) => !!res.rating)
                        .length === 0
                        ? "N/A"
                        : flight.reservations.reduce(
                            (acc, curr) => acc + (curr.rating ?? 0),
                            0
                          ) /
                          flight.reservations.filter((res) => !!res.rating)
                            .length} */}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : (
        <BookTicketSection
          flight={flight}
          existingUserTickets={existingUserTickets}
        />
      )}
    </DashboardShell>
  );
}
