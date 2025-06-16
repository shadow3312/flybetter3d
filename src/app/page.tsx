import Home from "@/app/components/home";
import { DataService } from "@/lib/data/data-service";

export default async function HomePage() {
  const aircraftData = await DataService.getAircraft()
  const flightsData = await DataService.getFlights()
  return (
    <Home aircraft={aircraftData} flights={flightsData} />
  );
}
