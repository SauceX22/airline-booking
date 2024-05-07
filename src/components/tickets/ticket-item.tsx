import Link from "next/link";
import { type PaymentTransaction, type Ticket } from "@prisma/client";
import { format } from "date-fns";
import {
  CircleCheck,
  CircleDollarSignIcon,
  CreditCardIcon,
  LuggageIcon,
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
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

interface TicketItemProps {
  ticket: Ticket & { Payment: PaymentTransaction | null };
}

export function TicketItem({ ticket }: TicketItemProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center justify-start gap-2">
          <TicketIcon className="h-6 w-6" />
          <span className="text-xl font-semibold">Flight Details</span>
        </div>
        <Badge
          className="pointer-events-none w-fit select-none gap-1 px-1.5 text-sm font-medium"
          variant={
            ticket.paymentStatus === "CONFIRMED" && ticket.Payment?.date
              ? "success"
              : "destructive"
          }>
          <CircleCheck className="h-4 w-4" />
          {ticket.paymentStatus === "CONFIRMED" ? "Confirmed" : "Pending"}
        </Badge>
      </CardHeader>
      <CardContent className="py-2">
        <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2 sm:grid-rows-2">
          <div className="flex w-full items-start justify-start space-x-3">
            <Icons.flightDate className="my-auto h-6 w-6 shrink-0 grow-0 text-muted-foreground" />
            <div className="flex w-fit flex-col items-start justify-start">
              <div className="text-sm font-medium text-muted-foreground">
                Flight Date
              </div>
              <div className="text-nowrap text-lg font-semibold">
                {format(ticket.bookingDate, "MMM do, yyy")}
              </div>
            </div>
          </div>
          <div className="flex w-full items-start justify-start space-x-3">
            <Icons.seat className="my-auto h-6 w-6 shrink-0 grow-0 text-muted-foreground" />
            <div className="flex w-fit flex-col items-start justify-start">
              <div className="text-sm font-medium text-muted-foreground">
                Seat
              </div>
              <div className="text-nowrap text-xl font-semibold">
                {ticket.seat}
              </div>
            </div>
          </div>
          <div className="flex w-full items-start justify-start space-x-3">
            <LuggageIcon className="my-auto h-6 w-6 shrink-0 grow-0 text-muted-foreground" />
            <div className="flex w-fit flex-col items-start justify-start">
              <div className="text-sm font-medium text-muted-foreground">
                Weight
              </div>
              <div className="text-nowrap text-xl font-semibold">
                {ticket.weightKG}
              </div>
            </div>
          </div>
          <div className="flex w-full items-start justify-start space-x-3">
            <CircleDollarSignIcon className="my-auto h-6 w-6 shrink-0 grow-0 text-muted-foreground" />
            <div className="flex w-fit flex-col items-start justify-start">
              <div className="text-sm font-medium text-muted-foreground">
                Price
              </div>
              <div className="text-nowrap text-xl font-semibold">
                {ticket.price}
              </div>
            </div>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-2">
          <div className="text-lg font-medium">Payment</div>
          <div className="grid gap-4 gap-x-8 gap-y-4 sm:grid-cols-2">
            <div className="flex w-full items-start justify-start space-x-3">
              <Icons.calendarPay className="my-auto h-6 w-6 shrink-0 grow-0 text-muted-foreground" />
              <div className="flex w-fit flex-col items-start justify-start">
                <div className="text-sm font-medium text-muted-foreground">
                  Payment Date
                </div>
                <div className="text-nowrap text-lg font-semibold">
                  {ticket.paymentStatus === "CONFIRMED" && ticket.Payment?.date
                    ? format(ticket.Payment?.date, "MMM do, yyy")
                    : "-"}
                </div>
              </div>
            </div>
            <div className="flex w-full items-start justify-start space-x-3">
              <CreditCardIcon className="my-auto h-6 w-6 shrink-0 grow-0 text-muted-foreground" />
              <div className="flex w-fit flex-col items-start justify-start">
                <div className="text-sm font-medium text-muted-foreground">
                  Status
                </div>
                <div className="text-nowrap text-xl font-semibold">
                  {ticket.paymentStatus === "CONFIRMED" ? "Paid" : "Pending"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-between gap-2 pt-4">
        <Link
          className={cn(buttonVariants(), "w-full")}
          href={`/tickets/${ticket.id}`}>
          View Ticket
        </Link>
      </CardFooter>
    </Card>
  );
}

TicketItem.Skeleton = function TicketItemSkeleton() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="grid gap-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="grid gap-1 text-right">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-12" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between">
          <div className="grid gap-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-12" />
          </div>
          <div className="grid gap-1 text-right">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-16 bg-green-500" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="grid gap-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="grid gap-1 text-right">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
