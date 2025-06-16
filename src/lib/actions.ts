"use server";

import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

const createReservation = async (
  seatId: string,
  flightId: string,
  name: string,
  email: string
) => {
  if (!seatId || !flightId || !name || !email) {
    return { error: "Fields required." };
  }
  try {
    const reservation = await prisma.reservation.create({
      data: {
        id: `reservation-${Date.now()}`,
        seatId,
        flightId,
        passengerId: `passenger-${Date.now()}`,
        name,
        email,
        status: "confirmed",
        timestamp: new Date(),
      },
    });
    return { success: true, reservation };
  } catch (error) {
    return { error: "Reservation failed." };
  }
};

export { createReservation };
