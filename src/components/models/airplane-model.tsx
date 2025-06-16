"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import type { Group } from "three";
import { glbUrl } from "@/lib/utils";

interface AirplaneProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string;
  id: string;
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
}


const airplaneModels: Record<string, string> = {
  "airbus-a380": `${glbUrl}/assets/3d/planes/airbus_a380.glb`, //TODO: optimize, too heavy
  "boeing-737": `${glbUrl}/assets/3d/planes/boeing_747.glb`,
  "boeing-787": `${glbUrl}/assets/3d/planes/boeing_777.glb`,
  default: `${glbUrl}/assets/3d/planes/airplane.glb`,
};

export function Airplane({
  position,
  rotation,
  scale,
  color,
  id,
  onClick,
  onPointerOver,
  onPointerOut,
}: AirplaneProps) {
  const groupRef = useRef<Group>(null);
  const modelPath = airplaneModels[id] || airplaneModels["default"];
  const { scene } = useGLTF(modelPath);
  const model = scene.clone();

  useFrame(() => {
    if (groupRef.current) {
      // Floating animation
      groupRef.current.position.y =
        position[1] + Math.sin(Date.now() * 0.001) * 0.1;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <primitive
        object={model}
        scale={scale}
        rotation={[0, 0, 0]}
        position={[0, -0.1, 0.2]}
      />
    </group>
  );
}

useGLTF.preload(`${glbUrl}/assets/3d/planes/airbus_a380.glb`);
useGLTF.preload(`${glbUrl}/assets/3d/planes/boeing_747.glb`);
useGLTF.preload(`${glbUrl}/assets/3d/planes/boeing_777.glb`);
useGLTF.preload(`${glbUrl}/assets/3d/planes/airplane.glb`);
