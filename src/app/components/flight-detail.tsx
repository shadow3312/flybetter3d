"use client";

import {
  showReservationModalAtom,
  selectedFlightAtom,
} from "@/state/atoms";
import { Aircraft, Passenger, Seat } from "@/lib/types";
import { useAtom, useAtomValue } from "jotai";
import React, { useState } from "react";

type Props = {
  flightId: string;
  aircraftData: Aircraft;
  seatsData: Seat[];
  passengersData: Passenger[]
};

export default function FlightDetail({ flightId, aircraftData, seatsData, passengersData }: Props) {
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [showReservationModal, setShowReservationModal] = useAtom(
    showReservationModalAtom
  );
  const selectedFlight = useAtomValue(selectedFlightAtom);

  const handleSeatSelect = (seat: Seat) => {
    setSelectedSeat(seat);
    setShowReservationModal(true);
  };

  return (
    (
      <div className="w-full h-full">
        <div className="flex-1">
          {selectedFlight && (
            <div>Interior {selectedFlight.id}</div>
          )}
        </div>

      </div>
    )
  );
}
