import { PrismaClient } from "@/generated/prisma";
import { v4 as uuidv4 } from "uuid";
import aircraftData from "@/lib/data/aircraft.json";
import seatClassesData from "@/lib/data/seat-classes.json";
import flightsData from "@/lib/data/flights.json";

const prisma = new PrismaClient();

async function main() {
  // Seed Aircraft
  for (const aircraft of aircraftData) {
    await prisma.aircraft.upsert({
      where: { id: aircraft.id },
      update: {},
      create: {
        ...aircraft,
      },
    });
  }

  // Seed SeatClasses for each Aircraft
  for (const aircraft of aircraftData) {
    for (const seatClass of seatClassesData) {
      await prisma.seatClass.upsert({
        where: { id: `${aircraft.id}-${seatClass.id}` },
        update: {},
        create: {
          id: `${aircraft.id}-${seatClass.id}`,
          name: seatClass.name,
          displayName: seatClass.displayName,
          basePrice: seatClass.basePrice,
          legRoom: seatClass.legRoom,
          recline: seatClass.recline,
          width: seatClass.width,
          color: seatClass.color,
          aircraft: { connect: { id: aircraft.id } },
        },
      });
    }
  }

  // Seed Flights
  for (const flight of flightsData) {
    await prisma.flight.upsert({
      where: { id: flight.id },
      update: {},
      create: {
        id: flight.id,
        aircraftId: flight.aircraftId,
        flightNumber: flight.flightNumber,
        departureAirport: flight.departureAirport,
        arrivalAirport: flight.arrivalAirport,
        departureTime: new Date(flight.departureTime),
        arrivalTime: new Date(flight.arrivalTime),
        status: flight.status,
      },
    });
  }

  // Seed Reservations
  const seatRows = 30;
  const seatLetters = ["A", "B", "C", "D", "E", "F"];
  const seatIds: string[] = [];

  for (let row = 1; row <= seatRows; row++) {
    for (const letter of seatLetters) {
      seatIds.push(`${row}${letter}`);
    }
  }
  const flightIds = ["flight-1", "flight-2", "flight-3"];
  const reservationCount = 50;

  for (let i = 0; i < reservationCount; i++) {
    await prisma.reservation.create({
      data: {
        id: uuidv4(),
        seatId: seatIds[Math.floor(Math.random() * seatIds.length)],
        flightId: flightIds[Math.floor(Math.random() * flightIds.length)],
        passengerId: `passenger-${Date.now()}`,
        email: `passenger${i}@example.com`,
        name: `Passenger ${i + 1}`,
        status: Math.random() > 0.5 ? "confirmed" : "pending",
        timestamp: new Date(),
      },
    });
  }
}

main()
  .then(() => {
    console.log("Seed completed.");
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
