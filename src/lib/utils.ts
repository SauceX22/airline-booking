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

const PLANE_ROWS = ["A", "B", "C", "D", "E", "F"];

export function generateAllPossibleSeats({
  planeSeats,
}: {
  planeSeats: number;
}) {
  const totalRows = PLANE_ROWS.length;
  const totalColumns = Math.ceil(planeSeats / totalRows); // Calculate total columns based on the number of seats

  const allSeats = [];

  for (let i = 0; i < totalRows; i++) {
    for (let j = 1; j <= totalColumns; j++) {
      const seatName = `${PLANE_ROWS[i]}${j}`;
      allSeats.push(seatName);
    }
  }

  return allSeats.slice(0, planeSeats); // Return only the required number of seats if totalSeats is less than totalRows * totalColumns
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
