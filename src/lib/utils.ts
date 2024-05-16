import type { Flight, Plane, SeatClass, Ticket } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.APP_URL) return process.env.APP_URL;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

const PLANE_ROWS = ["A", "B", "C", "D", "E", "F"];

export function generateAllPossibleSeats({
  planeSeats,
  seatClass,
}: {
  planeSeats: number;
  seatClass: SeatClass;
}) {
  const totalRows = PLANE_ROWS.length;
  const totalColumns = Math.ceil(planeSeats / totalRows); // Calculate total columns based on the number of seats

  const allSeats = [];

  for (let i = 0; i < totalRows; i++) {
    for (let j = 1; j <= totalColumns; j++) {
      let seatName = `${PLANE_ROWS[i]}${j}`;
      if (seatClass === "FIRSTCLASS") {
        seatName = `F${seatName}`;
      } else if (seatClass === "BUSINESS") {
        seatName = `B${seatName}`;
      }
      allSeats.push(seatName);
    }
  }

  return allSeats.slice(0, planeSeats); // Return only the required number of seats if totalSeats is less than totalRows * totalColumns
}

export function getSeatClassSeatCount(plane: Plane, seatClass: SeatClass) {
  if (seatClass === "BUSINESS") {
    return plane.nBusinessSeats;
  } else if (seatClass === "FIRSTCLASS") {
    return plane.nFirstClassSeats;
  } else {
    return plane.nEconomySeats;
  }
}

export function generateRandomSeat({
  planeSeats,
  usedSeats,
}: {
  planeSeats: number;
  usedSeats: string[];
}) {
  const totalRows = PLANE_ROWS.length;
  const totalColumns = Math.ceil(planeSeats / totalRows);

  let randomRow;
  let randomColumn;

  do {
    // Generate random row and column
    randomRow = PLANE_ROWS[Math.floor(Math.random() * PLANE_ROWS.length)];
    randomColumn = Math.floor(Math.random() * totalColumns) + 1; // Adding 1 to start from 1 instead of 0
    const seatName = `${randomRow}${randomColumn}`;

    // Check if the generated seat is not in the usedSeats array
    if (!usedSeats.includes(seatName)) {
      return seatName; // Return the seat name if it's not used
    }
  } while (true); // Keep generating until a unique seat name is found
}

export type FineCause = "CANCELLED" | "MISSED";

export function getFine({
  ticketPrice,
  cause,
}: {
  ticketPrice: number;
  cause: FineCause;
}) {
  if (cause === "CANCELLED") {
    return ticketPrice * 0.2;
  } else {
    return ticketPrice * 0.1;
  }
}

export function getFlightStats(
  flight: Flight & { Plane: Plane; Tickets: Ticket[] }
) {
  const totalPlaneSeats =
    flight.Plane.nFirstClassSeats +
    flight.Plane.nEconomySeats +
    flight.Plane.nBusinessSeats;

  const confirmedAndPendingTickets: Ticket[] = [];
  const cancelledTickets: Ticket[] = [];
  const waitlistedTickets: Ticket[] = [];
  const usedSeats: string[] = [];

  for (const ticket of flight.Tickets) {
    if (ticket.status === "CONFIRMED" || ticket.status === "PENDING") {
      confirmedAndPendingTickets.push(ticket);
      usedSeats.push(ticket.seat);
    } else if (ticket.status === "CANCELLED") {
      cancelledTickets.push(ticket);
    } else if (ticket.status === "WAITLISTED") {
      waitlistedTickets.push(ticket);
    }
  }

  const availableFreeSeats =
    totalPlaneSeats - confirmedAndPendingTickets.length;
  const isWaitlistOnly = availableFreeSeats === 0;

  return {
    totalPlaneSeats,
    confirmedAndPendingTickets,
    cancelledTickets,
    waitlistedTickets,
    usedSeats,
    availableFreeSeats,
    isWaitlistOnly,
  };
}
