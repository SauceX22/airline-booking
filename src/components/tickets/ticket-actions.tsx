"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type CreditCard, type Ticket } from "@prisma/client";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { pushModal } from "@/components/modals";
import CardSelectionSheet from "@/components/modals/card-selection-sheet";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/client";

interface TicketActionsProps {
  ticket: Ticket;
  cards: CreditCard[];
}

export function TicketItemActions({ ticket, cards }: TicketActionsProps) {
  const router = useRouter();
  const apiUtils = api.useUtils();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { mutateAsync: cancelTicket } = api.ticket.deleteTicket.useMutation({
    onError(err) {
      toast.error("Something went wrong.", {
        description: err.message,
      });
    },
    async onSuccess(data, variables, context) {
      toast.success("Ticket cancelled", {
        description: "Ticket cancelled successfully.",
      });

      await apiUtils.ticket.invalidate();
      router.refresh();
    },
  });

  const { mutateAsync: payTicket } = api.ticket.payTicket.useMutation({
    onError(err) {
      toast.error("Something went wrong.", {
        description: err.message,
      });
    },
    async onSuccess(data, variables, context) {
      toast.success("Ticket paid", {
        description: "Ticket paid successfully.",
      });

      await apiUtils.ticket.invalidate();
      router.refresh();
    },
  });

  return (
    <>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="w-full">
            Cancel Ticket
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently cancel this
              ticket and you will have to pay for the ticket again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Back</AlertDialogCancel>
            <AlertDialogAction
              className={cn(buttonVariants({ variant: "destructive" }))}
              onClick={async () => await cancelTicket({ ticketId: ticket.id })}>
              Confirm Ticket Cancellation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {ticket.paymentStatus === "PENDING" && (
        <CardSelectionSheet cards={cards} />
      )}
    </>
  );
}
