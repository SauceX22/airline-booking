"use client";

import Link from "next/link";
import type { User } from "@prisma/client";
import { signOut } from "next-auth/react";

import { dashboardConfig } from "@/config/dashboard";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "email" | "image" | "name" | "role">;
}

export function UserAccountNav({ user }: UserAccountNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar user={user} className="h-8 w-8" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className={
          user.role === "ADMIN" ? "border border-dashed border-orange-500" : ""
        }>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
            <Badge
              variant="default"
              className={cn(
                "pointer-events-none flex w-full flex-shrink-0 items-center justify-center rounded-md py-1 text-xs",
                user.role === "ADMIN" ? "bg-orange-500" : ""
              )}>
              {user.role}
            </Badge>
          </div>
        </div>
        <DropdownMenuSeparator />
        {dashboardConfig.sidebarNav.map((item, idx) => {
          if (item.managerOnly && user.role !== "ADMIN") {
            return null;
          }

          return (
            <DropdownMenuItem key={idx} asChild>
              <Link prefetch href={item.href}>
                {item.title}
              </Link>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault();
            void signOut({
              callbackUrl: `${window.location.origin}/auth/login`,
            });
          }}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
