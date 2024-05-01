"use client";

import { useRouter } from "next/navigation";
import { type Ticket } from "@prisma/client";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/client";

interface TicketActionsProps {
  ticket: Ticket;
}

export function TicketItemActions({ ticket }: TicketActionsProps) {
  const router = useRouter();
  const apiUtils = api.useUtils();

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
      <Button
        variant="destructive"
        className="w-full"
        onClick={async () => await cancelTicket({ ticketId: ticket.id })}>
        Cancel
      </Button>
      {ticket.paymentStatus === "PENDING" && (
        <Button
          variant="outline"
          className="w-full"
          onClick={async () => await payTicket({ ticketId: ticket.id })}>
          Pay
        </Button>
      )}
    </>
  );
}
