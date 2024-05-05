import { type Metadata } from "next";

import { Separator } from "@/components/ui/separator";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { TicketItem } from "@/components/tickets/ticket-item";

export const metadata: Metadata = {
  title: "Home",
};

export default async function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Tickets" text="Tickets that you have booked." />
      <div className="px-2">
        <Separator className="my-4" />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <TicketItem.Skeleton key={index} />
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
