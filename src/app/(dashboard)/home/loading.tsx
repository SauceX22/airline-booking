import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import FlightFilterHeader from "@/components/flight-filter-header";
import { FlightItem } from "@/components/flights/flight-item";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";

import { type Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Home",
};

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Home" text="Flights available for rent.">
        <Link prefetch href="#" className={cn(buttonVariants())}>
          Lookup Upcoming Flights
        </Link>
      </DashboardHeader>
      <div className="px-2">
        <FlightFilterHeader />
        <Separator className="my-4" />
        <div className="grid gap-4 grid-cols-3">
          {Array.from({ length: 10 }).map((_, index) => (
            <FlightItem.Skeleton key={index} />
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
