"use client"

import { useMemo } from "react"
import { PassengerModel } from "@/components/models/passenger-model"
import type { Seat, Passenger } from "@/lib/types"

interface PassengerManagerProps {
  seats: Seat[]
  passengers: Passenger[]
  rowSpacing: number
}

export function PassengerManager({ seats, passengers, rowSpacing }: PassengerManagerProps) {
  // Match passengers to seats
  const passengersBySeat = useMemo(() => {
    const map = new Map<string, Passenger>()

    // Create a map of passengers by seat ID
    passengers.forEach((passenger, index) => {
      if (index < seats.length) {
        map.set(seats[index].id, passenger)
      }
    })

    return map
  }, [seats, passengers])

  return (
    <group name="passengers">
      {seats.map((seat) => {
        const passenger = passengersBySeat.get(seat.id)
        if (!passenger) return null

        // Use the position from the seat data
        const zPosition = seat.position.z + (passenger.activity === "standing" ? 0.3 : (0.2))
        const position: [number, number, number] = [seat.position.x+0.1, 0.2, zPosition]

        const rotation: [number, number, number] = [0, Math.PI*2, 0]

        return (
          <PassengerModel
            key={`passenger-${seat.id}`}
            position={position}
            rotation={rotation}
            seatId={seat.id}
            seatClass={seat.class}
            passenger={passenger}
          />
        )
      })}
    </group>
  )
}
