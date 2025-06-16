"use client"

import { Button } from "@/components/ui/button"
import { Sun, Moon, Sunset } from "lucide-react"

interface LightingControlsProps {
  lightMode: "day" | "night" | "dim"
  onChangeLightMode: (mode: "day" | "night" | "dim") => void
}

export function LightingControls({ lightMode, onChangeLightMode }: LightingControlsProps) {
  return (
    <div className="absolute top-16 right-4 bg-black/50 p-2 rounded-md">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={lightMode === "day" ? "default" : "outline"}
          className={lightMode === "day" ? "bg-blue-600" : "bg-black/30 text-white border-white/30"}
          onClick={() => onChangeLightMode("day")}
        >
          <Sun className="h-4 w-4 mr-1" />
          Day
        </Button>
        <Button
          size="sm"
          variant={lightMode === "dim" ? "default" : "outline"}
          className={lightMode === "dim" ? "bg-amber-600" : "bg-black/30 text-white border-white/30"}
          onClick={() => onChangeLightMode("dim")}
        >
          <Sunset className="h-4 w-4 mr-1" />
          Dim
        </Button>
        <Button
          size="sm"
          variant={lightMode === "night" ? "default" : "outline"}
          className={lightMode === "night" ? "bg-indigo-600" : "bg-black/30 text-white border-white/30"}
          onClick={() => onChangeLightMode("night")}
        >
          <Moon className="h-4 w-4 mr-1" />
          Night
        </Button>
      </div>
    </div>
  )
}
