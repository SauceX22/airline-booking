import { type Ticket } from "@prisma/client";
import { CircleCheck, TicketIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/server/auth";

interface TicketItemProps {
  ticket: Ticket;
}

export async function TicketItem({ ticket }: TicketItemProps) {
  const session = await auth();
  const isAdmin = session?.user.role === "ADMIN";

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center justify-start gap-2">
          <TicketIcon className="h-6 w-6" />
          <span className="text-xl font-semibold">Flight Details</span>
        </div>
        <Badge
          className="pointer-events-none w-fit select-none gap-2 text-lg font-medium text-muted-foreground"
          variant="default">
          <CircleCheck className="h-4 w-4" />
          Confirmed
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-6 pb-4">
        <div className="grid gap-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1">
              <div className="text-base text-gray-500 dark:text-gray-400">
                Flight Date
              </div>
              <div>May 1, 2024</div>
            </div>
            <div className="grid gap-1">
              <div className="text-base text-gray-500 dark:text-gray-400">
                Seat
              </div>
              <div>12A</div>
            </div>
            <div className="grid gap-1">
              <div className="text-base text-gray-500 dark:text-gray-400">
                Weight
              </div>
              <div>23 kg</div>
            </div>
            <div className="grid gap-1">
              <div className="text-base text-gray-500 dark:text-gray-400">
                Price
              </div>
              <div>$499</div>
            </div>
          </div>
        </div>
      </CardContent>
      <Separator className="my-4" />
      <CardFooter>
        <div className="grid gap-2">
          <div className="font-medium">Payment</div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1">
              <div className="text-base text-gray-500 dark:text-gray-400">
                Payment Date
              </div>
              <div>May 1, 2024</div>
            </div>
            <div className="grid gap-1">
              <div className="text-base text-gray-500 dark:text-gray-400">
                Payment Status
              </div>
              <div>Paid</div>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

TicketItem.Skeleton = function TicketItemSkeleton() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="grid gap-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="grid gap-1 text-right">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-12" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between">
          <div className="grid gap-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-12" />
          </div>
          <div className="grid gap-1 text-right">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-16 bg-green-500" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="grid gap-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="grid gap-1 text-right">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
