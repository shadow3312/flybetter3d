import { Aircraft, Flight } from "@/lib/types";
import { atom } from "jotai";
import { atomWithStorage } from 'jotai/utils'

const showReservationModalAtom = atom<boolean>(false);
const selectedAircraftAtom = atomWithStorage<Aircraft | null>('selected_aircraft', null);
const selectedFlightAtom = atomWithStorage<Flight | null>('selected_flight', null);
const lightModeAtom = atom<"day" | "night" | "dim">('day');

export {
    showReservationModalAtom,
    selectedAircraftAtom,
    selectedFlightAtom,
    lightModeAtom
}
