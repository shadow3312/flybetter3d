"use client"

import { useState, useEffect } from "react"

interface KeyboardState {
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
}

export function useKeyboardControls() {
  const [keys, setKeys] = useState<KeyboardState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default behavior for arrow keys to avoid page scrolling
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d", "W", "A", "S", "D"].includes(e.key)) {
        e.preventDefault()
      }

      // Update key state based on key pressed
      setKeys((prevKeys) => {
        const newKeys = { ...prevKeys }

        switch (e.key) {
          case "ArrowUp":
          case "w":
          case "W":
            newKeys.forward = true
            break
          case "ArrowDown":
          case "s":
          case "S":
            newKeys.backward = true
            break
          case "ArrowLeft":
          case "a":
          case "A":
            newKeys.left = true
            break
          case "ArrowRight":
          case "d":
          case "D":
            newKeys.right = true
            break
        }

        return newKeys
      })
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      // Update key state based on key released
      setKeys((prevKeys) => {
        const newKeys = { ...prevKeys }

        switch (e.key) {
          case "ArrowUp":
          case "w":
          case "W":
            newKeys.forward = false
            break
          case "ArrowDown":
          case "s":
          case "S":
            newKeys.backward = false
            break
          case "ArrowLeft":
          case "a":
          case "A":
            newKeys.left = false
            break
          case "ArrowRight":
          case "d":
          case "D":
            newKeys.right = false
            break
        }

        return newKeys
      })
    }

    // Add event listeners to window
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    // Clean up event listeners
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  return keys
}
