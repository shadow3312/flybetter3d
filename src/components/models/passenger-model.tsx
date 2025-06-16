"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, useGLTF } from "@react-three/drei";
import type { Group } from "three";
import type { Passenger } from "@/lib/types";
import { glbUrl } from "@/lib/utils";

interface PassengerNPCProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  seatId: string;
  seatClass: string;
  passenger: Passenger;
}

const passengerModels = {
  standing: [`${glbUrl}/assets/3d/passengers/man2.glb`],
  sitting: [`${glbUrl}/assets/3d/passengers/man.glb`],
};
export function PassengerModel({
  position,
  rotation = [0, 0, 0],
  seatId,
  seatClass,
  passenger,
}: PassengerNPCProps) {
  const group = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const modelUrl = useMemo(() => {
    const activity = passenger.activity === "standing" ? "standing" : "sitting";
    const models = passengerModels[activity];
    const idx =
      Math.abs(
        passenger.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
      ) % models.length;
    return models[idx];
  }, [passenger]);

  const { scene } = useGLTF(modelUrl);

  const model = scene.clone();

  const animationParams = (() => {
    switch (passenger.activity) {
      case "sleeping":
        return { headTilt: -0.4, lookFrequency: 0.1, lookAmount: 0.05 };
      case "reading":
        return { headTilt: -0.2, lookFrequency: 0.3, lookAmount: 0.1 };
      default:
        return { headTilt: 0, lookFrequency: 0.7, lookAmount: 0.3 };
    }
  })();

  // Handle animations
  useFrame((state) => {
    if (!group.current) return;

    const { lookFrequency, lookAmount, headTilt } = animationParams;

    let headRotationY = 0;

    // Add looking around behavior
    if (passenger.activity !== "sleeping") {
      headRotationY =
        Math.sin(state.clock.elapsedTime * lookFrequency) * lookAmount;

      // body movement
      group.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.2) * 0.01;
    } else {
      // Sleeping animation
      group.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.01;
    }
  });

  const getPassengerScale = () => {
    switch (seatClass) {
      case "first":
        return 1.1;
      case "business":
        return 1.05;
      case "economy":
      default:
        return 1.0;
    }
  };

  const getActivityDescription = () => {
    switch (passenger.activity) {
      case "sleeping":
        return "Sleeping";
      case "reading":
        return "Reading";
      case "sitting":
        return "Sitting";
      case "standing":
        return "Standing";
      default:
        return "Sitting";
    }
  };

  const scale = getPassengerScale();

  return (
    <group
      ref={group}
      position={position}
      rotation={rotation}
      name={`passenger-${seatId}`}
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      onClick={() => setShowInfo(!showInfo)}
    >
      <primitive
        object={model}
        scale={0.5}
        rotation={[0, 0, 0]}
        position={[0, 0.1, 0]}
      />

      {showInfo && (
        <group position={[0, 0.9 * scale, 0]}>
          <Text
            position={[0, 0, 0]}
            fontSize={0.08}
            color="black"
            anchorX="center"
            anchorY="middle"
            maxWidth={1}
          >
            {`${passenger.name}\n${getActivityDescription()}`}
          </Text>
        </group>
      )}
    </group>
  );
}

useGLTF.preload(`${glbUrl}/assets/3d/passengers/man2.glb`);
useGLTF.preload(`${glbUrl}/assets/3d/passengers/man.glb`);
