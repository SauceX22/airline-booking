"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Search, SearchX } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { searchAction } from "@/lib/actions/search";
import { cn } from "@/lib/utils";
import { flightFilterFormSchema } from "@/lib/validations/general";
import { api } from "@/trpc/client";

type FormData = z.infer<typeof flightFilterFormSchema>;

const FlightFilterHeader = () => {
  const searchParams = useSearchParams();
  const path = usePathname();

  const sourceSP = searchParams.get("source");
  const destSP = searchParams.get("dest");
  const dateSP = searchParams.get("date");

  const filterForm = useForm<FormData>({
    resolver: zodResolver(flightFilterFormSchema),
    defaultValues: {
      source: sourceSP ?? undefined,
      dest: destSP ?? undefined,
      date: dateSP ? new Date(dateSP) : undefined,
    },
    mode: "onChange",
  });

  const { data: cities } = api.flight.listCities.useQuery(undefined, {
    staleTime: Infinity,
  });

  async function onSubmit(data: FormData) {
    await searchAction(data, path);

    // if notion is used, replace with notion toast
    if (!data.source && !data.dest && !data.date) {
      return toast.info("Showing all upcoming flights", {
        description: "All flights are displayed below",
        duration: 1000,
      });
    }

    // if all
    if (data.source && data.dest && data.date) {
      return toast.info("Showing search results", {
        description: JSON.stringify({
          from: data.source,
          to: data.dest,
          date: format(data.date, "PPP"),
        }),
        icon: "🔍",
        duration: 2500,
      });
    }

    if (data.date) {
      return toast.info("Showing search results", {
        description: `Showing flights available on ${format(data.date, "PPP")}`,
        icon: "🔍",
        duration: 2500,
      });
    }

    if (data.source && data.dest) {
      return toast.info("Showing search results", {
        description: `Showing flights going from ${data.source} to ${data.dest}`,
        icon: "🔍",
        duration: 2500,
      });
    }

    if (data.source) {
      return toast.info("Showing search results", {
        description: `Showing flights flying out from ${data.source}`,
        icon: "🔍",
        duration: 2500,
      });
    }

    if (data.dest) {
      return toast.info("Showing search results", {
        description: `Showing flights flying to ${data.dest}`,
        icon: "🔍",
        duration: 2500,
      });
    }
  }

  return (
    <Form {...filterForm}>
      <form
        className="grid w-full grid-cols-8 grid-rows-1 gap-2"
        onSubmit={filterForm.handleSubmit(onSubmit)}
        onKeyDown={async (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            await filterForm.handleSubmit(onSubmit)();
          }
        }}>
        <FormField
          control={filterForm.control}
          name="source"
          render={({ field: { ref: _ref, ...field } }) => (
            <FormItem className="col-span-2 flex flex-col">
              <Select
                {...field}
                onValueChange={async (value) => {
                  const validatedValue =
                    flightFilterFormSchema.shape.source.safeParse(value);
                  if (!validatedValue.success) return;
                  if (value === "any") {
                    filterForm.reset({ source: undefined });
                  } else {
                    filterForm.setValue("source", validatedValue.data);
                  }
                  await filterForm.handleSubmit(onSubmit)();
                }}
                value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Source City" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Going From</SelectLabel>
                    <SelectItem value="any">Any</SelectItem>
                    {cities?.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={filterForm.control}
          name="dest"
          render={({ field: { ref: _ref, ...field } }) => (
            <FormItem className="col-span-2 flex flex-col">
              <Select
                {...field}
                onValueChange={async (value) => {
                  const validatedValue =
                    flightFilterFormSchema.shape.dest.safeParse(value);
                  if (!validatedValue.success) return;
                  if (value === "any") {
                    filterForm.reset({ dest: undefined });
                  } else {
                    filterForm.setValue("dest", validatedValue.data);
                  }
                  await filterForm.handleSubmit(onSubmit)();
                }}
                value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Destination City" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Going To</SelectLabel>
                    <SelectItem value="any">Any</SelectItem>
                    {cities?.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={filterForm.control}
          name="date"
          render={({ field: { ref: _ref, ...field } }) => (
            <FormItem className="col-span-2 flex flex-col">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}>
                      {field.value ? (
                        <span>
                          <span className="underline">
                            {format(field.value, "PPP")}
                          </span>
                        </span>
                      ) : (
                        <span>Pick a flight date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    {...field}
                    mode="single"
                    selected={field.value}
                    onSelect={async (date) => {
                      if (!date) return;
                      filterForm.setValue("date", date);
                      await filterForm.handleSubmit(onSubmit)();
                    }}
                    className="flex-shrink-0 rounded-md border"
                    footer={
                      <Button
                        variant="outline"
                        className="mt-2 w-full text-center text-sm text-muted-foreground"
                        onClick={async (e) => {
                          e.preventDefault();
                          filterForm.setValue("date", undefined);
                          await filterForm.handleSubmit(onSubmit)();
                        }}>
                        clear
                      </Button>
                    }
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          variant="outline"
          className="col-span-1"
          onClick={async (e) => {
            e.preventDefault();
            filterForm.reset({
              source: undefined,
              dest: undefined,
              date: undefined,
            });
            await filterForm.handleSubmit(onSubmit)();
          }}>
          <SearchX className="mr-2 h-4 w-4" />
          Clear
        </Button>
        <Button className="col-span-1" type="submit">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </form>
    </Form>
  );
};

export default FlightFilterHeader;
