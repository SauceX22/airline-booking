/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { PrismaClient } from "@prisma/client";
import { addDays, addMinutes, areIntervalsOverlapping } from "date-fns";

const db = new PrismaClient();

type AirlineData = {
  airline: string;
  country: string;
  code: string;
};

function safeRandomPick<T>(arr: T[]): T {
  // Throw error if the array is empty
  if (arr.length === 0) {
    throw new Error("Array is empty");
  }

  // Keep trying to pick a random value until a non-undefined value is found
  while (true) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    const randomValue = arr[randomIndex];
    if (randomValue !== undefined) {
      return randomValue;
    }
  }
}

function generateRandomDateInFuture(): Date {
  const currentDate = new Date();
  const futureDate = addDays(currentDate, Math.floor(Math.random() * 365) + 1); // Random date within next year
  return futureDate;
}

function generateRandomDuration(): number {
  // Generate a random duration between 1 and 12 hours (in minutes)
  return Math.floor(Math.random() * 12 * 60) + 1;
}

function hasConflictingFlight(
  date: Date,
  duration: number,
  existingFlights: { date: Date; duration: number }[]
): boolean {
  const flightStart = date;
  const flightEnd = addMinutes(date, duration);
  for (const existingFlight of existingFlights) {
    const existingFlightStart = existingFlight.date;
    const existingFlightEnd = addMinutes(
      existingFlight.date,
      existingFlight.duration
    );
    if (
      areIntervalsOverlapping(
        { start: existingFlightStart, end: existingFlightEnd },
        { start: flightStart, end: flightEnd },
        { inclusive: false }
      )
    ) {
      return true; // Conflict found
    }
  }
  return false; // No conflict
}

function generateFlightName(airlinesData: AirlineData[]) {
  // Randomly select an airline data object
  const randomAirlineData = safeRandomPick(airlinesData);

  // Extract airline code
  const airlineCode = randomAirlineData.code;

  // Generate a random flight number (1 to 9999)
  const flightNumber = Math.floor(Math.random() * 9999) + 1;

  // Construct and return the flight name
  return `${airlineCode} ${flightNumber}`;
}

async function createPlanes() {
  const data = await import("./data/planes.json");
  const planes = data.default;

  await db.plane.createMany({
    data: planes.map((plane) => ({
      id: plane.id,
      name: plane.name,
      nEconomySeats: plane.nEconomySeats,
      nBusinessSeats: plane.nBusinessSeats,
      nFirstClassSeats: plane.nFirstClassSeats,
      type: plane.type,
      lastMaintenanceDate: plane.lastMaintenanceDate,
      firstFlightDate: plane.firstFlightDate,
    })),
  });
  console.log("Planes created");
}

async function createFlights() {
  const cities = (await import("./data/cities.json")).default; // returns [ "london", "paris", "new-york", ... ]
  const airlines = (await import("./data/airlines.json")).default; // returns [ { "airline": "AMERICAN AIRLINES INC.", "country": "U.S.A.", "code": "AA" }, { ... }, { ... } ]
  const planes = await db.plane.findMany({
    select: { id: true },
  });

  // pick a random city from the list for each flight source and destination, pick a random UPCOMING date, and pick a random plane
  // do that 100 times
  for (let i = 0; i < 30; i++) {
    const flightName = generateFlightName(airlines);
    const source = safeRandomPick(cities);
    const destination = safeRandomPick(cities);
    const plane = safeRandomPick(planes);

    const existingFlights = await db.flight.findMany({
      where: { planeId: plane.id },
      select: { date: true, duration: true },
    });

    let randDate;
    let randDuration;
    do {
      randDate = generateRandomDateInFuture();
      randDuration = generateRandomDuration();
    } while (hasConflictingFlight(randDate, randDuration, existingFlights));

    await db.flight.create({
      data: {
        name: flightName,
        source: source.city,
        sourceCode: source.code,
        destination: destination.city,
        destinationCode: destination.code,
        date: randDate,
        duration: randDuration,
        planeId: plane.id,
      },
    });
  }
  console.log("Flights created");
}

async function createData() {
  await createPlanes();
  await createFlights();
}

async function main() {
  const TIMER = 2;
  console.warn("----------------------------------------");
  console.warn(
    "ATTENTION: This script will CLEAR the database and re-seed it with test data."
  );
  console.warn(`Press Ctrl + C to cancel, clearing within ${TIMER} seconds...`);
  console.warn("----------------------------------------");

  // clear the database within TIMER seconds
  await new Promise((resolve) => setTimeout(resolve, TIMER * 1000)).then(
    async () => {
      await db.plane.deleteMany({});
      await db.flight.deleteMany({});
    }
  );

  await createData();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void db.$disconnect();
  });
