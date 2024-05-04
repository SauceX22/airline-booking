"use client";

import { usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Flight, Plane, Ticket } from "@prisma/client";
import { format } from "date-fns";
import {
  CalendarIcon,
  ChevronRightIcon,
  CircleArrowDownIcon,
  CircleArrowRightIcon,
  CircleCheckIcon,
  CircleDollarSignIcon,
  CircleXIcon,
  HashIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { SeatClassPriceRestriction } from "@/config/site";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { revalidatePathCache } from "@/lib/actions";
import { newBookingFormSchema } from "@/lib/validations/general";
import { api } from "@/trpc/client";

interface BookTicketSectionProps {
  flight: Flight & { Plane: Plane; Tickets: Ticket[] };
  existingUserTickets: Ticket[];
}

type FormData = z.infer<typeof newBookingFormSchema>;

export function BookTicketSection({
  flight,
  existingUserTickets,
}: BookTicketSectionProps) {
  const { data: session } = useSession();
  const newBookingForm = useForm<FormData>({
    resolver: zodResolver(newBookingFormSchema),
    mode: "onChange",
    defaultValues: {
      passengers: [
        {
          name: session?.user.name ?? "Passenger 1",
          email: session?.user.email ?? "passenger.1@example.com",
          seatClass: "ECONOMY",
        },
      ],
    },
  });
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = newBookingForm;

  const passengerFields = useFieldArray({
    control: newBookingForm.control,
    name: "passengers",
    rules: {
      minLength: 1,
      maxLength: 10 - existingUserTickets.length,
      validate: (value) => {
        if (value.length < 1) {
          return "You must have at least one passenger";
        }
        if (value.length > 10 - existingUserTickets.length) {
          return "You can only have 10 tickets per flight";
        }
        return true;
      },
    },
  });

  const path = usePathname();
  const router = useRouter();
  const apiUtils = api.useUtils();

  const { mutateAsync: bookTickets, isLoading } =
    api.ticket.createTickets.useMutation({
      onError(err) {
        toast.error("Something went wrong.", {
          description: err.message,
        });
      },
      async onSuccess(data, variables, context) {
        toast.success("Tickets booked successfully!", {
          description: "The tickets have been successfully booked.",
        });

        await apiUtils.ticket.invalidate();
        await revalidatePathCache(path);
        router.push("/home");
        router.refresh();
      },
    });

  async function onSubmit(data: FormData, { payLater }: { payLater: boolean }) {
    // if any passenger has the same email as an existing passenger, throw an error
    const existingEmails = existingUserTickets.map(
      (ticket) => ticket.passengerEmail
    );
    const newEmails = data.passengers.map((passenger) => passenger.email);
    if (existingEmails.some((email) => newEmails.includes(email))) {
      return toast.error("One of the passengers already has a ticket.", {
        description: existingEmails
          .filter((email) => newEmails.includes(email))
          .map((email) => `${email} has a ticket.`)
          .join("\n"),
      });
    }
    await bookTickets({
      flightId: flight.id,
      passengers: data.passengers,
      payLater,
    });
  }

  return (
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
      <Form {...newBookingForm}>
        <form className="col-span-1 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Passengers</h2>
            <Button
              className=""
              onClick={(e) => {
                e.preventDefault();
                if (
                  passengerFields.fields.length >=
                  10 - existingUserTickets.length
                ) {
                  return toast.error(
                    "You can only have 10 passengers per flight"
                  );
                }
                passengerFields.append({
                  name: `Passenger ${passengerFields.fields.length + 1}`,
                  email: `passenger.${passengerFields.fields.length + 1}@example.com`,
                  seatClass: "ECONOMY",
                });
              }}>
              Add Passenger
            </Button>
          </div>
          <Separator className="my-4" />
          <ScrollArea>
            {passengerFields.fields.map((field, index) => (
              <section key={field.id} className="p-1">
                <div className="flex items-start justify-stretch gap-2">
                  <FormField
                    {...register(`passengers.${index}.name`)}
                    control={newBookingForm.control}
                    render={({ field }) => (
                      <FormItem className="w-full">
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
                        <FormMessage>
                          {errors.passengers?.[index]?.name?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    {...register(`passengers.${index}.email`)}
                    control={newBookingForm.control}
                    render={({ field }) => (
                      <FormItem className="w-full">
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
                        <FormMessage>
                          {errors.passengers?.[index]?.email?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    {...register(`passengers.${index}.seatClass`)}
                    control={newBookingForm.control}
                    defaultValue="ECONOMY"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel htmlFor="seat-class">Seat Class</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select seat class" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Seat Classes</SelectLabel>
                              <SelectItem value="ECONOMY">
                                Economy Class
                              </SelectItem>
                              <SelectItem value="BUSINESS">
                                Business Class
                              </SelectItem>
                              <SelectItem value="FIRSTCLASS">
                                First Class
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-[4.5rem] shrink-0 grow-0"
                    onClick={(e) => {
                      e.preventDefault();
                      passengerFields.remove(index);
                    }}>
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </section>
            ))}
          </ScrollArea>
        </form>
      </Form>
      <div className="col-span-1 space-y-6 rounded-lg bg-accent p-6">
        <div>
          <h2 className="mb-4 text-2xl font-bold">Flight Details</h2>
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium text-muted-foreground">
                <CircleArrowRightIcon className="my-auto h-4 w-4 shrink-0 grow-0" />
                From
              </span>
              <span className="max-w-[50%] truncate text-nowrap text-lg font-semibold text-foreground">
                <span>({flight.sourceCode})</span> {flight.source}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium text-muted-foreground">
                <CircleArrowDownIcon className="my-auto h-4 w-4 shrink-0 grow-0" />
                To
              </span>
              <span className="max-w-[50%] truncate text-nowrap text-lg font-semibold text-foreground">
                <span>({flight.destinationCode})</span> {flight.destination}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium text-muted-foreground">
                <CalendarIcon className="my-auto h-4 w-4 shrink-0 grow-0" />
                Departure
              </span>
              <span className="text-lg font-semibold text-foreground">
                {format(flight.date, "MMM do, yyyy")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium text-muted-foreground">
                <HashIcon className="my-auto h-4 w-4 shrink-0 grow-0" />
                Passengers
              </span>
              <span className="text-lg font-semibold text-foreground">
                {newBookingForm.getValues("passengers").length}
              </span>
            </div>
            <div>
              {existingUserTickets.length > 0 && (
                <>
                  <Separator className="mx-auto my-4 w-[80%] rounded-lg bg-muted-foreground" />
                  {existingUserTickets.map((ticket) => (
                    <div
                      className="mb-2 flex items-center justify-between"
                      key={ticket.id}>
                      <span className="flex items-center gap-2 truncate text-nowrap font-semibold text-foreground">
                        {ticket.paymentStatus === "CONFIRMED" &&
                        ticket.paymentDate ? (
                          <CircleCheckIcon className="my-auto h-5 w-5 shrink-0 grow-0 text-success" />
                        ) : (
                          <CircleXIcon className="my-auto h-5 w-5 shrink-0 grow-0 text-destructive" />
                        )}

                        <span className="flex flex-col items-start text-sm">
                          {ticket.passengerName}
                          <span className="flex items-start text-xs text-muted-foreground">
                            {ticket.passengerEmail}
                          </span>
                        </span>
                      </span>
                      <span className="text-sm font-semibold capitalize text-muted-foreground">
                        {ticket.class.replace("CLASS", " Class").toLowerCase()}
                      </span>
                    </div>
                  ))}
                </>
              )}
              <Separator className="mx-auto my-4 w-[80%] rounded-lg bg-muted-foreground" />
              {newBookingForm.getValues("passengers").length > 0 ? (
                newBookingForm.getValues("passengers").map((field, index) => (
                  <div
                    className="flex items-center justify-between"
                    key={index}>
                    <span className="flex items-center gap-2 text-lg font-semibold text-foreground">
                      <ChevronRightIcon className="my-auto h-4 w-4 shrink-0 grow-0" />
                      {field.name}
                    </span>
                    <span className="text-lg font-semibold capitalize text-muted-foreground">
                      {field.seatClass.replace("CLASS", " Class").toLowerCase()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center text-sm font-semibold text-muted-foreground">
                  <span>No passengers</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold">Total Cost</h2>
          <div className="mt-2 space-y-2">
            <div className="flex items-start justify-between">
              <span className="flex items-center justify-start gap-2 font-medium text-muted-foreground">
                <CircleDollarSignIcon className="my-auto h-4 w-4 shrink-0 grow-0" />
                Base Fare
              </span>
              <span className="flex flex-col items-end justify-start">
                {newBookingForm.getValues("passengers").length > 0 ? (
                  newBookingForm.getValues("passengers").map((field, index) => (
                    <span
                      key={index}
                      className="flex items-center justify-end font-semibold capitalize text-muted-foreground">
                      <PlusIcon className="my-auto h-3 w-3 shrink-0 grow-0" />$
                      {SeatClassPriceRestriction[field.seatClass]}
                    </span>
                  ))
                ) : (
                  <span className="flex items-center justify-end font-semibold capitalize text-muted-foreground">
                    $0
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-2 text-xl font-medium text-muted-foreground">
                Total
              </span>
              <span className="flex items-center justify-end text-2xl font-bold">
                $
                {newBookingForm.getValues("passengers").length > 0
                  ? newBookingForm
                      .getValues("passengers")
                      .map(
                        (field, index) =>
                          SeatClassPriceRestriction[field.seatClass]
                      )
                      .reduce((a, b) => a + b, 0)
                  : 0}
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Button
            className="w-full"
            size="lg"
            onClick={async (e) => {
              e.preventDefault();
              await newBookingForm.handleSubmit((data) =>
                onSubmit(data, { payLater: false })
              )();
            }}>
            Proceed to Payment
          </Button>
          <Button
            className="w-full border-background hover:border-background/80 hover:bg-background/80"
            size="lg"
            variant="outline"
            onClick={async (e) => {
              e.preventDefault();
              await newBookingForm.handleSubmit((data) =>
                onSubmit(data, { payLater: true })
              )();
            }}>
            Pay Later
          </Button>
        </div>
      </div>
    </div>
  );
}
