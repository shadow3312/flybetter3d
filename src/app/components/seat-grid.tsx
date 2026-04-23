"use client";

import { useState, useMemo, useCallback, memo } from "react";
import { Text } from "@react-three/drei";
import type { Seat, Passenger } from "@/lib/types";
import { SeatModel } from "../../components/models/seat-model";
import { PassengerManager } from "./passenger-manager";

interface SeatGridProps {
  rows: number;
  seatsPerRow: number;
  aisleAfter: number;
  seats: Seat[];
  passengers: Passenger[];
  onSeatClick: (seat: Seat) => void;
  onSeatHover: (seat: Seat | null) => void;
  firstClassRows?: number;
  businessClassRows?: number;
  showPassengers?: boolean;
}

export const SeatGrid = memo(function SeatGrid({
  rows,
  seatsPerRow,
  seats,
  onSeatClick,
  onSeatHover,
  firstClassRows = 0,
  businessClassRows = 0,
  showPassengers = true,
  passengers,
}: SeatGridProps) {
  const [hoveredSeatId, setHoveredSeatId] = useState<string | null>(null);

  const aisleWidth = 0.5;
  const seatWidth = 0.6;
  const rowSpacing = 0.8;

  const totalWidth = useMemo(
    () => seatsPerRow * seatWidth + aisleWidth,
    [seatsPerRow],
  );

  // Memoize section dividers
  const sectionDividers = useMemo(() => {
    const dividers = [];

    if (firstClassRows > 0) {
      const zPosition = -(firstClassRows * rowSpacing);
      dividers.push(
        <mesh
          key="first-class-divider"
          position={[0, 0.5, zPosition + rowSpacing / 2]}
          rotation={[0, 0, 0]}
        >
          <boxGeometry args={[totalWidth + 0.2, 0.05, 0.05]} />
          <meshLambertMaterial color="#8b5cf6" />
        </mesh>,
      );
    }

    if (businessClassRows > 0) {
      const zPosition = -((firstClassRows + businessClassRows) * rowSpacing);
      dividers.push(
        <mesh
          key="business-class-divider"
          position={[0, 0.5, zPosition + rowSpacing / 2]}
          rotation={[0, 0, 0]}
        >
          <boxGeometry args={[totalWidth + 0.2, 0.05, 0.05]} />
          <meshLambertMaterial color="#f59e0b" />
        </mesh>,
      );
    }

    return dividers;
  }, [firstClassRows, businessClassRows, rowSpacing, totalWidth]);

  // Memoize section labels
  const sectionLabels = useMemo(() => {
    const labels = [];

    if (firstClassRows > 0) {
      const zPosition = -(firstClassRows * rowSpacing) / 2;
      labels.push(
        <Text
          key="first-class-label"
          position={[-totalWidth / 2 - 0.6, 0.7, zPosition]}
          fontSize={0.2}
          color="#8b5cf6"
          anchorX="center"
          anchorY="middle"
          rotation={[0, 0, Math.PI / 2]}
        >
          FIRST CLASS
        </Text>,
      );
    }

    if (businessClassRows > 0) {
      const zPosition =
        -(firstClassRows * rowSpacing) - (businessClassRows * rowSpacing) / 2;
      labels.push(
        <Text
          key="business-class-label"
          position={[-totalWidth / 2 - 0.6, 0.7, zPosition]}
          fontSize={0.2}
          color="#f59e0b"
          anchorX="center"
          anchorY="middle"
          rotation={[0, 0, Math.PI / 2]}
        >
          BUSINESS
        </Text>,
      );
    }

    const economyRows = rows - firstClassRows - businessClassRows;
    if (economyRows > 0) {
      const zPosition =
        -(firstClassRows * rowSpacing) -
        businessClassRows * rowSpacing -
        (economyRows * rowSpacing) / 2;
      labels.push(
        <Text
          key="economy-class-label"
          position={[-totalWidth / 2 - 0.6, 0.7, zPosition]}
          fontSize={0.2}
          color="#10b981"
          anchorX="center"
          anchorY="middle"
          rotation={[0, 0, Math.PI / 2]}
        >
          ECONOMY
        </Text>,
      );
    }

    return labels;
  }, [firstClassRows, businessClassRows, rows, rowSpacing, totalWidth]);

  // Memoize seat positions
  const seatPositions = useMemo(() => {
    return seats.map((seat) => ({
      seat,
      position: [seat.position.x, seat.position.y, seat.position.z] as [
        number,
        number,
        number,
      ],
    }));
  }, [seats]);

  // Memoize handlers
  const handleSeatClick = useCallback(
    (seat: Seat) => {
      onSeatClick(seat);
    },
    [onSeatClick],
  );

  const handleSeatHover = useCallback(
    (seat: Seat | null) => {
      onSeatHover(seat);
    },
    [onSeatHover],
  );

  const handleSeatPointerOver = useCallback(
    (seat: Seat) => {
      setHoveredSeatId(seat.id);
      onSeatHover(seat);
    },
    [onSeatHover],
  );

  const handleSeatPointerOut = useCallback(() => {
    setHoveredSeatId(null);
    onSeatHover(null);
  }, [onSeatHover]);

  // Memoize occupied seats for passengers
  const occupiedSeats = useMemo(
    () => seats.filter((seat) => !seat.isAvailable),
    [seats],
  );

  return (
    <group name="seat-grid">
      {/* Airplane floor */}
      <mesh
        position={[0, -0.1, (-rows * rowSpacing) / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[totalWidth + 1, rows * rowSpacing + 1]} />
        <meshLambertMaterial color="#94a3b8" />
      </mesh>

      {/* Aisle carpet */}
      <mesh
        position={[0, -0.09, (-rows * rowSpacing) / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[aisleWidth, rows * rowSpacing + 1]} />
        <meshLambertMaterial color="#475569" />
      </mesh>

      {sectionDividers}

      {sectionLabels}

      {/* Row numbers */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Text
          key={`row-${rowIndex + 1}`}
          position={[-totalWidth / 2 - 0.3, 0.3, -rowIndex * rowSpacing]}
          fontSize={0.2}
          color="#000000"
          anchorX="center"
          anchorY="middle"
        >
          {rowIndex + 1}
        </Text>
      ))}

      {/* Overhead compartments */}
      <mesh position={[0, 1.8, (-rows * rowSpacing) / 2]} rotation={[0, 0, 0]}>
        <boxGeometry args={[totalWidth - 0.5, 0.3, rows * rowSpacing]} />
        <meshLambertMaterial color="#cbd5e1" />
      </mesh>

      {/* Seats */}
      {seatPositions.map(({ seat, position }) => (
        <SeatModel
          key={seat.id}
          seat={seat}
          position={position}
          onClick={handleSeatClick}
          onPointerOver={handleSeatPointerOver}
          onPointerOut={handleSeatPointerOut}
        />
      ))}

      {/* Passengers */}
      {showPassengers && (
        <PassengerManager
          seats={occupiedSeats}
          passengers={passengers}
          rowSpacing={rowSpacing}
        />
      )}
    </group>
  );
});
