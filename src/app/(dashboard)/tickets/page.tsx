import { type Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { Icons } from "@/components/icons";
import { TicketItem } from "@/components/tickets/ticket-item";
import { cn } from "@/lib/utils";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Your Tickets",
};

export default async function TicketsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const userTickets = await api.ticket.getUserTickets.query({
    bookedById: session.user.id,
  });

  return (
    <DashboardShell>
      <DashboardHeader heading="Tickets" text="Your booked tickets." />
      <div className="px-2">
        <Separator className="mb-4" />
        {userTickets.length ? (
          <div className="grid grid-cols-3 gap-4">
            {userTickets.map((ticket) => (
              <TicketItem key={ticket.id} ticket={ticket} />
            ))}
          </div>
        ) : (
          <div
            className={cn(
              "flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50"
            )}>
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Icons.ticket className="h-10 w-10" />
              </div>
            </div>
            <h2 className={cn("mt-6 text-xl font-semibold")}>
              No tickets available
            </h2>
            <p
              className={cn(
                "mb-8 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground"
              )}>
              There are no tickets available for rent at the moment. Please
              check back later.
            </p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
