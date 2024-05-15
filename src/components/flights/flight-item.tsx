import Link from "next/link";
import { type Flight, type Plane, type Ticket } from "@prisma/client";
import { format } from "date-fns";
import {
  CircleArrowDown,
  CircleArrowRight,
  PlaneIcon,
  PlaneTakeoffIcon,
  TicketIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface FlightItemProps {
  flight: Flight & { Plane: Plane; Tickets: Ticket[] };
}

export async function FlightItem({ flight }: FlightItemProps) {
  const totalPlaneSeats =
    flight.Plane.nFirstClassSeats +
    flight.Plane.nEconomySeats +
    flight.Plane.nBusinessSeats;
  const usedSeats = flight.Tickets.map((ticket) => ticket.seat);
  const availableFreeSeats = totalPlaneSeats - usedSeats.length;
  const isWaitlistOnly = availableFreeSeats === 0;

  return (
    <Card className="flex min-h-80 w-full max-w-md flex-col items-stretch justify-start">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <span className="flex flex-col items-start justify-start">
          <div className="flex items-center justify-start gap-2">
            <PlaneTakeoffIcon className="h-6 w-6" />
            <span className="text-2xl font-semibold">{flight.name}</span>
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {format(flight.date, "MMMM d, yyyy")}
          </span>
        </span>
        <Badge
          variant="secondary"
          className="pointer-events-none w-fit select-none gap-2 text-base font-medium text-muted-foreground">
          <TicketIcon className="h-4 w-4" />
          {availableFreeSeats} seats left
        </Badge>
      </CardHeader>
      <Separator className="my-4" />
      <CardContent className="flex flex-col gap-2 space-y-4">
        <div className="flex w-full flex-row items-center justify-evenly">
          <div className="flex w-full items-start justify-start space-x-2">
            <CircleArrowRight className="my-auto h-6 w-6 shrink-0 grow-0 text-muted-foreground" />
            <span className="flex w-fit flex-col items-start justify-start">
              <span className="text-nowrap text-xl font-bold">
                {flight.sourceCode.replace(" - All Airports", "")}
              </span>
              <span className="text-nowrap text-sm text-muted-foreground">
                {flight.source}
              </span>
            </span>
          </div>
          <div className="flex w-full items-start justify-start space-x-2">
            <CircleArrowDown className="my-auto h-6 w-6 shrink-0 grow-0 text-muted-foreground" />
            <span className="flex w-fit flex-col items-start justify-start">
              <span className="text-nowrap text-xl font-bold">
                {flight.destinationCode.replace(" - All Airports", "")}
              </span>
              <span className="text-nowrap text-sm text-muted-foreground">
                {flight.destination}
              </span>
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex w-full items-start justify-start space-x-2">
            <PlaneIcon className="my-auto h-6 w-6 shrink-0 grow-0 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">
                Plane
              </span>
              <span className="text-base font-semibold">
                {flight.Plane.name}
              </span>
            </div>
          </div>
          <div className="flex w-full items-start justify-start space-x-2">
            <PlaneIcon className="my-auto h-6 w-6 shrink-0 grow-0 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">
                Aircraft Type
              </span>
              <span className="text-base font-semibold">
                {flight.Plane.type}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <Link
          href={`/flights/${flight.id}`}
          className={cn(
            buttonVariants({
              variant: isWaitlistOnly ? "outline" : "default",
            }),
            "w-full"
          )}>
          {isWaitlistOnly ? "Book Waitlist Tickets" : "Book Ticket"}
        </Link>
      </CardFooter>
    </Card>
  );
}

FlightItem.Skeleton = function FlightItemSkeleton() {
  return (
    <Card className="min-h-80 w-full max-w-md">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="flex w-full items-center justify-start gap-3">
          <PlaneTakeoffIcon className="my-auto h-8 w-8 shrink-0 grow-0 text-muted-foreground" />
          <Skeleton className="flex h-6 w-[70%] flex-col items-start justify-start"></Skeleton>
        </div>
      </CardHeader>
      <Separator className="my-4" />
      <CardContent className="flex flex-col gap-2 space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex w-full items-start justify-start space-x-2">
            <CircleArrowRight className="my-auto h-6 w-6 shrink-0 grow-0 text-muted-foreground" />
            <Skeleton className="flex h-20 w-20 flex-col items-start justify-start"></Skeleton>
          </div>
          <div className="flex w-full items-start justify-start space-x-2">
            <CircleArrowDown className="my-auto h-6 w-6 shrink-0 grow-0 text-muted-foreground" />
            <Skeleton className="flex h-20 w-20 flex-col items-start justify-start"></Skeleton>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex w-full items-start justify-start space-x-2">
            <PlaneIcon className="my-auto h-6 w-6 shrink-0 grow-0 text-muted-foreground" />
            <Skeleton className="flex h-20 w-20 flex-col items-start justify-start"></Skeleton>
          </div>
          <div className="flex w-full items-start justify-start space-x-2">
            <PlaneIcon className="my-auto h-6 w-6 shrink-0 grow-0 text-muted-foreground" />
            <Skeleton className="flex h-20 w-20 flex-col items-start justify-start"></Skeleton>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "w-full"
          )}></Skeleton>
      </CardFooter>
    </Card>
  );
};
