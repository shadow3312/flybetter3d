"use client";

import {
  showReservationModalAtom,
  selectedFlightAtom,
} from "@/state/atoms";
import { Aircraft, Passenger, Seat } from "@/lib/types";
import { useAtom, useAtomValue } from "jotai";
import React, { useState } from "react";
import AirplaneInterior from "./airplane-interior";

type Props = {
  flightId: string;
  aircraftData: Aircraft;
  seatsData: Seat[];
  passengersData: Passenger[]
};

export default function FlightDetail({ flightId, aircraftData, seatsData, passengersData }: Props) {
  const [selectedSeat, setSelectedSeat] = useState<Partial<Seat> | null>(null);
  const [showReservationModal, setShowReservationModal] = useAtom(
    showReservationModalAtom
  );
  const selectedFlight = useAtomValue(selectedFlightAtom);

  const handleSeatSelect = (seat: Partial<Seat>) => {
    setSelectedSeat(seat);
    setShowReservationModal(true);
  };

  return (
    (
      <div className="w-full h-full">
        <div className="flex-1">
          {selectedFlight && (
            <AirplaneInterior
              aircraft={aircraftData}
              seats={seatsData}
              passengers={passengersData}
              flightId={flightId}
              onSeatSelect={handleSeatSelect}
            />
          )}
        </div>

      </div>
    )
  );
}
