"use client";

import { useRouter } from "next/navigation";
import type { Ticket } from "@prisma/client";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/client";

export function WaitlistActions({ ticket }: { ticket: Ticket }) {
  const apiUtils = api.useUtils();
  const router = useRouter();

  const { mutateAsync: promoteTicket, isLoading } =
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
  return (
    <Button
      size="icon"
      variant="success"
      disabled={isLoading}
      onClick={() => promoteTicket({ ticketId: ticket.id })}>
      <CheckIcon />
      <span className="sr-only">Promote</span>
    </Button>
  );
}
