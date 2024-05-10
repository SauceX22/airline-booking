import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { TicketItemActions } from "@/components/tickets/ticket-actions";
import { auth } from "@/server/auth";

export default async function TicketDetailsPageLoading() {
  const session = await auth();

  if (!session?.user) {
    return redirect("/auth/login");
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Loading..." text="Ticket Details">
        <TicketItemActions.Skeleton />
      </DashboardHeader>
      <div className="grid grid-cols-1 gap-2 text-lg font-medium md:grid-cols-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-3xl">Ticket Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="grid grid-cols-2 gap-y-2">
              <div className="text-muted-foreground">Ticket Number:</div>
              <Skeleton className="h-4 w-full" />
              <div className="text-muted-foreground">Passenger Name:</div>
              <Skeleton className="h-4 w-full" />
              <div className="text-muted-foreground">Passenger Email:</div>
              <Skeleton className="h-4 w-full" />
              <div className="text-muted-foreground">Seat Class:</div>
              <Skeleton className="h-4 w-full" />
              <div className="text-muted-foreground">Seat Number:</div>
              <Skeleton className="h-4 w-full" />
              <div className="text-muted-foreground">Booking Date:</div>
              <Skeleton className="h-4 w-full" />
              <div className="text-muted-foreground">Payment Status:</div>
              <Skeleton className="h-4 w-full" />
              <div className="text-muted-foreground">Payment Date:</div>
              <Skeleton className="h-4 w-full" />
              <div className="text-muted-foreground">Price:</div>
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-3xl">Flight Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="grid grid-cols-2 gap-y-2">
              <div className="text-muted-foreground">Flight Name:</div>
              <Skeleton className="h-4 w-full" />
              <div className="text-muted-foreground">Flight Date:</div>
              <Skeleton className="h-4 w-full" />
              <div className="text-muted-foreground">Flight Duration:</div>
              <Skeleton className="h-4 w-full" />
              <div className="text-muted-foreground">Source Airport:</div>
              <Skeleton className="h-4 w-full" />
              <div className="text-muted-foreground">Destination Airport:</div>
              <Skeleton className="h-4 w-full" />
              <div className="text-muted-foreground">Plane Name:</div>
              <Skeleton className="h-4 w-full" />
              <div className="text-muted-foreground">Plane Type:</div>
              <Skeleton className="h-4 w-full" />
              <div className="text-muted-foreground">Total Economy Seats:</div>
              <Skeleton className="h-4 w-full" />
              <div className="text-muted-foreground">Total Business Seats:</div>
              <Skeleton className="h-4 w-full" />
              <div className="text-muted-foreground">
                Total First Class Seats:
              </div>
              <Skeleton className="h-4 w-full" />
              <div className="text-muted-foreground">
                Last Maintenance Date:
              </div>
              <Skeleton className="h-4 w-full" />
              <div className="text-muted-foreground">First Flight Date:</div>
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
