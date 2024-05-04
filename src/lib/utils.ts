import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function generateRandomSeat({ usedSeats }: { usedSeats: string[] }) {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const totalColumns = 10; // Assuming 10 columns for seats

  let randomRow;
  let randomColumn;

  do {
    // Generate random row and column
    randomRow = rows[Math.floor(Math.random() * rows.length)];
    randomColumn = Math.floor(Math.random() * totalColumns) + 1; // Adding 1 to start from 1 instead of 0
    const seatName = `${randomRow}${randomColumn}`;

    // Check if the generated seat is not in the usedSeats array
    if (!usedSeats.includes(seatName)) {
      return seatName; // Return the seat name if it's not used
    }
  } while (true); // Keep generating until a unique seat name is found
}
