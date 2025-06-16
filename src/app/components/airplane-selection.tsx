"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Text,
  Plane,
  Cloud,
  Sky,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
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

  const handleAirplaneClick = (airplane: Aircraft) => {
    setSelectedAirplane(airplane);
  };

  const handleConfirmSelection = () => {
    if (selectedAirplane) {
      onSelect(selectedAirplane.id);
      router.push(`/flight/${selectedAirplane.id}`);
    }
  };

  const getAircraftPosition = (index: number): [number, number, number] => {
    const spacing = 16;
    const startX = -((aircraft.length - 1) * spacing) / 2;
    return [startX + index * spacing, 0, 0];
  };

  const getAircraftScale = (id: string) => {
    switch (id) {
      case "boeing-787":
        return 0.4;
      case "airbus-a380":
        return 0.75;
      case "boeing-737":
        return 1;
      case "airbus-a320":
        return 0.6;
      default:
        return 0.8;
    }
  };

  const getAirCraftRotation = (id: string): [number, number, number] => {
    switch (id) {
      case "boeing-787":
        return [0, -Math.PI / 9, 0];
      case "airbus-a380":
        return [0, Math.PI / 6, 0];
      case "boeing-737":
        return [0, Math.PI / 6, 0];
      case "airbus-a320":
        return [0, Math.PI / 2, 0];
      default:
        return [0, Math.PI / 6, 0];
    }
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-blue-400 to-blue-600">
      <Canvas camera={{ position: [0, 15, 25], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[50, 50, 25]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-30, 20, 10]} intensity={1} color="#ffa500" />
        <Sky
          distance={450000}
          sunPosition={[50, 50, 25]}
          inclination={0}
          azimuth={0.25}
        />
        <AnimatedClouds />
        <TarmacGround />
        <TarmacMarkings />
        <AirportBuildings />

        {aircraft.map((airplane, index) => (
          <group key={airplane.id}>
            <Suspense
              fallback={
                <Text
                  position={[
                    getAircraftPosition(index)[0],
                    getAircraftPosition(index)[1] + 3,
                    getAircraftPosition(index)[2],
                  ]}
                  fontSize={0.8}
                  color="#ffffff"
                  anchorX="center"
                  anchorY="middle"
                  outlineWidth={0.1}
                  outlineColor="#000000"
                >
                  Loading {airplane.name}
                </Text>
              }
            >
              {/* Airplane model */}
              <Text
                position={[
                  getAircraftPosition(index)[0],
                  getAircraftPosition(index)[1] + 3,
                  getAircraftPosition(index)[2],
                ]}
                fontSize={0.8}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.1}
                outlineColor="#000000"
              >
                {airplane.name}
              </Text>
            </Suspense>
          </group>
        ))}

        <OrbitControls
          enablePan={false}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI / 2.5}
          minDistance={10}
          maxDistance={50}
        />
      </Canvas>
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

function TarmacGround() {
  return (
    <Plane
      args={[200, 200]}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.1, 0]}
    >
      <meshStandardMaterial color="#2a2a2a" roughness={0.8} metalness={0.1} />
    </Plane>
  );
}

function TarmacMarkings() {
  const markings = [];

  for (let i = -50; i <= 50; i += 10) {
    markings.push(
      <Plane
        key={`line-${i}`}
        args={[1, 80]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[i, 0, 0]}
      >
        <meshStandardMaterial color="#ffff00" transparent opacity={0.8} />
      </Plane>
    );
  }

  // Parking lines
  for (let i = 0; i < 5; i++) {
    const x = -32 + i * 16;
    markings.push(
      <group key={`parking-${i}`}>
        <Plane
          args={[12, 0.5]}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[x, 0.01, -10]}
        >
          <meshStandardMaterial color="#ffffff" />
        </Plane>
        <Plane
          args={[12, 0.5]}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[x, 0.01, 10]}
        >
          <meshStandardMaterial color="#ffffff" />
        </Plane>
        <Plane
          args={[0.5, 20]}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[x - 6, 0.01, 0]}
        >
          <meshStandardMaterial color="#ffffff" />
        </Plane>
        <Plane
          args={[0.5, 20]}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[x + 6, 0.01, 0]}
        >
          <meshStandardMaterial color="#ffffff" />
        </Plane>
      </group>
    );
  }

  return <>{markings}</>;
}

function AirportBuildings() {
  return (
    <group>
      {/* Main Terminal */}
      <mesh position={[0, 8, -80]}>
        <boxGeometry args={[60, 16, 20]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>

      {/* Control tower */}
      <group position={[40, 0, -60]}>
        <mesh position={[0, 10, 0]}>
          <cylinderGeometry args={[2, 2, 20]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, 22, 0]}>
          <cylinderGeometry args={[4, 4, 4]} />
          <meshStandardMaterial color="#4a90e2" />
        </mesh>
      </group>

      <mesh position={[-50, 6, -70]}>
        <boxGeometry args={[25, 12, 30]} />
        <meshStandardMaterial color="#8a8a8a" />
      </mesh>
      <mesh position={[50, 6, -70]}>
        <boxGeometry args={[25, 12, 30]} />
        <meshStandardMaterial color="#8a8a8a" />
      </mesh>
    </group>
  );
}

function AnimatedClouds() {
  const cloudRef = useRef<Group>(null);

  useFrame((state) => {
    if (cloudRef.current) {
      cloudRef.current.position.x =
        Math.sin(state.clock.elapsedTime * 0.1) * 20;
    }
  });

  return (
    <group ref={cloudRef}>
      <Cloud position={[-30, 25, -20]} speed={0.1} opacity={0.6} />
      <Cloud position={[40, 30, -30]} speed={0.1} opacity={0.4} />
      <Cloud position={[0, 28, -50]} speed={0.1} opacity={0.5} />
    </group>
  );
}
