"use client";

import { JSX } from "react";

import * as THREE from "three";
import { useAtomValue } from "jotai";
import { lightModeAtom } from "@/state/atoms";

interface CabinWallsProps {
  width: number;
  length: number;
  height: number;
  windowRows?: number;
}

interface CabinDetailsProps {
  width: number;
  length: number;
  height: number;
}

function CabinDetails({ width, length, height }: CabinDetailsProps) {
  const halfWidth = width / 2;

  const emergencyExits: JSX.Element[] = [];
  const exitPositions = [
    { x: -halfWidth * 0.99, z: -length * 0.3, side: "left" },
    { x: halfWidth * 0.99, z: -length * 0.3, side: "right" },
    { x: -halfWidth * 0.99, z: -length * 0.7, side: "left" },
    { x: halfWidth * 0.99, z: -length * 0.7, side: "right" },
  ];

  exitPositions.forEach((pos, index) => {
    const rotation: [number, number, number] =
      pos.side === "left" ? [0, Math.PI / 2, 0] : [0, -Math.PI / 2, 0];

    emergencyExits.push(
      <group key={`exit-${index}`} position={[pos.x, height * 0.5, pos.z]}>
        {/* EXIT Panel */}
        <mesh rotation={rotation}>
          <planeGeometry args={[1, 0.3]} />
          <meshBasicMaterial color="#ff4444" />
        </mesh>
        <pointLight
          position={[pos.side === "left" ? -0.1 : 0.1, 0, 0]}
          intensity={0.3}
          color="#ff4444"
          distance={2}
        />
      </group>
    );
  });

  return <>{emergencyExits}</>;
}

export function CabinWalls({
  width,
  length,
  height,
  windowRows = 8,
}: CabinWallsProps) {
  const lightMode = useAtomValue(lightModeAtom);
  const halfWidth = width / 2;
  const halfLength = length / 2;

  const createCurvedCeiling = () => {
    const ceilingGeometry = new THREE.CylinderGeometry(
      halfWidth * 1.1,
      halfWidth * 0.9,
      length,
      16,
      1,
      false,
      0,
      Math.PI
    );

    return (
      <mesh
        position={[0, height, -halfLength]}
        rotation={[0, -Math.PI / 2, Math.PI / 2]}
        geometry={ceilingGeometry}
      >
        <meshLambertMaterial color="#f8fafc" side={THREE.DoubleSide} />
      </mesh>
    );
  };
  
  const createFloorLEDs = () => {
    if (lightMode === "day") return null;
    const leds = [];
    const ledSpacing = 2.5;
    const ledCount = Math.floor(length / ledSpacing);
    for (let i = 0; i <= ledCount; i++) {
      const z = -i * ledSpacing;
      // Left
      leds.push(
    //   <mesh key={`led-left-${i}`} position={[-0.28, 0.012, z]}>
    //     <sphereGeometry args={[0.015, 8, 8]} />
    //     <meshStandardMaterial emissive="#00eaff" emissiveIntensity={3} color="#00eaff" />
    //   </mesh>
    <pointLight
          key={`led-left-${i}`}
          position={[-0.28, 0.01, z]}
          color="#00eaff"
          intensity={0.5}
          distance={0.5}
          decay={2}
        />
    )
    // Right
    leds.push(
    //   <mesh key={`led-right-${i}`} position={[0.28, 0.012, z]}>
    //     <sphereGeometry args={[0.015, 8, 8]} />
    //     <meshStandardMaterial emissive="#00eaff" emissiveIntensity={3} color="#00eaff" />
    //   </mesh>
    <pointLight
          key={`led-right-${i}`}
          position={[0.28, 0.01, z]}
          color="#00eaff"
          intensity={0.5}
          distance={0.5}
          decay={2}
        />
    )
    }
    return leds;
  };

  const createWindows = (side: "left" | "right") => {
    const windows = [];
    const actualWindowRows = Math.min(windowRows, Math.ceil(length / 3));
    const windowSpacing = length / (actualWindowRows + 1);
    const windowWidth = 0.6;
    const windowRadius = 0.4;
    const windowY = height * windowWidth;

    for (let i = 1; i <= actualWindowRows; i++) {
      const windowZ = -i * windowSpacing;
      const xPos = side === "left" ? -halfWidth : halfWidth;
      const rotation: [number, number, number] =
        side === "left" ? [0, Math.PI / 2, 0] : [0, -Math.PI / 2, 0];

      // Window cadre
      windows.push(
        <mesh
          key={`${side}-frame-${i}`}
          position={[xPos * 0.98, windowY, windowZ]}
          rotation={rotation}
        >
          <circleGeometry args={[windowWidth / 2, 16]} />
          <meshBasicMaterial color="#48dbfb" transparent opacity={0.7} />
        </mesh>
      );
    }

    return windows;
  };

  return (
    <group>
      {/* Lateral walls */}
      <mesh
        position={[-halfWidth, height / 2, -halfLength]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <planeGeometry args={[length, height]} />
        <meshLambertMaterial color="#f1f5f9" side={THREE.DoubleSide} />
      </mesh>

      <mesh
        position={[halfWidth, height / 2, -halfLength]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <planeGeometry args={[length, height]} />
        <meshLambertMaterial color="#f1f5f9" side={THREE.DoubleSide} />
      </mesh>

      {createCurvedCeiling()}

      {/* Front wall */}
      <mesh position={[0, height / 2, 0]}>
        <planeGeometry args={[width, height]} />
        <meshLambertMaterial color="#e2e8f0" side={THREE.DoubleSide} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, height / 2, -length]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[width, height]} />
        <meshLambertMaterial color="#e2e8f0" side={THREE.DoubleSide} />
      </mesh>

      {/* Ground */}
      <mesh position={[0, 0, -halfLength]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, length]} />
        <meshLambertMaterial color="#94a3b8" />
      </mesh>

      {/* Carpet */}
      <mesh position={[0, 0.002, -halfLength]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.6, length]} />
        <meshLambertMaterial color="#475569" />
      </mesh>

      {/* Lines on carpet */}
      <mesh
        position={[-0.25, 0.003, -halfLength]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[0.02, length]} />
        <meshBasicMaterial color="#1e293b" />
      </mesh>
      <mesh
        position={[0.25, 0.003, -halfLength]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[0.02, length]} />
        <meshBasicMaterial color="#1e293b" />
      </mesh>

      {createFloorLEDs()}

      {createWindows("left")}
      {createWindows("right")}

      <CabinDetails width={width} length={length} height={height} />
    </group>
  );
}