import { PrismaClient } from "@/generated/prisma";
import { Passenger } from "../types";

const prisma = new PrismaClient();

export const DataService = {
  getAircraft: async () => {
    return await prisma.aircraft.findMany();
  },

  getAircraftById: async (id: string) => {
    return await prisma.aircraft.findUnique({ where: { id } });
  },

  getAirCraftByFlight: async (flightId: string) => {
    const flight = await prisma.flight.findUnique({
      where: { id: flightId },
      include: { aircraft: true },
    });
    return flight?.aircraft || null;
  },

  getFlightByAircraft: async (aircraftId: string) => {
    const flights = await prisma.flight.findMany({
      where: { aircraftId },
    });

    return flights[0] || null;
  },

  getSeats: async (aircraftId: string, flightId: string) => {
    const aircraft = await prisma.aircraft.findUnique({
      where: { id: aircraftId },
    });
    const seatClasses = await prisma.seatClass.findMany({
      where: { aircraftId },
    });
    if (!aircraft) return [];

    const reservations = await prisma.reservation.findMany({
      where: { flightId },
    });
    const reservedSeatIds = new Set(reservations.map((r) => r.seatId));

    const seats = [];
    const seatLetters = "ABCDEFGHJK";

    // Classes repartition
    const firstClassRows = Math.max(1, Math.floor(aircraft.rows * 0.1));
    const businessClassRows = Math.max(2, Math.floor(aircraft.rows * 0.2));

    // Dimensions
    const rowSpacing = aircraft.cabinLength / aircraft.rows;
    const seatWidth = aircraft.cabinWidth / (aircraft.seatsPerRow + 1);
    const aisleWidth = 0.5;
    const totalWidth = aircraft.seatsPerRow * seatWidth + aisleWidth;
    const startX = -totalWidth / 2 + seatWidth / 2;

    for (let row = 1; row <= aircraft.rows; row++) {
      let seatClass;
      if (row <= firstClassRows) {
        seatClass = seatClasses.find((c) => c.name === "first");
      } else if (row <= firstClassRows + businessClassRows) {
        seatClass = seatClasses.find((c) => c.name === "business");
      } else {
        seatClass = seatClasses.find((c) => c.name === "economy");
      }
      if (!seatClass) continue;

      for (let seatIndex = 0; seatIndex < aircraft.seatsPerRow; seatIndex++) {
        const column = seatLetters[seatIndex];
        let x = startX + seatIndex * seatWidth;
        if (seatIndex >= aircraft.aisleAfter) x += aisleWidth;
        const z = -(row - 1) * rowSpacing;
        const seatId = `${row}${column}`;

        const isAvailable = !reservedSeatIds.has(seatId);

        seats.push({
          id: seatId,
          aircraftId,
          classId: seatClass.id,
          row,
          column,
          position: { x, y: 0, z },
          isAvailable,
          price: seatClass.basePrice,
          class: seatClass.name,
        });
      }
    }
    return seats;
  },

  getSeatClasses: async (aircraftId?: string) => {
    if (aircraftId) {
      return prisma.seatClass.findMany({ where: { aircraftId } });
    }
    return prisma.seatClass.findMany();
  },

  getPassengers: async (
    aircraftId: string,
    flightId: string
  ): Promise<Passenger[]> => {
    const seats = await DataService.getSeats(aircraftId, flightId);
    const reservedSeats = seats.filter((seat) => !seat.isAvailable);

    return reservedSeats.map((seat) => {
      // Generate deterministic passenger data for 3d model customization (TODO feature)
      const hash = hashCode(`${seat.id}-${flightId}-passenger`);

      const gender = hash % 2 === 0 ? "male" : "female";

      const hairColors = [
        "#241c11",
        "#4f3824",
        "#a65e2e",
        "#d3b17d",
        "#dcd0c0",
        "#808080",
      ];
      const hairColor = hairColors[hash % hairColors.length];

      const skinTones = [
        "#ffe0bd",
        "#ffcd94",
        "#eac086",
        "#bf9169",
        "#8d5524",
        "#5a3a1a",
      ];
      const skinTone = skinTones[(hash * 3) % skinTones.length];

      const clothingColors: Record<string, string[]> = {
        economy: ["#3b82f6", "#10b981", "#f59e0b", "#6b7280", "#ec4899"],
        business: ["#1e3a8a", "#0f766e", "#92400e", "#374151", "#831843"],
        first: ["#312e81", "#064e3b", "#78350f", "#111827", "#701a75"],
      };
      const clothingColor =
        clothingColors[seat.class][
          (hash * 7) % clothingColors[seat.class].length
        ];

      const activities: ("reading" | "sleeping" | "standing" | "sitting")[] = [
        "reading",
        "sleeping",
        "standing",
        "sitting",
      ];
      const activity = activities[(hash * 11) % activities.length];

      return {
        id: `passenger-${seat.id}-${flightId}`,
        name: `Passenger ${seat.id}`,
        gender,
        activity,
        appearance: {
          hairColor,
          skinTone,
          clothingColor,
        },
      };
    });
  },

  getSeatClassById: async (id: string) => {
    return prisma.seatClass.findUnique({ where: { id } });
  },

  getFlights: async () => {
    return prisma.flight.findMany();
  },

  getFlightById: async (id: string) => {
    return prisma.flight.findUnique({ where: { id } });
  },

  getFlightsByAircraftId: async (aircraftId: string) => {
    return prisma.flight.findMany({ where: { aircraftId } });
  },
};

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}
