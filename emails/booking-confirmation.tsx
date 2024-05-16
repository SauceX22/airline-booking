import * as React from "react";
import type { Flight, Ticket } from "@prisma/client";
import { format } from "date-fns";

import { getBaseUrl } from "@/lib/utils";

export interface BookingConfirmationEmailTemplateProps {
  ticket: Pick<
    Ticket,
    "id" | "passengerName" | "passengerEmail" | "class" | "bookingDate"
  > & {
    Flight: Pick<
      Flight,
      | "name"
      | "date"
      | "source"
      | "destination"
      | "sourceCode"
      | "destinationCode"
    >;
  };
}

const BookingConfirmationEmailTemplate: React.FC<
  Readonly<BookingConfirmationEmailTemplateProps>
> = ({
  ticket = {
    id: "1ec207c5-64ff-5736-a32f-92b265194820",
    passengerName: "John Doe",
    passengerEmail: "johndoe@example.com",
    class: "ECONOMY",
    bookingDate: new Date("2023-03-15T00:00:00Z"),
    Flight: {
      name: "Boeing 777",
      date: new Date("2023-03-15T00:00:00Z"),
      source: "LAX",
      destination: "JFK",
      sourceCode: "LAX",
      destinationCode: "JFK",
    },
  },
}) => (
  <div className="px-4 py-8 sm:px-6 lg:px-8">
    <div className="container mx-auto max-w-3xl space-y-6">
      <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Booking Confirmation</h1>
          <div className="bg-primary-500 rounded-full px-3 py-1 text-xs font-medium text-white">
            Confirmed
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <h2 className="mb-2 text-lg font-medium">Passenger</h2>
            <p className="text-gray-500 dark:text-gray-400">
              {ticket.passengerName}
            </p>
          </div>
          <div>
            <h2 className="mb-2 text-lg font-medium">Confirmation #</h2>
            <p className="text-gray-500 dark:text-gray-400">{ticket.id}</p>
          </div>
          <div>
            <h2 className="mb-2 text-lg font-medium">Departure</h2>
            <p className="text-gray-500 dark:text-gray-400">
              {ticket.Flight.sourceCode} - {ticket.Flight.source}
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              {format(ticket.bookingDate, "MMM do, yyyy") +
                " - " +
                format(ticket.bookingDate, "h:mm a")}
            </p>
          </div>
          <div>
            <h2 className="mb-2 text-lg font-medium">Arrival</h2>
            <p className="text-gray-500 dark:text-gray-400">
              {ticket.Flight.destinationCode} - {ticket.Flight.destination}
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              {format(ticket.bookingDate, "MMM do, yyyy") +
                " - " +
                format(ticket.bookingDate, "h:mm a")}
            </p>
          </div>
          <div>
            <h2 className="mb-2 text-lg font-medium">Booking Date</h2>
            <p className="text-gray-500 dark:text-gray-400">
              {format(ticket.bookingDate, "MMM do, yyyy")}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <a
            className="bg-primary-500 hover:bg-primary-600 focus:ring-primary-500 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
            href={`${getBaseUrl()}/tickets`}>
            View Booking Online
          </a>
        </div>
      </div>
      <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
        <h2 className="mb-4 text-lg font-medium">Need Help?</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 font-medium text-gray-500 dark:text-gray-400">
              Customer Service
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              +1 (555) 123-4567
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              support@acmeairlines.com
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-medium text-gray-500 dark:text-gray-400">
              Baggage Assistance
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              +1 (555) 987-6543
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              baggage@acmeairlines.com
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default BookingConfirmationEmailTemplate;
