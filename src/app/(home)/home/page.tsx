import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { type Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Home",
};

export default async function HomePage() {
  // const session = await auth();
  // const isManager = session?.user.role === "ADMIN";

  return (
    <DashboardShell>
      <DashboardHeader heading="Home" text="Bikes available for rent.">
        <Link prefetch href="#" className={cn(buttonVariants())}>
          {/* {isManager ? "Manage User Reservations" : "View Your Reservations"} */}
        </Link>
      </DashboardHeader>
      <div className="px-2">test</div>
    </DashboardShell>
  );
}
