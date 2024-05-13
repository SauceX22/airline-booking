import { unstable_noStore } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { PlaneIcon, TableIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { cn } from "@/lib/utils";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";

const srcs = [
  "https://samchui.com/wp-content/uploads/2020/08/LAXD4595-720x480.jpg",
  "https://samchui.com/wp-content/uploads/2020/05/OS4A1324_Fotor-800x491.jpg",
  "https://samchui.com/wp-content/uploads/2023/01/Air_France_777_New_Cabin_33-800x600.jpg",
  "https://samchui.com/wp-content/uploads/2023/04/China-Southern-A321.jpg",
  "https://samchui.com/wp-content/uploads/2020/05/OS4A0863_Fotor-720x480.jpg",
  "https://samchui.com/wp-content/uploads/2018/09/Airbus-delivers-first-UltraLongRange-A350-XWB-800x551.jpg",
  "https://samchui.com/wp-content/uploads/2020/04/SYDD5678-800x534.jpg",
  "https://samchui.com/wp-content/uploads/2019/10/IndiGo-1000th-A320-Family-800x472.jpeg",
  "https://samchui.com/wp-content/uploads/2018/07/Boeing_787-8_Dreamliner_All_Nippon_Airways_-_ANA_AN2092645-770x511.jpg",
  "https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=600&h=450&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBsYW5lfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1615317779547-2078d82c549a?w=600&h=450&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHBsYW5lfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1512289984044-071903207f5e?w=600&h=450&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGxhbmV8ZW58MHx8MHx8fDA%3D",
  "https://plus.unsplash.com/premium_photo-1679758630036-763dea47d87f?w=600&h=450&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGxhbmV8ZW58MHx8MHx8fDA%3D",
];

export default async function PlanesPage() {
  unstable_noStore();
  const session = await auth();
  const isAdmin = session?.user.role === "ADMIN";

  if (!session?.user || !isAdmin) {
    return notFound();
  }

  const planes = await api.plane.listPlanes.query();

  return (
    <DashboardShell>
      <DashboardHeader heading="Planes" text="Manage all airport planes." />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {/* {planes */}
        {planes.map((plane, index) => (
          <Link
            key={plane.id}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-fullO group relative flex h-fit flex-col items-center justify-start overflow-hidden rounded-xl p-0"
            )}
            href={`/planes/${plane.id}?image=${srcs[index % srcs.length]}`}
            prefetch={false}>
            <div className="aspect-[4/3] w-full">
              <Image
                alt="Plane Image"
                className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
                height={450}
                src={srcs[index % srcs.length] ?? "/placeholder.svg"}
                style={{
                  aspectRatio: "600/450",
                  objectFit: "cover",
                }}
                width={600}
                quality={20}
              />
            </div>
            <div className="flex w-full flex-col items-start justify-start gap-2 p-6">
              <h3 className="text-lg font-semibold group-hover:text-foreground">
                Boeing 747-400
              </h3>
              <div className="flex items-center gap-2">
                <PlaneIcon className="mr-2 h-5 w-5 text-foreground" />
                <span className="text-sm text-foreground">Wide-Body Jet</span>
              </div>
              <div className="flex items-center gap-2">
                <TableIcon className="mr-2 h-5 w-5 text-foreground" />
                <span className="text-sm text-foreground">416 seats</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </DashboardShell>
  );
}
