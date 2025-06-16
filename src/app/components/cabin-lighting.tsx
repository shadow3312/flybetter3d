"use client"

import { useRef } from "react"
import { useHelper } from "@react-three/drei"
import { SpotLightHelper } from "three"

interface CabinLightingProps {
  cabinWidth: number
  cabinLength: number
  cabinHeight: number
  rows: number
  seatsPerRow: number
  aisleAfter: number
  debug?: boolean
  lightMode?: "day" | "night" | "dim"
}

export function CabinLighting({
  cabinWidth,
  cabinLength,
  cabinHeight,
  rows,
  debug = false,
  lightMode = "day",
}: CabinLightingProps) {
  const mainLightRef = useRef<any>(null)

  const ceilingHeight = cabinHeight - 0.1
  const rowSpacing = cabinLength / rows

  const getLightSettings = () => {
    switch (lightMode) {
      case "night":
        return {
          ambient: 0.2,
          mainColor: "#2a3b4c",
          mainIntensity: 0.5,
          pointColor: "#4b6584",
          pointIntensity: 0.3,
          windowColor: "#0c2461",
          windowIntensity: 0.2,
        }
      case "dim":
        return {
          ambient: 0.3,
          mainColor: "#fed330",
          mainIntensity: 0.7,
          pointColor: "#f7b731",
          pointIntensity: 0.5,
          windowColor: "#3c6382",
          windowIntensity: 0.3,
        }
      case "day":
      default:
        return {
          ambient: 0.5,
          mainColor: "#ffffff",
          mainIntensity: 0.8,
          pointColor: "#f5f6fa",
          pointIntensity: 0.6,
          windowColor: "#48dbfb",
          windowIntensity: 0.7,
        }
    }
  }

  const lightSettings = getLightSettings()

  useHelper(debug && mainLightRef, SpotLightHelper, "white")

  const generateOverheadLights = () => {
    const lights = []
    const lightRows = Math.ceil(rows / 4)

    for (let i = 0; i < lightRows; i++) {
      const zPos = -(i * 4 * rowSpacing + 2 * rowSpacing)

      lights.push(
        <directionalLight
          key={`aisle-light-${i}`}
          position={[0, ceilingHeight, zPos]}
          intensity={lightSettings.pointIntensity * 1.2}
          color={lightSettings.pointColor}
          castShadow={false}
        />,
      )
    }

    return lights
  }

  const generateWindowLights = () => {
    const lights = []
    const windowRows = Math.ceil(rows / 6)
    const windowHeight = cabinHeight * 0.6

    for (let i = 0; i < windowRows; i++) {
      const zPos = -(i * 6 * rowSpacing + 3 * rowSpacing)

      lights.push(
        <pointLight
          key={`window-light-${i}`}
          position={[-cabinWidth / 2 + 0.05, windowHeight, zPos]}
          intensity={lightSettings.windowIntensity}
          color={lightSettings.windowColor}
          distance={3}
          decay={2}
          castShadow={false}
        />,
      )
    }

    return lights
  }

  return (
    <group name="cabin-lighting">
      <ambientLight intensity={lightSettings.ambient * 1.5} />

      <directionalLight
        ref={mainLightRef}
        position={[0, cabinHeight + 1, -cabinLength / 2]}
        intensity={lightSettings.mainIntensity}
        color={lightSettings.mainColor}
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-bias={-0.0005}
      />

      {generateOverheadLights()}

      {generateWindowLights()}
    </group>
  )
}
