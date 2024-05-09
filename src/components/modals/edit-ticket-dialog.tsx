"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Plane, Ticket } from "@prisma/client";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { ChevronDownIcon, DeleteIcon, Edit3Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@/components/ui/radio-group";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { revalidatePathCache } from "@/lib/actions";
import { cn, generateAllPossibleSeats } from "@/lib/utils";
import { updateTicketSchema } from "@/lib/validations/general";
import { api } from "@/trpc/client";

type FormData = z.infer<typeof updateTicketSchema>;

type EditTicketDialogButtonProps = {
  ticket: Ticket;
  plane: Plane;
  existingUserTickets: Ticket[];
};

export default function EditTicketDialogButton({
  ticket,
  plane,
  existingUserTickets,
}: EditTicketDialogButtonProps) {
  const editTicketForm = useForm<FormData>({
    resolver: zodResolver(updateTicketSchema),
    mode: "onChange",
    defaultValues: {
      name: ticket.passengerName,
      email: ticket.passengerEmail,
      seat: ticket.seat,
      seatClass: ticket.class,
    },
  });
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = editTicketForm;

  const path = usePathname();
  const apiUtils = api.useUtils();
  const [dialogOpen, setDialogOpen] = useState(false);

  const totalPlaneSeats =
    plane.nFirstClassSeats + plane.nEconomySeats + plane.nBusinessSeats;
  const usedSeats = existingUserTickets.map((ticket) => ticket.seat);

  const { mutateAsync: bookTickets, isLoading } =
    api.ticket.updateTicket.useMutation({
      onError(err) {
        toast.error("Something went wrong.", {
          description: err.message,
        });
        setDialogOpen(false);
      },
      async onSuccess(data, variables, context) {
        toast.success("Ticket updated successfully!", {
          description: "The ticket has been successfully updated.",
        });

        setDialogOpen(false);
        await apiUtils.ticket.invalidate();
        await revalidatePathCache(path);
      },
    });

  async function onSubmit(data: FormData) {
    await bookTickets({
      ticketId: ticket.id,
      name: data.name,
      email: data.email,
      seat: data.seat,
      seatClass: data.seatClass,
    });
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Edit3Icon className="mr-2 h-4 w-4" />
          Edit Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Ticket</DialogTitle>
          <DialogDescription>
            Update the passenger details and seat class.
          </DialogDescription>
        </DialogHeader>
        <Form {...editTicketForm}>
          <form>
            <FormField
              control={editTicketForm.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <FormControl id="name">
                    <Input
                      type="text"
                      id="name"
                      autoCapitalize="words"
                      autoComplete="name"
                      autoCorrect="off"
                      placeholder="Enter passenger name"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-span-2 col-start-2 row-start-2">
                    {errors.name?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={editTicketForm.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl id="email">
                    <Input
                      type="email"
                      id="email"
                      autoCapitalize="words"
                      autoComplete="email"
                      autoCorrect="off"
                      placeholder="Enter your email"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-span-2 col-start-2 row-start-2">
                    {errors.email?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={editTicketForm.control}
              name="seatClass"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel htmlFor="seat-class">Seat Class</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full" id="seat-class">
                        <SelectValue placeholder="Select seat class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Seat Classes</SelectLabel>
                        <SelectItem value="ECONOMY">Economy Class</SelectItem>
                        <SelectItem value="BUSINESS">Business Class</SelectItem>
                        <SelectItem value="FIRSTCLASS">First Class</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <Collapsible className="mt-2 w-full space-y-2">
              <CollapsibleTrigger
                disabled={isLoading}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "group flex w-full items-center justify-between"
                )}>
                <span className="font-medium">Seat Selection</span>
                <ChevronDownIcon className="h-5 w-5 transition-transform duration-300 group-[&[data-state=open]]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className=" w-full gap-2 rounded-lg bg-accent p-2">
                <FormField
                  control={editTicketForm.control}
                  name="seat"
                  disabled={isLoading}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ScrollArea className=" flex w-fit flex-row items-stretch justify-stretch ">
                          <RadioGroup
                            className="flex max-h-64 w-full flex-wrap items-start justify-evenly gap-2"
                            onValueChange={field.onChange}
                            value={field.value}>
                            {generateAllPossibleSeats({
                              planeSeats: totalPlaneSeats,
                            }).map((seat, index) => (
                              <FormControl key={index}>
                                <RadioGroupPrimitive.Item
                                  className={cn(
                                    buttonVariants({
                                      variant: "outline",
                                      size: "icon",
                                    }),
                                    "relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-xs",
                                    "hover:bg-background/60",
                                    "group [&[data-state=checked]]:bg-destructive/90"
                                  )}
                                  disabled={usedSeats.includes(seat)}
                                  id={seat}
                                  value={seat}>
                                  <span>{seat}</span>
                                </RadioGroupPrimitive.Item>
                              </FormControl>
                            ))}
                          </RadioGroup>
                          <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                      </FormControl>
                      <FormMessage>{errors.seat?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </CollapsibleContent>
            </Collapsible>
            <DialogFooter>
              <DialogClose className="w-full">
                <Button onClick={(e) => e.preventDefault()} variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                onClick={async (e) => {
                  e.preventDefault();
                  await onSubmit(editTicketForm.getValues());
                }}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
