import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { type User } from "@/server/auth";

import { UserAvatar } from "../user-avatar";

interface UserItemProps {
  user: User;
}

export function UserItem({ user }: UserItemProps) {
  return (
    <Card className="flex items-center justify-between p-2">
      <CardHeader className="flex flex-shrink-0 flex-row items-center justify-start gap-4 text-xl font-bold">
        <UserAvatar user={user} />
        {user.name}
      </CardHeader>
      <CardContent className="flex h-full w-full flex-row items-center justify-between gap-8 p-4">
        <span className="text-left text-sm font-normal text-muted-foreground">
          {user.email}
        </span>
        <span
          className={cn(
            "text-sm font-normal",
            user.enabled ? "text-green-500" : "text-red-500"
          )}>
          {user.enabled ? "Enabled" : "Disabled"}
        </span>
      </CardContent>
      <CardFooter className="p-4">
        {/* <UserOperations user={user} className="my-auto" /> */}
        <Link prefetch href="#" className={cn(buttonVariants(), "w-full")}>
          View
        </Link>
      </CardFooter>
    </Card>
  );
}

UserItem.Skeleton = function UserItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
};
