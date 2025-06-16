export interface Aircraft {
  id: string
  name: string
  model: string
  manufacturer: string
  totalSeats: number
  rows: number
  seatsPerRow: number
  aisleAfter: number
  cabinWidth: number
  cabinLength: number
  windowRows: number
  imageUrl?: string
}

export interface SeatClass {
  id: string
  name: string
  displayName: string
  basePrice: number
  legRoom: number
  recline: number
  width: number
  color: string
}

export interface Seat {
  id: string
  aircraftId: string
  classId: string
  row: number
  column: string
  position: {
    x: number
    y: number
    z: number
  }
  isAvailable: boolean
  price: number
  class: string
}

export interface Passenger {
  id: string
  name: string
  gender: "male" | "female" | "other"
  activity: "reading" | "sleeping" | "standing" | "sitting"
  appearance: {
    hairColor: string
    skinTone: string
    clothingColor: string
  }
}

export interface Reservation {
  id: string
  seatId: string
  passengerId: string
  flightId: string
  status: string
  timestamp: Date
}

export interface Flight {
  id: string
  aircraftId: string
  flightNumber: string
  departureAirport: string
  arrivalAirport: string
  departureTime: Date
  arrivalTime: Date
  status: string
}

export interface SeatSelection {
  seatId: string
  aircraftId: string
  flightId: string
}
