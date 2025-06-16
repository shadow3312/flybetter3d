"use client"

import { useRef, useEffect, useState } from "react"
import { useThree, useFrame } from "@react-three/fiber"
import { Vector3, Vector2, Euler, MathUtils, Raycaster } from "three"
import { Text } from "@react-three/drei"
import type { Seat } from "@/lib/types"

interface FirstPersonControlsProps {
  enabled: boolean
  speed?: number
  cabinWidth?: number
  cabinLength?: number
  onSeatSelect?: (seat: Partial<Seat>) => void
}

export function FirstPersonControls({
  enabled = true,
  speed = 0.1,
  cabinWidth = 3,
  cabinLength = 20,
  onSeatSelect,
}: FirstPersonControlsProps) {
  const { camera, scene, gl } = useThree()
  const [isInitialized, setIsInitialized] = useState(false)
  const raycaster = useRef(new Raycaster())
  const mouse = useRef(new Vector2())

  const position = useRef(new Vector3(0, 1.6, 0))
  const rotation = useRef(new Euler(0, 0, 0, "YXZ"))
  const prevMousePos = useRef({ x: 0, y: 0 })

  const mouseSensitivity = useRef(0.002)

  const debugInfo = useRef({ x: 0, z: 0, keys: "", rot: "" })

  useEffect(() => {
    if (enabled && !isInitialized) {
      position.current.set(0, 1.6, 0)
      rotation.current.set(0, 0, 0)
      camera.position.copy(position.current)
      camera.rotation.copy(rotation.current)
      setIsInitialized(true)
    }
  }, [enabled, camera, isInitialized])

  useFrame(() => {
    if (!enabled) return

    const keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
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
    }

    const direction = new Vector3()

    // Get forward and side vectors from camera rotation
    const frontVector = new Vector3(0, 0, -1).applyEuler(rotation.current)
    const sideVector = new Vector3(1, 0, 0).applyEuler(rotation.current)

    // Remove vertical component for movement (keep movement on xz plane)
    frontVector.y = 0
    sideVector.y = 0

    // Normalize vectors if they have length
    if (frontVector.length() > 0) frontVector.normalize()
    if (sideVector.length() > 0) sideVector.normalize()

    // Calculate movement
    if (keys.forward) direction.add(frontVector)
    if (keys.backward) direction.sub(frontVector)
    if (keys.left) direction.sub(sideVector)
    if (keys.right) direction.add(sideVector)

    // Normalize direction if moving and apply speed
    if (direction.length() > 0) {
      direction.normalize().multiplyScalar(speed)

      // Update position
      position.current.add(direction)

      // Apply boundary constraints
      const halfWidth = cabinWidth / 2 - 0.3

      // Allow full movement along the cabin length
      position.current.x = Math.max(-halfWidth, Math.min(halfWidth, position.current.x))
      position.current.z = Math.max(-cabinLength + 0.5, Math.min(0.5, position.current.z))

      camera.position.copy(position.current)
    }

    camera.rotation.copy(rotation.current)

    debugInfo.current = {
      x: Math.round(position.current.x * 100) / 100,
      z: Math.round(position.current.z * 100) / 100,
      keys: `${keys.forward ? "F" : ""}${keys.backward ? "B" : ""}${keys.left ? "L" : ""}${keys.right ? "R" : ""}`,
      rot: `${Math.round((rotation.current.y * 180) / Math.PI)}°`,
    }
  })

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      
      const key = e.key?.toLowerCase()
      if (["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
        e.preventDefault()
        document.querySelector("body")?.setAttribute(`data-key-${key}`, "true")
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key?.toLowerCase()
      if (["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
        document.querySelector("body")?.removeAttribute(`data-key-${key}`)
      }
    }

    const canvas = document.querySelector("canvas")

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.movementX || e.clientX - prevMousePos.current.x
      const deltaY = e.movementY || e.clientY - prevMousePos.current.y

      prevMousePos.current = { x: e.clientX, y: e.clientY }

      rotation.current.y -= deltaX * mouseSensitivity.current
      rotation.current.x -= deltaY * mouseSensitivity.current

      // Allow full 360-degree horizontal rotation
      rotation.current.x = MathUtils.clamp(rotation.current.x, -Math.PI / 2 + 0.1, Math.PI / 2 - 0.1)
    }

    const isSeatClick = (event: MouseEvent): boolean => {
      if (!onSeatSelect) return false

      const canvas = gl.domElement
      const rect = canvas.getBoundingClientRect()

      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.current.setFromCamera(mouse.current, camera)

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
          return true
        }
      }
      return false
    }

    const handleCanvasClick = (e: MouseEvent) => {
      const clickedOnSeat = isSeatClick(e)

      if (!clickedOnSeat && canvas && canvas.requestPointerLock) {
        canvas.requestPointerLock()
      }
    }

    const handlePointerLockChange = () => {
      if (document.pointerLockElement === canvas) {
        document.addEventListener("mousemove", handleMouseMove, false)
      } else {
        document.removeEventListener("mousemove", handleMouseMove, false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    document.addEventListener("pointerlockchange", handlePointerLockChange, false)

    if (canvas) {
      canvas.addEventListener("click", handleCanvasClick)
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      document.removeEventListener("pointerlockchange", handlePointerLockChange)
      document.removeEventListener("mousemove", handleMouseMove)

      if (canvas) {
        canvas.removeEventListener("click", handleCanvasClick)
      }

      if (document.pointerLockElement === canvas && document.exitPointerLock) {
        document.exitPointerLock()
      }

      // Clean up data attributes
      const body = document.querySelector("body")
      if (body) {
        body.removeAttribute("data-key-w")
        body.removeAttribute("data-key-a")
        body.removeAttribute("data-key-s")
        body.removeAttribute("data-key-d")
        body.removeAttribute("data-key-arrowup")
        body.removeAttribute("data-key-arrowdown")
        body.removeAttribute("data-key-arrowleft")
        body.removeAttribute("data-key-arrowright")
      }
    }
  }, [enabled, camera, gl, scene, onSeatSelect])

  return enabled ? (
    <group position={[0, 0.5, -1]} renderOrder={1000}>
      <Text
        position={[0, 0, 0]}
        fontSize={0.1}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {`Pos: (${debugInfo.current.x}, ${debugInfo.current.z}) Rot: ${debugInfo.current.rot} Keys: ${debugInfo.current.keys}`}
      </Text>
    </group>
  ) : null
}
