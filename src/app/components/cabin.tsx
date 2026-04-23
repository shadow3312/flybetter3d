"use client";

import { JSX, useMemo } from "react";

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

  const emergencyExits = useMemo(() => {
    const exits: JSX.Element[] = [];
    const exitPositions = [
      { x: -halfWidth * 0.99, z: -length * 0.3, side: "left" },
      { x: halfWidth * 0.99, z: -length * 0.3, side: "right" },
      { x: -halfWidth * 0.99, z: -length * 0.7, side: "left" },
      { x: halfWidth * 0.99, z: -length * 0.7, side: "right" },
    ];

    exitPositions.forEach((pos, index) => {
      const rotation: [number, number, number] =
        pos.side === "left" ? [0, Math.PI / 2, 0] : [0, -Math.PI / 2, 0];

      exits.push(
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
        </group>,
      );
    });

    return exits;
  }, [width, length, height, halfWidth]);

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

  // Memoize curved ceiling geometry
  const curvedCeiling = useMemo(() => {
    const ceilingGeometry = new THREE.CylinderGeometry(
      halfWidth * 1.1,
      halfWidth * 0.9,
      length,
      16,
      1,
      false,
      0,
      Math.PI,
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
  }, [halfWidth, halfLength, length, height]);

  // Memoize floor LEDs
  const floorLEDs = useMemo(() => {
    if (lightMode === "day") return null;
    const leds = [];
    const ledSpacing = 2.5;
    const ledCount = Math.floor(length / ledSpacing);
    for (let i = 0; i <= ledCount; i++) {
      const z = -i * ledSpacing;
      leds.push(
        <pointLight
          key={`led-left-${i}`}
          position={[-0.28, 0.01, z]}
          color="#00eaff"
          intensity={0.5}
          distance={0.5}
          decay={2}
        />,
      );
      leds.push(
        <pointLight
          key={`led-right-${i}`}
          position={[0.28, 0.01, z]}
          color="#00eaff"
          intensity={0.5}
          distance={0.5}
          decay={2}
        />,
      );
    }
    return leds;
  }, [lightMode, length]);

  // Memoize windows
  const windows = useMemo(() => {
    const leftWindows: JSX.Element[] = [];
    const rightWindows: JSX.Element[] = [];
    const actualWindowRows = Math.min(windowRows, Math.ceil(length / 3));
    const windowSpacing = length / (actualWindowRows + 1);
    const windowWidth = 0.6;
    const windowY = height * windowWidth;

    for (let i = 1; i <= actualWindowRows; i++) {
      const windowZ = -i * windowSpacing;

      // Left windows
      leftWindows.push(
        <mesh
          key={`left-frame-${i}`}
          position={[-halfWidth * 0.98, windowY, windowZ]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <planeGeometry args={[0.6, 0.4]} />
          <meshLambertMaterial color="#1e293b" />
        </mesh>,
      );
      leftWindows.push(
        <mesh
          key={`left-glass-${i}`}
          position={[-halfWidth * 0.99, windowY, windowZ]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <planeGeometry args={[0.5, 0.3]} />
          <meshStandardMaterial
            color="#87ceeb"
            transparent
            opacity={0.3}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>,
      );

      // Right windows
      rightWindows.push(
        <mesh
          key={`right-frame-${i}`}
          position={[halfWidth * 0.98, windowY, windowZ]}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <planeGeometry args={[0.6, 0.4]} />
          <meshLambertMaterial color="#1e293b" />
        </mesh>,
      );
      rightWindows.push(
        <mesh
          key={`right-glass-${i}`}
          position={[halfWidth * 0.99, windowY, windowZ]}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <planeGeometry args={[0.5, 0.3]} />
          <meshStandardMaterial
            color="#87ceeb"
            transparent
            opacity={0.3}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>,
      );
    }

    return { left: leftWindows, right: rightWindows };
  }, [halfWidth, length, height, windowRows]);

  // Memoize static walls
  const staticWalls = useMemo(
    () => (
      <>
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
        <mesh
          position={[0, 0.002, -halfLength]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
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
      </>
    ),
    [width, length, height, halfLength],
  );

  // Memoize lateral walls
  const lateralWalls = useMemo(
    () => (
      <>
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
      </>
    ),
    [halfWidth, halfLength, length, height],
  );

  return (
    <group name="cabin-walls">
      {lateralWalls}
      {curvedCeiling}
      {staticWalls}
      {floorLEDs}
      {windows.left}
      {windows.right}
      <CabinDetails width={width} length={length} height={height} />
    </group>
  );
}
