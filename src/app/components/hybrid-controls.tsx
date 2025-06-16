"use client"

import { useRef, useEffect } from "react"
import { useThree, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Vector3, Vector2, Raycaster } from "three"
import { Text } from "@react-three/drei"
import type { Seat } from "@/lib/types"

interface HybridControlsProps {
  enabled: boolean
  speed?: number
  cabinWidth?: number
  cabinLength?: number
  target?: [number, number, number]
  onSeatSelect?: (seat: Partial<Seat>) => void
}

export function HybridControls({
  enabled = true,
  speed = 0.1,
  cabinWidth = 3,
  cabinLength = 20,
  target = [0, 0, -10],
  onSeatSelect,
}: HybridControlsProps) {
  const { camera, scene, gl } = useThree()
  const orbitControlsRef = useRef<any>(null)
  const raycaster = useRef(new Raycaster())
  const mouse = useRef(new Vector2())

  const position = useRef(new Vector3(0, 1.6, 0))

  const debugInfo = useRef({ x: 0, z: 0, keys: "", mode: "Hybrid" })

  useFrame(() => {
    if (!enabled || !orbitControlsRef.current) return

    const keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      up: false,
      down: false,
    }

    if (document.querySelector("body")) {
      keys.forward =
        document.querySelector("body")?.hasAttribute("data-key-w") ||
        document.querySelector("body")?.hasAttribute("data-key-arrowup") ||
        false

      keys.backward =
        document.querySelector("body")?.hasAttribute("data-key-s") ||
        document.querySelector("body")?.hasAttribute("data-key-arrowdown") ||
        false

      keys.left =
        document.querySelector("body")?.hasAttribute("data-key-a") ||
        document.querySelector("body")?.hasAttribute("data-key-arrowleft") ||
        false

      keys.right =
        document.querySelector("body")?.hasAttribute("data-key-d") ||
        document.querySelector("body")?.hasAttribute("data-key-arrowright") ||
        false

      keys.up = document.querySelector("body")?.hasAttribute("data-key-e") || false

      keys.down = document.querySelector("body")?.hasAttribute("data-key-q") || false
    }

    const direction = new Vector3()

    const forward = new Vector3(0, 0, -1)
    const right = new Vector3(1, 0, 0)

    const cameraQuaternion = camera.quaternion.clone()
    forward.applyQuaternion(cameraQuaternion)
    right.applyQuaternion(cameraQuaternion)

    forward.y = 0
    right.y = 0
    
    if (forward.length() > 0) forward.normalize()
    if (right.length() > 0) right.normalize()

    if (keys.forward) direction.add(forward)
    if (keys.backward) direction.sub(forward)
    if (keys.left) direction.sub(right)
    if (keys.right) direction.add(right)

    // Vertical movement
    if (keys.up) direction.add(new Vector3(0, 1, 0))
    if (keys.down) direction.sub(new Vector3(0, 1, 0))

    // Move if there's input
    if (direction.length() > 0) {
      // Normalize and scale by speed
      direction.normalize().multiplyScalar(speed)

      // Update position
      position.current.add(direction)

      // Apply boundary constraints
      const halfWidth = cabinWidth / 2 - 0.3

      // Allow full movement along the cabin length
      position.current.x = Math.max(-halfWidth, Math.min(halfWidth, position.current.x))
      position.current.z = Math.max(-cabinLength + 0.5, Math.min(0.5, position.current.z))
      position.current.y = Math.max(0.5, Math.min(3, position.current.y))

      camera.position.copy(position.current)

      const cameraDirection = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion)
      const newTarget = camera.position.clone().add(cameraDirection.multiplyScalar(5))

      orbitControlsRef.current.target.lerp(newTarget, 0.1)
    }

    debugInfo.current = {
      x: Math.round(position.current.x * 100) / 100,
      z: Math.round(position.current.z * 100) / 100,
      keys: `${keys.forward ? "F" : ""}${keys.backward ? "B" : ""}${keys.left ? "L" : ""}${keys.right ? "R" : ""}`,
      mode: "Hybrid",
    }
  })

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()

      if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d", "q", "e"].includes(key)) {
        e.preventDefault()
        document.querySelector("body")?.setAttribute(`data-key-${key}`, "true")
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d", "q", "e"].includes(key)) {
        document.querySelector("body")?.removeAttribute(`data-key-${key}`)
      }
    }

    const handleClick = (event: MouseEvent) => {
      if (!onSeatSelect) return

      // Calculate mouse position in normalized device coordinates (-1 to +1)
      const canvas = gl.domElement
      const rect = canvas.getBoundingClientRect()

      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      // Update the raycaster with the camera and mouse position
      raycaster.current.setFromCamera(mouse.current, camera)

      // Calculate objects intersecting the picking ray
      const intersects = raycaster.current.intersectObjects(scene.children, true)

      // Find the first intersected seat
      for (let i = 0; i < intersects.length; i++) {
        // Traverse up to find parent with seat data
        const object = intersects[i].object
        let parent = object.parent

        // Keep traversing up until we find an object with seatId in userData
        while (parent && (!parent.userData || !parent.userData.seatId)) {
          parent = parent.parent
        }

        if (parent && parent.userData && parent.userData.seatId && parent.userData.isAvailable) {
          const seatId = parent.userData.seatId

          const seat = {
            id: seatId,
            row: Number.parseInt(seatId.match(/\d+/)?.[0] || "0"),
            seat: seatId.replace(/\d+/, ""),
            isAvailable: true,
            price: parent.userData.price || 200,
            class: parent.userData.class || "economy",
          }
          onSeatSelect(seat)
          return
        }
      }
    }

    // Initialize position
    position.current.copy(camera.position)

    // Add event listeners
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    gl.domElement.addEventListener("click", handleClick)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      gl.domElement.removeEventListener("click", handleClick)

      // Clean up data attributes
      const body = document.querySelector("body")
      if (body) {
        body.removeAttribute("data-key-w")
        body.removeAttribute("data-key-a")
        body.removeAttribute("data-key-s")
        body.removeAttribute("data-key-d")
        body.removeAttribute("data-key-q")
        body.removeAttribute("data-key-e")
        body.removeAttribute("data-key-arrowup")
        body.removeAttribute("data-key-arrowdown")
        body.removeAttribute("data-key-arrowleft")
        body.removeAttribute("data-key-arrowright")
      }
    }
  }, [enabled, camera, gl, scene, onSeatSelect])

  return (
    <>
      <OrbitControls
        ref={orbitControlsRef}
        target={target}
        maxPolarAngle={Math.PI / 2}
        minDistance={1}
        maxDistance={30}
        enabled={enabled}
      />

      {enabled && (
        <group position={[0, 0.5, -1]} renderOrder={1000}>
          <Text
            position={[0, 0, 0]}
            fontSize={0.1}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {`Pos: (${debugInfo.current.x}, ${debugInfo.current.z}) Mode: ${debugInfo.current.mode} Keys: ${debugInfo.current.keys}`}
          </Text>
        </group>
      )}
    </>
  )
}
