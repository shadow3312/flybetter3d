"use client"

import { useRef, useState } from "react"
import { useGLTF, Text } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { Color } from "three"
import type { Group } from "three"
import type { Seat } from "@/lib/types"
import { glbUrl } from "@/lib/utils"

interface SeatModelProps {
  seat: Seat
  position: [number, number, number]
  onClick: (seat: Seat) => void
  onPointerOver: (seat: Seat) => void
  onPointerOut: () => void
}

export function SeatModel({ seat, position, onClick, onPointerOver, onPointerOut }: SeatModelProps) {
  const group = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)

  const { scene } = useGLTF(`${glbUrl}/assets/3d/seats/airplane-seat.glb`)

  const model = scene.clone()

  const getClassColor = () => {
    switch (seat.class) {
      case "first":
        return "#8b5cf6"
      case "business":
        return "#f59e0b"
      case "economy":
      default:
        return "#10b981"
    }
  }

  const baseColor = getClassColor()
  const seatColor = hovered ? "#0ea5e9" : seat.isAvailable ? baseColor : "#ef4444"

  model.traverse((child: any) => {
    if (child.isMesh && child.material) {
      child.material = child.material.clone()

      child.material.color = new Color(seatColor)

      child.material.metalness = 0
      child.material.roughness = 1

      child.castShadow = false
      child.receiveShadow = false
    }
  })

  // Animation for hovered seats
  useFrame((state) => {
    if (hovered && group.current && seat.isAvailable) {
      // Floating animation for hovered seat
      group.current.position.y = position[1] + 0.05 + Math.sin(state.clock.elapsedTime * 4) * 0.02
    } else if (group.current) {
      // Reset position when not hovered
      group.current.position.y = position[1]
    }
  })

  const handleSeatClick = (e: any) => {
    e.stopPropagation()

    if (e.nativeEvent) {
      e.nativeEvent.preventDefault()
    }

    if (seat.isAvailable) {
      onClick(seat)
    }

    // Return false to prevent event bubbling
    return false
  }

  const getSeatBaseSize = (): [number, number, number] => {
    switch (seat.class) {
      case "first":
        return [0.5, 0.05, 0.5] // Larger for first class
      case "business":
        return [0.45, 0.05, 0.45] // Medium for business class
      case "economy":
      default:
        return [0.4, 0.05, 0.4] // Standard for economy
    }
  }

  return (
    <group
      ref={group}
      position={position}
      userData={{ seatId: seat.id, isAvailable: seat.isAvailable, price: seat.price, class: seat.class }}
      onClick={handleSeatClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        onPointerOver(seat)
        document.body.style.cursor = seat.isAvailable ? "pointer" : "not-allowed"
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        setHovered(false)
        onPointerOut()
        document.body.style.cursor = "auto"
      }}
    >
      <primitive object={model} scale={0.0008} rotation={[0, 0, 0]} position={[0, -0.1, 0.2]} />

      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={getSeatBaseSize()} />
        <meshLambertMaterial color={seatColor} />
      </mesh>

      <Text
        position={[0, 0.4, 0]}
        fontSize={0.15}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        {seat.id}
      </Text>

      <mesh position={[0, 0.01, 0.15]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.3, 0.1]} />
        <meshBasicMaterial color={baseColor} />
      </mesh>

      {seat.isAvailable && hovered && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 0.45, 16]} />
          <meshBasicMaterial color="#0ea5e9" transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  )
}

useGLTF.preload(`${glbUrl}/assets/3d/seats/airplane-seat.glb`)
