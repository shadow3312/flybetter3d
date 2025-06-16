"use client";

import type { Aircraft, Flight, Seat } from "@/lib/types";
import { useAtom } from "jotai";
import { selectedAircraftAtom, selectedFlightAtom } from "@/state/atoms";
import AirplaneSelection from "./airplane-selection";

type HomeProps = {
  aircraft: Aircraft[];
  flights: Flight[];
};
export default function Home({ aircraft, flights }: HomeProps) {
  const [selectedAircraft, setSelectedAircraft] = useAtom(selectedAircraftAtom);
  const [selectedFlight, setSelectedFlight] = useAtom(selectedFlightAtom);

  const handleAircraftSelect = async (aircraftId: string) => {
    const selected = aircraft.find((a) => a.id === aircraftId);
    if (!selected) return;

    setSelectedAircraft(selected);

    const aircraftFlights = flights.filter((f) => f.aircraftId === aircraftId);

    if (aircraftFlights.length > 0) {
      setSelectedFlight(aircraftFlights[0]);
    }
  };

  return <AirplaneSelection aircraft={aircraft} onSelect={handleAircraftSelect} />

}
