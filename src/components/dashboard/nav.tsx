import { headers } from "next/headers";
import Link from "next/link";

import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { auth } from "@/server/auth";
import { type SidebarNavItem } from "@/types";

interface DashboardNavProps {
  items: SidebarNavItem[];
}

export async function DashboardNav({ items }: DashboardNavProps) {
  const headersList = headers();
  // host: 'localhost:3000',
  const domain = headersList.get("host") ?? "";
  // referer: 'http://localhost:3000/home',
  const fullUrl = headersList.get("referer") ?? "";

  const path = fullUrl
    .replace(domain, "")
    .replace("http://", "")
    .replace("https://", "");

  const session = await auth();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-1">
      {items.map((item, index) => {
        if (item.adminOnly && session?.user.role !== "ADMIN") {
          return null;
        }

        const Icon = Icons[item.icon ?? "arrowRight"];
        return (
          item.href && (
            <Link prefetch key={index} href={item.disabled ? "#" : item.href}>
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-3 text-base font-medium hover:bg-accent hover:text-accent-foreground",
                  session?.user.role === "ADMIN" && item.adminOnly
                    ? "border border-dashed border-orange-500"
                    : "",
                  path === item.href ? "bg-accent" : "transparent",
                  item.disabled && "cursor-not-allowed opacity-80"
                )}>
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </span>
            </Link>
          )
        );
      })}
    </nav>
  );
}
