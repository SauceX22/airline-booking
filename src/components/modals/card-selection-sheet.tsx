"use client";

import type { CreditCard } from "@prisma/client";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CircleCheckBigIcon, CreditCardIcon } from "lucide-react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import NewCardDialog from "@/components/modals/new-card-dialog";
import { cn } from "@/lib/utils";

type CardSelectionSheetProps = {
  cards: CreditCard[];
};

export default function CardSelectionSheet({ cards }: CardSelectionSheetProps) {
  const { data: session } = useSession();

  return (
    <Sheet key="card-selection-sheet">
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full">
          Pay
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Select Payment Method</SheetTitle>
          <SheetDescription>
            Choose the card you'd like to use for this payment.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <RadioGroup className="grid gap-2" defaultValue="card1">
            {cards.map((card) => (
              <RadioGroupPrimitive.Item
                key={card.id}
                id={card.id}
                value={card.id}
                className={cn(
                  "group flex h-24 w-full items-center justify-between",
                  "rounded-lg border-2 border-input bg-background p-4",
                  "text-primary ring-offset-background hover:bg-accent",
                  "focus-visible:ring-2 focus-visible:ring-ring",
                  "hover:text-accent-foreground disabled:cursor-not-allowed",
                  "focus:outline-none disabled:opacity-50",
                  "data-[state=checked]:border-muted-foreground",
                  "focus-visible:ring-offset-2 data-[state=checked]:bg-muted"
                )}>
                <div className="flex items-center justify-start gap-4">
                  <CreditCardIcon className="h-6 w-6" />
                  <div className="flex flex-col items-start">
                    <div className="font-medium">{card.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Expires {card.expiry}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {session?.user.name}
                    </div>
                  </div>
                </div>
                <CircleCheckBigIcon className="hidden h-6 w-6 group-data-[state=checked]:block" />
              </RadioGroupPrimitive.Item>
            ))}
          </RadioGroup>
        </div>
        <NewCardDialog />
        <SheetFooter>
          <Button className="w-full">Continue</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
