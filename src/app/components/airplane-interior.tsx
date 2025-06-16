"use client";

import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { SeatGrid } from "./seat-grid";
import { FirstPersonControls } from "./first-person-controls";
import { HybridControls } from "./hybrid-controls";
import { CabinWalls } from "./cabin";
import { CabinLighting } from "./cabin-lighting";
import { LightingControls } from "./lighting-controls";
import type { Aircraft, Seat, Passenger } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { lightModeAtom } from "@/state/atoms";

interface AirplaneInteriorProps {
  aircraft: Aircraft;
  seats: Seat[];
  passengers: Passenger[]
  flightId: string;
  onSeatSelect: (seat: Partial<Seat>) => void;
}

export default function AirplaneInterior({
  aircraft,
  seats,
  passengers,
  onSeatSelect,
}: AirplaneInteriorProps) {

  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);
  const [navigationMode, setNavigationMode] = useState<
    "hybrid" | "firstPerson"
  >("firstPerson");
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [lightMode, setLightMode] = useAtom(lightModeAtom);
  const [showPassengers, setShowPassengers] = useState(true);


  useEffect(() => {
    const handlePointerLockChange = () => {
      setIsPointerLocked(!!document.pointerLockElement);
    };

    document.addEventListener("pointerlockchange", handlePointerLockChange);

    return () => {
      document.removeEventListener(
        "pointerlockchange",
        handlePointerLockChange
      );
    };
  }, []);

  const handleSeatHover = (seat: Seat | null) => {
    setHoveredSeat(seat);
  };

  const toggleNavigationMode = () => {
    setNavigationMode(navigationMode === "hybrid" ? "firstPerson" : "hybrid");

    // Exit pointer lock when switching to hybrid mode
    if (
      navigationMode === "firstPerson" &&
      document.pointerLockElement &&
      document.exitPointerLock
    ) {
      document.exitPointerLock();
    }
  };

  const handleLightModeChange = (mode: "day" | "night" | "dim") => {
    setLightMode(mode);
  };

  const togglePassengers = () => {
    setShowPassengers(!showPassengers);
  };


  // Class distribution
  const firstClassRows = Math.max(1, Math.floor(aircraft.rows * 0.1));
  const businessClassRows = Math.max(2, Math.floor(aircraft.rows * 0.2));

  return (
    <div className="relative w-full h-screen bg-gray-900">
      <Canvas
        shadows={false}
        gl={{
          antialias: false,
        }}
        dpr={[1, 1.5]}
      >
        <PerspectiveCamera
          makeDefault
          position={navigationMode === "hybrid" ? [0, 5, 5] : [0, 1.6, 0]}
          fov={navigationMode === "hybrid" ? 60 : 75}
        />

        <ambientLight
          intensity={
            lightMode === "night" ? 0.3 : lightMode === "dim" ? 0.5 : 0.7
          }
        />

        <directionalLight
          position={[0, 5, 5]}
          intensity={lightMode === "night" ? 0.2 : 0.4}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <CabinWalls
          width={aircraft.cabinWidth}
          length={aircraft.cabinLength}
          height={2}
          windowRows={aircraft.windowRows}
        />

        <CabinLighting
          cabinWidth={aircraft.cabinWidth}
          cabinLength={aircraft.cabinLength}
          cabinHeight={2}
          rows={aircraft.rows}
          seatsPerRow={aircraft.seatsPerRow}
          aisleAfter={aircraft.aisleAfter}
          lightMode={lightMode}
        />

        <group name="seat-grid">
          <SeatGrid
            rows={aircraft.rows}
            seatsPerRow={aircraft.seatsPerRow}
            aisleAfter={aircraft.aisleAfter}
            seats={seats}
            passengers={passengers}
            onSeatClick={onSeatSelect}
            onSeatHover={handleSeatHover}
            firstClassRows={firstClassRows}
            businessClassRows={businessClassRows}
            showPassengers={showPassengers}
          />
        </group>

        {navigationMode === "hybrid" ? (
          <HybridControls
            enabled={navigationMode === "hybrid"}
            cabinWidth={aircraft.cabinWidth}
            cabinLength={aircraft.cabinLength}
            target={[0, 0, -aircraft.rows / 2]}
            onSeatSelect={onSeatSelect}
          />
        ) : (
          <FirstPersonControls
            enabled={navigationMode === "firstPerson"}
            cabinWidth={aircraft.cabinWidth}
            cabinLength={aircraft.cabinLength}
            onSeatSelect={onSeatSelect}
          />
        )}
      </Canvas>

      <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
        <div className="bg-black/70 backdrop-blur-sm p-4 rounded-lg border border-white/20">
          <h2 className="text-3xl font-bold text-white text-center mb-2">
            🛫 {aircraft.name} - Select Your Seat
          </h2>
        </div>
      </div>

      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          onClick={togglePassengers}
          className="bg-black/50 hover:bg-black/70"
        >
          {showPassengers ? "Hide Passengers" : "Show Passengers"}
        </Button>
        <Button
          onClick={toggleNavigationMode}
          className="bg-black/50 hover:bg-black/70"
        >
          {navigationMode === "hybrid"
            ? "Switch to First Person"
            : "Switch to Hybrid View"}
        </Button>
      </div>

      <LightingControls
        lightMode={lightMode}
        onChangeLightMode={handleLightModeChange}
      />

      <div className="absolute bottom-4 left-4">
        <div className="flex flex-col gap-2 bg-black/50 p-3 rounded-md">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
              <span className="text-white">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
              <span className="text-white">Reserved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
              <span className="text-white">Selected</span>
            </div>
          </div>
          <div className="border-t border-white/20 pt-2 mt-1">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-600 rounded-sm"></div>
                <span className="text-white">First Class</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-amber-500 rounded-sm"></div>
                <span className="text-white">Business</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-500 rounded-sm"></div>
                <span className="text-white">Economy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {navigationMode === "hybrid" ? (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 p-3 rounded-md text-white">
          <p>
            <strong>Mouse</strong> to orbit | <strong>Click</strong> on seats to
            select | <strong>WASD</strong> to move
          </p>
        </div>
      ) : (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 p-3 rounded-md text-white">
          {isPointerLocked ? (
            <p>
              <strong>Mouse</strong> to look around | <strong>↑←↓→</strong> to
              move | <strong>ESC</strong> to exit and select seats
            </p>
          ) : (
            <p>
              <strong>Click on seats</strong> to select them |{" "}
              <strong>Click empty space</strong> to enable mouse look
            </p>
          )}
        </div>
      )}

      {hoveredSeat && (
        <div className="absolute bottom-4 right-4">
          <Card className="w-[250px]">
            <CardContent className="p-4">
              <h3 className="font-bold">Seat {hoveredSeat.id}</h3>
              <div className="flex justify-between items-center mt-1">
                <span
                  className={`text-sm font-medium capitalize ${
                    hoveredSeat.class === "first"
                      ? "text-purple-600"
                      : hoveredSeat.class === "business"
                      ? "text-amber-500"
                      : "text-emerald-500"
                  }`}
                >
                  {hoveredSeat.class} Class
                </span>
                <span className="text-sm">
                  {hoveredSeat.isAvailable
                    ? `$${hoveredSeat.price}`
                    : "Reserved"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
