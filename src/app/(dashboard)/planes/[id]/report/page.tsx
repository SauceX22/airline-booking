import { unstable_noStore } from "next/cache";
import { notFound } from "next/navigation";
import { addMinutes, format, isWithinInterval } from "date-fns";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { cn } from "@/lib/utils";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";

type PlaneReportPageProps = {
  params: { id: string };
};

export default async function PlaneReportPage({
  params: { id: planeId },
}: PlaneReportPageProps) {
  unstable_noStore();
  const session = await auth();
  const isAdmin = session?.user.role === "ADMIN";

  const plane = await api.plane.getPlaneReport.query({ planeId });

  if (!plane) {
    return notFound();
  }

  const currentlyActiveFlight =
    plane.Flights.find((flight) =>
      isWithinInterval(new Date(), {
        start: flight.date,
        end: addMinutes(flight.date, flight.duration),
      })
    ) ?? plane.Flights[0];

  return (
    <DashboardShell>
      <DashboardHeader
        heading={plane?.name}
        text={
          isAdmin
            ? "Edit plane report"
            : "Reserve this plane for your next adventure."
        }
      />
      <div className="px-2">
        <Separator className="my-4" />
        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
          <Card
            className={cn({
              "bg-destructive/50": !currentlyActiveFlight,
            })}>
            <CardHeader>
              <CardTitle>Currently Active Flight</CardTitle>
              {currentlyActiveFlight && (
                <CardDescription>{currentlyActiveFlight.name}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="grid gap-2">
              {currentlyActiveFlight ? (
                <>
                  <div className="flex justify-between">
                    <span>Departure</span>
                    <Badge
                      variant="success"
                      className="w-10 cursor-default justify-center px-1.5 py-[0.0625rem] font-bold">
                      {currentlyActiveFlight.sourceCode}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Arrival</span>
                    <Badge
                      variant="success"
                      className="w-10 cursor-default justify-center px-1.5 py-[0.0625rem] font-bold">
                      {currentlyActiveFlight.destinationCode}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Departure Time</span>
                    <span>{format(currentlyActiveFlight.date, "h:mm a")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Arrival Time</span>
                    <span>
                      {format(
                        addMinutes(
                          currentlyActiveFlight.date,
                          currentlyActiveFlight.duration
                        ),
                        "h:mm a"
                      )}
                    </span>
                  </div>
                </>
              ) : (
                <Badge variant="destructive" className="text-xl font-bold">
                  No active flight
                </Badge>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Booking Percentage</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea type="always" className="h-36 pr-4">
                {plane.Flights.map((flight) => (
                  <div
                    key={flight.id}
                    className="mb-2 flex flex-col items-stretch justify-start gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-start">
                        <div className="flex items-start gap-4">
                          <div className="text-base font-medium text-muted-foreground">
                            Flight {flight.name}
                          </div>
                          <div className="flex items-center justify-start gap-2">
                            <Badge
                              variant="secondary"
                              className="w-10 cursor-default justify-center px-1.5 py-[0.0625rem] font-bold">
                              {flight.sourceCode}
                            </Badge>
                            to
                            <Badge
                              variant="secondary"
                              className="w-10 cursor-default justify-center px-1.5 py-[0.0625rem] font-bold">
                              {flight.destinationCode}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(flight.date, "MMM do, yyyy")}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-primary">
                          {flight.bookingPercentage}%
                        </div>
                        <div className="text-muted-foreground">Booked</div>
                      </div>
                    </div>
                    <Progress value={flight.bookingPercentage} />
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
            <Separator />
            <CardHeader>
              <CardTitle>Average Load Factor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-stretch justify-start gap-2">
                <div className="flex items-center justify-between">
                  <div className="text-base font-medium text-muted-foreground">
                    All Flights
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-primary">
                      {plane.Statistics.averageLoadFactor}%
                    </div>
                    <div className="text-muted-foreground">Booked</div>
                  </div>
                </div>
                <Progress value={plane.Statistics.averageLoadFactor} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Confirmed Payments</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Table>
                <TableCaption>
                  A list of passengers who have paid for their tickets
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Passenger</TableHead>
                    <TableHead>Flight</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plane.Statistics.confirmedTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>{ticket.passengerName}</TableCell>
                      <TableCell>{ticket.Flight.name}</TableCell>
                      <TableCell>${ticket.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="bg-destructive">
            <CardHeader>
              <CardTitle>Waitlisted Passengers</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Table>
                {/* TODO: add table caption */}
                <TableCaption>
                  A list of passengers who have booked a waitlisted seat
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Flight</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Waitlisted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Flight #123</TableCell>
                    <TableCell>First</TableCell>
                    <TableCell>3</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Flight #123</TableCell>
                    <TableCell>Business</TableCell>
                    <TableCell>7</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Flight #456</TableCell>
                    <TableCell>First</TableCell>
                    <TableCell>1</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Flight #456</TableCell>
                    <TableCell>Business</TableCell>
                    <TableCell>4</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Cancelled Tickets</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Table>
                <TableCaption>
                  A list of passengers who have cancelled their tickets
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Passenger</TableHead>
                    <TableHead>Flight</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plane.Statistics.cancelledTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>{ticket.passengerName}</TableCell>
                      <TableCell>{ticket.Flight.name}</TableCell>
                      <TableCell>Cancelled</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
