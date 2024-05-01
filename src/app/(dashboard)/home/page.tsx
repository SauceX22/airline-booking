import { type Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { z } from "zod";

import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import FlightFilterHeader from "@/components/flight-filter-header";
import { FlightItem } from "@/components/flights/flight-item";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Home",
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: {
    source?: string;
    dest?: string;
    date?: string;
    page?: number;
    pageSize?: number;
  };
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const filteredFlights = await api.flight.search.query({
    source: searchParams.source,
    dest: searchParams.dest,
    date: searchParams.date,
    page: searchParams.page,
    pageSize: searchParams.pageSize,
  });

  return (
    <DashboardShell>
      <DashboardHeader heading="Home" text="Flights available for rent.">
        <Link prefetch href="/tickets" className={cn(buttonVariants())}>
          Your Tickets
        </Link>
      </DashboardHeader>
      <div className="px-2">
        <FlightFilterHeader />
        <Separator className="my-4" />
        {filteredFlights.length ? (
          <div className="grid grid-cols-3 gap-4">
            {filteredFlights.map((flight) => (
              <FlightItem key={flight.id} flight={flight} />
            ))}
          </div>
        ) : (
          <div
            className={cn(
              "flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50"
            )}>
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Icons.flight className="h-10 w-10" />
              </div>
            </div>
            <h2 className={cn("mt-6 text-xl font-semibold")}>
              No flights available
            </h2>
            <p
              className={cn(
                "mb-8 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground"
              )}>
              There are no flights available for rent at the moment. Please
              check back later.
            </p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
