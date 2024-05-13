import { unstable_noStore } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format, minutesToHours } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
import { cn } from "@/lib/utils";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";

type PlaneDetailsPageProps = {
  params: { id: string };
  searchParams: { image: string | undefined };
};

export default async function PlaneDetailsPage({
  params: { id: planeId },
  searchParams,
}: PlaneDetailsPageProps) {
  unstable_noStore();
  const session = await auth();
  const isAdmin = session?.user.role === "ADMIN";
  const image = searchParams.image ?? "/placeholder.svg";

  const plane = await api.plane.getPlane.query({ planeId });

  if (!plane) {
    return notFound();
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={plane?.name}
        text={
          isAdmin
            ? "Edit plane details"
            : "Reserve this plane for your next adventure."
        }
      />
      <div className="px-2">
        <Separator className="my-4" />
        <div className="flex flex-row items-start justify-between gap-4">
          <Image
            alt="Plane"
            className="aspect-video max-w-md shrink-0 grow-0 rounded-lg object-cover"
            height={400}
            src={image}
            width={600}
            quality={60}
          />
          <div className="w-full space-y-6">
            <Card className="h-fit w-full">
              <CardHeader>
                <CardTitle>{plane.name}</CardTitle>
                <CardDescription>
                  Details about the {plane.name}.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-base font-medium text-muted-foreground">
                    Plane Type
                  </dt>
                  <dd className="text-lg font-semibold">{plane.type}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-base font-medium text-muted-foreground">
                    First Flight
                  </dt>
                  <dd className="text-lg font-semibold">
                    {format(plane.firstFlightDate, "MMM do, yyyy")}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-base font-medium text-muted-foreground">
                    Last Maintenance
                  </dt>
                  <dd className="text-lg font-semibold">
                    {format(plane.lastMaintenanceDate, "MMM do, yyyy")}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-base font-medium text-muted-foreground">
                    Seating Capacity
                  </dt>
                  <dd className="text-lg font-semibold">
                    <ul className="list-disc pl-4">
                      <li>First Class: {plane.nFirstClassSeats}</li>
                      <li>Business Class: {plane.nBusinessSeats}</li>
                      <li>Economy Class: {plane.nEconomySeats}</li>
                    </ul>
                  </dd>
                </div>
              </CardContent>
              <CardFooter>
                <Link
                  className={cn(buttonVariants(), "w-full")}
                  href={`/planes/${plane.id}/report`}>
                  Generate Report
                </Link>
              </CardFooter>
            </Card>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Flights</h2>
              <div className="overflow-auto rounded-lg border border-gray-200 dark:border-gray-800">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Flight</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Destination</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {plane.Flights.map((flight) => (
                      <TableRow key={flight.id}>
                        <TableCell>{flight.name}</TableCell>
                        <TableCell>
                          {format(flight.date, "MMM do, yyyy")}
                        </TableCell>
                        <TableCell>
                          {`${minutesToHours(flight.duration)}h ${flight.duration % 60}min`}
                        </TableCell>
                        <TableCell>
                          <div>{flight.source}</div>
                          <Badge
                            variant="success"
                            className="w-10 cursor-default justify-center px-1.5 py-[0.0625rem] font-bold">
                            {flight.sourceCode}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>{flight.destination}</div>
                          <Badge
                            variant="success"
                            className="w-10 cursor-default justify-center px-1.5 py-[0.0625rem] font-bold">
                            {flight.destinationCode}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
