"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Plane,
  MapPin,
  User,
  CreditCard,
  Wifi,
  Coffee,
  Utensils,
} from "lucide-react";
import type { Aircraft, Seat, Flight, Reservation } from "@/lib/types";
import { formatDate, formatTime } from "@/lib/utils";

interface FlightTicketProps {
  reservation: Reservation;
  seat: Partial<Seat>;
  flight: Flight;
  aircraft: Aircraft;
  passengerName: string;
  onDownload: () => void;
}

export default function FlightTicket({
  reservation,
  seat,
  flight,
  aircraft,
  passengerName,
  onDownload,
}: FlightTicketProps) {
  const ticketRef = useRef<HTMLDivElement>(null);

  const getFlightDuration = () => {
    const departure = new Date(flight.departureTime);
    const arrival = new Date(flight.arrivalTime);
    const duration = arrival.getTime() - departure.getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getSeatClassColor = () => {
    switch (seat.class) {
      case "first":
        return "from-purple-600 to-purple-800";
      case "business":
        return "from-amber-500 to-amber-700";
      case "economy":
      default:
        return "from-emerald-500 to-emerald-700";
    }
  };

  const getAmenities = () => {
    switch (seat.class) {
      case "first":
        return [
          { icon: Wifi, label: "Premium WiFi" },
          { icon: Utensils, label: "Gourmet Dining" },
          { icon: Coffee, label: "Premium Bar" },
        ];
      case "business":
        return [
          { icon: Wifi, label: "WiFi" },
          { icon: Utensils, label: "Enhanced Meal" },
          { icon: Coffee, label: "Premium Drinks" },
        ];
      case "economy":
      default:
        return [
          { icon: Wifi, label: "WiFi Available" },
          { icon: Utensils, label: "Meal Service" },
          { icon: Coffee, label: "Beverages" },
        ];
    }
  };

  return (
    <div className="mx-auto p-6 bg-gray-50">
      <div
        ref={ticketRef}
        className="bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div
          className={`bg-gradient-to-r ${getSeatClassColor()} p-6 text-white relative overflow-hidden`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-3 rounded-full">
                  <Plane className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Flybetter 3D</h1>
                  <p className="text-white/80">Premium Flight Experience</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm">Booking Reference</p>
                <p className="text-xl font-mono font-bold">
                  {reservation.id.slice(-6).toUpperCase()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-white/80 text-sm mb-1">Passenger</p>
                <p className="text-xl font-semibold">{passengerName}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">Flight</p>
                <p className="text-xl font-semibold">{flight.flightNumber}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">Class</p>
                <p className="text-xl font-semibold capitalize">
                  {seat.class} Class
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Flight Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <span className="text-2xl font-bold">
                        {flight.departureAirport}
                      </span>
                    </div>
                    <p className="text-gray-600">Departure</p>
                    <p className="text-lg font-semibold">
                      {formatTime(flight.departureTime)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(flight.departureTime)}
                    </p>
                  </div>

                  <div className="flex-1 mx-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t-2 border-dashed border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <div className="bg-white px-3">
                          <Plane className="h-6 w-6 text-gray-400 rotate-90" />
                        </div>
                      </div>
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-2">
                      {getFlightDuration()}
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <span className="text-2xl font-bold">
                        {flight.arrivalAirport}
                      </span>
                    </div>
                    <p className="text-gray-600">Arrival</p>
                    <p className="text-lg font-semibold">
                      {formatTime(flight.arrivalTime)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(flight.arrivalTime)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Aircraft Info */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Plane className="h-5 w-5 mr-2" />
                  Aircraft Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">Aircraft</p>
                    <p className="font-semibold">{aircraft.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Model</p>
                    <p className="font-semibold">{aircraft.model}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Manufacturer</p>
                    <p className="font-semibold">{aircraft.manufacturer}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Total Seats</p>
                    <p className="font-semibold">{aircraft.totalSeats}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Seat Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Seat Information
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Seat Number</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {seat.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Price</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${seat.price}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Row</p>
                    <p className="font-semibold">{seat.row}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Position</p>
                    <p className="font-semibold">{seat.column}</p>
                  </div>
                </div>

                {/* Class Badge */}
                <div
                  className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${getSeatClassColor()} text-white text-sm font-semibold`}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {seat.class
                    ? seat.class.charAt(0).toUpperCase() + seat.class.slice(1)
                    : "Economy"}{" "}
                  Class
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Included Amenities
                </h3>
                <div className="space-y-3">
                  {getAmenities().map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="bg-white p-2 rounded-lg">
                        <amenity.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="font-medium">{amenity.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* QR Code Placeholder */}
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <h3 className="text-lg font-semibold mb-4">
                  Mobile Boarding Pass
                </h3>
                <div className="bg-white p-4 rounded-lg inline-block">
                  <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-gray-500 text-xs text-center">
                      <div className="grid grid-cols-8 gap-1">
                        {Array.from({ length: 64 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-1 h-1 ${
                              Math.random() > 0.5 ? "bg-black" : "bg-white"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Scan at airport for boarding
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-semibold mb-1">Check-in</p>
                <p>Online check-in opens 24 hours before departure</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Baggage</p>
                <p>Check baggage allowance for your fare type</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Contact</p>
                <p>eludeceti@gmail.com | +242 0404246667</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-x-0 top-0 flex justify-center">
            <div className="flex space-x-2">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="w-3 h-3 bg-gray-200 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Button onClick={onDownload} size="lg" className="px-8">
          Download Ticket (PDF)
        </Button>
      </div>
    </div>
  );
}
