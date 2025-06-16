import FlightDetail from "@/app/components/flight-detail";
import { DataService } from "@/lib/data/data-service";
import React from "react";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function FlightPage(props: Props) {
  const params = await props.params;
  const id = params.id;

  const aircraftData = await DataService.getAircraftById(id);
  const flight = await DataService.getFlightByAircraft(id);
  if (!aircraftData || !flight) return;
  const seatsData = await DataService.getSeats(id, flight.id);
  const passengersData = await DataService.getPassengers(id, flight.id);


  return (
    <FlightDetail
      aircraftData={aircraftData}
      seatsData={seatsData}
      passengersData={passengersData}
      flightId={flight.id}
    />
  );
}
