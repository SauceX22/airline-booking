"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CreditCard, Ticket } from "@prisma/client";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import {
  CircleCheckBigIcon,
  CreditCardIcon,
  DollarSignIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MotionButton } from "@/components/ui/motion-button";
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
import { ticketPaymentFormSchema } from "@/lib/validations/general";
import { api } from "@/trpc/client";

type TicketPaymentSheetButtonProps = {
  ticket: Ticket;
  cards: CreditCard[];
};

type FormData = z.infer<typeof ticketPaymentFormSchema>;

export default function TicketPaymentSheetButton({
  cards,
  ticket,
}: TicketPaymentSheetButtonProps) {
  const ticketPaymentForm = useForm<FormData>({
    resolver: zodResolver(ticketPaymentFormSchema),
    mode: "onChange",
    defaultValues: {
      cardId: undefined,
    },
  });
  const {
    handleSubmit,
    formState: { errors },
  } = ticketPaymentForm;

  const { data: session } = useSession();
  const apiUtils = api.useUtils();
  const router = useRouter();
  const isPaid = ticket.paymentStatus === "CONFIRMED";
  const [isOpen, setIsOpen] = useState(false);

  const { mutateAsync: payTicket, isLoading: isPaying } =
    api.ticket.payTicket.useMutation({
      onError(err) {
        toast.error("Something went wrong.", {
          description: err.message,
        });
      },
      async onSuccess(data, variables, context) {
        toast.success("Ticket paid", {
          description: "Ticket paid successfully.",
        });

        await apiUtils.ticket.invalidate();
        router.refresh();
      },
    });

  async function onSubmit(data: FormData) {
    await payTicket({ cardId: data.cardId, ticketId: ticket.id });
    setIsOpen(false);
  }

  return (
    <Sheet key="card-selection-sheet" open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="default" disabled={isPaying || isPaid}>
          <DollarSignIcon className="mr-2 h-4 w-4" />
          {isPaid ? "Ticket Paid" : "Pay Ticket"}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Select Payment Method</SheetTitle>
          <SheetDescription>
            Choose the card you&aposd like to use for this payment.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <Form {...ticketPaymentForm}>
            <form>
              <FormField
                control={ticketPaymentForm.control}
                name="cardId"
                render={({ field }) => (
                  <FormItem className="mt-2">
                    <FormControl id="cardId">
                      <RadioGroup
                        className="grid gap-2"
                        onValueChange={field.onChange}
                        value={field.value}>
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
                    </FormControl>
                    <FormMessage>{errors.cardId?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <NewCardDialog />
        <SheetFooter>
          <MotionButton
            className="w-full"
            onClick={async (e) => {
              e.preventDefault();
              await handleSubmit(onSubmit)();
            }}
            disabled={isPaying}>
            Finish Payment
          </MotionButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
