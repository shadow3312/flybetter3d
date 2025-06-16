"use client";

import { useEffect, useState } from "react";

import type { Aircraft } from "@/lib/types";
import { useRouter } from "next/navigation";

interface AirplaneSelectionProps {
  aircraft: Aircraft[];
  onSelect: (aircraftId: string) => void;
}

export default function AirplaneSelection({
  aircraft,
  onSelect,
}: AirplaneSelectionProps) {
  const [hoveredAirplane, setHoveredAirplane] = useState<string | null>(null);
  const [selectedAirplane, setSelectedAirplane] = useState<Aircraft | null>(
    null
  );
  const [weather, setWeather] = useState<{
    temperature: number | null;
    wind: number | null;
    windDir: string;
    condition: string;
  }>({ temperature: null, wind: null, windDir: "", condition: "" });

  const router = useRouter();

  function degToCompass(num: number) {
    const val = Math.floor(num / 22.5 + 0.5);
    const arr = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ];
    return arr[val % 16];
  }

  function weatherCodeToText(code: number) {
    if (code === 0) return "Clear";
    if (code < 3) return "Partly Cloudy";
    if (code < 45) return "Cloudy";
    if (code < 60) return "Rain";
    if (code < 70) return "Snow";
    return "Clear";
  }

  useEffect(() => {
    // Brazzavile weather
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=-4.27&longitude=15.28&current_weather=true"
    )
      .then((res) => res.json())
      .then((data) => {
        const w = data.current_weather;
        setWeather({
          temperature: w.temperature,
          wind: w.windspeed,
          windDir: degToCompass(w.winddirection),
          condition: weatherCodeToText(w.weathercode),
        });
      });
  }, []);

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-blue-400 to-blue-600">
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
        <div className="bg-black/70 backdrop-blur-sm p-4 rounded-lg border border-white/20">
          <h2 className="text-3xl font-bold text-white text-center mb-2">
            🛫 Pick up a flight
          </h2>
          <p className="text-white/80 text-center text-sm">
            Clic on airplane to see details
          </p>
        </div>
      </div>

      {/* Weather section */}
      <div className="absolute top-6 right-6">
        <div className="bg-black/70 backdrop-blur-sm p-3 rounded-lg border border-white/20">
          <div className="text-white text-sm min-w-[120px]">
            {weather.temperature !== null ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span>🌤️</span>
                  <span>{weather.condition}</span>
                </div>
                <div>🌡️ {weather.temperature}°C</div>
                <div>
                  💨 {weather.wind} km/h {weather.windDir}
                </div>
              </>
            ) : (
              <div>Loading weather data...</div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
