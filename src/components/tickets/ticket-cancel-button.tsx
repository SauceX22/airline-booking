"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Ticket } from "@prisma/client";
import { XIcon } from "lucide-react";
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
import { cn, getFine } from "@/lib/utils";
import { api } from "@/trpc/client";
import { Badge } from "@/components/ui/badge";

type TicketCancelDialogButtonProps = {
  ticket: Ticket;
};

export default function TicketCancelDialogButton({
  ticket,
}: TicketCancelDialogButtonProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const apiUtils = api.useUtils();
  const router = useRouter();

  const { mutateAsync: cancelTicket } = api.ticket.cancelTicket.useMutation({
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
      router.push("/tickets");
      router.refresh();
    },
  });

  return (
    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full"
          disabled={ticket.status === "CANCELLED"}
        >
          <XIcon className="mr-2 h-4 w-4" />
          Cancel Ticket
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <Badge variant="destructive" className="w-fit">
            You will be charged a ${getFine({ticketPrice: ticket.price, cause: "CANCELLED"})} fine.
          </Badge>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently cancel this
            ticket and you will have to reserve the ticket again.
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
  );
}
