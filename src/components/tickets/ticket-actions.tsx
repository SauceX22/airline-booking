import React from "react";

import "next/navigation";

import Link from "next/link";
import { type Flight, type Plane, type Ticket } from "@prisma/client";
import {
  ArrowLeftIcon,
  CreditCardIcon,
  Edit3Icon,
  TicketIcon,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import EditTicketDialogButton from "@/components/modals/edit-ticket-dialog";
import TicketCancelDialogButton from "@/components/tickets/ticket-cancel-button";
import TicketPaymentSheetButton from "@/components/tickets/ticket-payment-sheet-button";
import { cn } from "@/lib/utils";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";

interface TicketActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  ticket: Ticket & { Flight: Flight & { Plane: Plane, Tickets: Ticket[] } };
}

export async function TicketItemActions({
  ticket,
  className,
}: TicketActionsProps) {
  const session = await auth();
  const isAdmin = session?.user.role === "ADMIN";

  const creditCards = await api.creditCard.getAll.query();
  const existingUserTickets = await api.ticket.getThisUserTickets.query({
    filter: { flightId: ticket.flightId },
  });

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Link className={buttonVariants({ variant: "outline" })} href="/tickets">
        <ArrowLeftIcon className="mr-2 h-4 w-4" />
        Back
      </Link>
      <EditTicketDialogButton
        ticket={ticket}
      />
      <TicketCancelDialogButton ticket={ticket} />
      {!isAdmin && (
        <TicketPaymentSheetButton cards={creditCards} ticket={ticket} />
      )}
    </div>
  );
}

TicketItemActions.Skeleton = function TicketItemActionsSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Button disabled variant="outline">
        <ArrowLeftIcon className="mr-2 h-4 w-4" />
        Back
      </Button>
      <Button disabled variant="outline">
        <Edit3Icon className="mr-2 h-4 w-4" />
        Edit Ticket
      </Button>
      <Button disabled variant="destructive">
        <TicketIcon className="mr-2 h-4 w-4" />
        Cancel Ticket
      </Button>
      <Button disabled variant="default">
        <CreditCardIcon className="mr-2 h-4 w-4" />
        Payment
      </Button>
    </div>
  );
};
