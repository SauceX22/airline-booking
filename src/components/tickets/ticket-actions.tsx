import React from "react";

import "next/navigation";

import Link from "next/link";
import { type Flight, type Plane, type Ticket } from "@prisma/client";
import { ArrowLeftIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import EditTicketDialogButton from "@/components/modals/edit-ticket-dialog";
import TicketCancelDialogButton from "@/components/tickets/ticket-cancel-button";
import TicketPaymentSheetButton from "@/components/tickets/ticket-payment-sheet-button";
import { cn } from "@/lib/utils";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";

interface TicketActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  ticket: Ticket & { Flight: Flight & { Plane: Plane } };
}

export async function TicketItemActions({
  ticket,
  className,
}: TicketActionsProps) {
  const session = await auth();
  const isAdmin = session?.user.role === "ADMIN";
  const creditCards = await api.creditCard.getAll.query();
  const existingUserTickets = await api.ticket.getUserTickets.query({
    flightId: ticket.flightId,
  });

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Link className={buttonVariants({ variant: "outline" })} href="/tickets">
        <ArrowLeftIcon className="mr-2 h-4 w-4" />
        Back
      </Link>
      <EditTicketDialogButton
        ticket={ticket}
        plane={ticket.Flight.Plane}
        existingUserTickets={existingUserTickets}
      />
      <TicketCancelDialogButton ticket={ticket} />
      {!isAdmin && (
        <TicketPaymentSheetButton cards={creditCards} ticket={ticket} />
      )}
    </div>
  );
}
