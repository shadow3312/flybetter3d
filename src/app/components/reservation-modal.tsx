"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { Aircraft, Flight, Reservation, Seat } from "@/lib/types";
import { showReservationModalAtom } from "@/state/atoms";
import { useAtom } from "jotai";
import { toast } from "sonner";
import { createReservation } from "@/lib/actions";
import { useRouter } from "next/navigation";
import FlightTicket from "./flight-ticket";
import { TicketGenerator } from "@/lib/ticket-generator";

interface ReservationModalProps {
  seat: Partial<Seat>;
  flight: Flight;
  aircraft: Aircraft
  onCancel: () => void;
}

export default function ReservationModal({
  seat,
  flight,
  aircraft,
  onCancel,
}: ReservationModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [showTicket, setShowTicket] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  if (!seat.id) return;

  const result = await createReservation(seat.id, flight.id, name, email);

  setIsSubmitting(false);

  if (result?.success) {
    setReservation(result.reservation)
    toast("Successfully booked trip.");
    router.refresh()
    setShowTicket(true)
  } else {
    console.log(result)
    toast.error(result?.error || "Reservation failed.");
  }
};

const handleClose = () => {
    setShowTicket(false)
    setReservation(null)
    setName("")
    setEmail("")
    onCancel()
  }

  const handleDownloadTicket = async () => {
    const ticketElement = document.getElementById("flight-ticket")
    if (ticketElement && reservation) {
      try {
        await TicketGenerator.generatePDF(ticketElement, `flight-ticket-${reservation.id.slice(-6).toUpperCase()}.pdf`)
      } catch (error) {
        console.error("Error downloading ticket:", error)
        try {
          await TicketGenerator.generateImage(
            ticketElement,
            `flight-ticket-${reservation.id.slice(-6).toUpperCase()}.png`,
          )
        } catch (imageError) {
          console.error("Error downloading ticket as image:", imageError)
        }
      }
    }
  }

  const getClassBadgeColor = () => {
    switch (seat.class) {
      case "first":
        return "bg-purple-100 text-purple-800";
      case "business":
        return "bg-amber-100 text-amber-800";
      case "economy":
      default:
        return "bg-emerald-100 text-emerald-800";
    }
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className={showTicket ? "max-w-6xl  max-h-[90vh] overflow-y-auto" : "sm:max-w-[425px]"}>
        {!showTicket ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                Reserve Seat {seat.id}
                <span className={`text-xs px-2 py-1 rounded-full capitalize ${getClassBadgeColor()}`}>
                  {seat.class} Class
                </span>
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Flight:</span>
                    <span>{flight.flightNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Route:</span>
                    <span>
                      {flight.departureAirport} → {flight.arrivalAirport}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Aircraft:</span>
                    <span>{aircraft.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Seat:</span>
                    <span className="font-semibold">{seat.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Class:</span>
                    <span className="font-medium capitalize">{seat.class}</span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-2">
                    <span className="font-bold">Total Price:</span>
                    <span className="font-bold text-lg text-green-600">${seat.price}</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : "Confirm Reservation"}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-2xl text-green-600">🎉 Reservation Confirmed!</DialogTitle>
            </DialogHeader>
            <div id="flight-ticket">
              {reservation && seat && (
                <FlightTicket
                  reservation={reservation}
                  seat={seat}
                  flight={flight}
                  aircraft={aircraft}
                  passengerName={name}
                  onDownload={handleDownloadTicket}
                />
              )}
            </div>
            <DialogFooter className="flex justify-center space-x-4">
              <Button onClick={handleClose} variant="outline">
                Close
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
