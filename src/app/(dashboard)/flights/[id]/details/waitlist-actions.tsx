"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Ticket } from "@prisma/client";
import { CheckIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/trpc/client";

export function WaitlistActions({ ticket }: { ticket: Ticket }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const apiUtils = api.useUtils();
  const router = useRouter();

  const { mutateAsync: promoteTicket, isLoading: isPromoteTicketLoading } =
    api.ticket.promoteTicket.useMutation({
      onError(err) {
        toast.error("Something went wrong.", {
          description: err.message,
        });
      },
      async onSuccess(data, variables, context) {
        toast.success("Ticket promoted", {
          description: "Ticket promoted successfully.",
        });

        await apiUtils.ticket.invalidate();
        router.push("/tickets");
        router.refresh();
      },
    });

  const {
    mutateAsync: deleteWaitlistTicket,
    isLoading: isDeleteWaitlistTicketLoading,
  } = api.ticket.deleteWaitlistTicket.useMutation({
    onError(err) {
      toast.error("Something went wrong.", {
        description: err.message,
      });
    },
    async onSuccess(data, variables, context) {
      toast.success("Ticket deleted", {
        description: "Ticket deleted successfully.",
      });

      await apiUtils.ticket.invalidate();
      router.refresh();
    },
  });

  return (
    <>
      <Button
        size="icon"
        variant="success"
        disabled={isPromoteTicketLoading}
        onClick={() => promoteTicket({ ticketId: ticket.id })}>
        <CheckIcon />
        <span className="sr-only">Promote</span>
      </Button>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogTrigger asChild>
          <Button
            size="icon"
            variant="destructive"
            disabled={isDeleteWaitlistTicketLoading}
            onClick={() => setShowDeleteDialog(true)}>
            <XIcon />
            <span className="sr-only">Delete</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              {ticket.passengerName}&apos;s ticket.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button disabled={isDeleteWaitlistTicketLoading}>Cancel</Button>
            </DialogClose>
            <Button
              disabled={isDeleteWaitlistTicketLoading}
              onClick={async () => {
                await deleteWaitlistTicket({ ticketId: ticket.id });
                setShowDeleteDialog(false);
              }}>
              Confirm Ticket Deletion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
