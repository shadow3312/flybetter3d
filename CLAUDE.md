# CLAUDE.md

Flybetter 3d — a Next.js 15 (App Router) app for browsing aircraft and reserving seats inside an interactive Three.js cabin, ending in a downloadable PDF/PNG boarding pass.

## Commands

```bash
pnpm install
pnpm prisma:generate      # REQUIRED before dev/typecheck — see "Generated Prisma client"
pnpm dev                  # next dev (Turbopack is default in Next 16), localhost:3000
pnpm build                # runs prisma:generate then next build
pnpm start
pnpm db:seed              # tsx prisma/seed.ts — loads src/lib/data/*.json into MySQL
```

`pnpm lint` runs ESLint 9 with `eslint-config-next` (flat config in `eslint.config.mjs`); a few strict rules are downgraded to warnings for pre-existing code. There is no test suite — verify changes by running the app. `next build` prerenders `/` and needs a reachable `DATABASE_URL`; without one it still compiles and typechecks, then fails at prerender.

Toolchain pins: TypeScript is held at 6.x because `typescript-eslint` doesn't support TS 7 yet, and ESLint at 9.x because `eslint-plugin-react` (via `eslint-config-next`) doesn't support ESLint 10.

Environment (`.env`):
- `DATABASE_URL` — MySQL connection string (see `.env.example`).
- `NEXT_PUBLIC_GLB_URL` — required (listed in `.env.example`); base URL that all `.glb` models are fetched from (`${glbUrl}/assets/3d/...`). Models are *not* in `public/`; without this var every 3D model request resolves to `undefined/assets/...` and the cabin renders empty.

## Architecture

**Server → client boundary.** Pages are async server components that pull everything through `DataService` and hand plain data to a `"use client"` root:
- `src/app/page.tsx` → `components/home.tsx` → `airplane-selection.tsx` (aircraft carousel with 3D plane previews)
- `src/app/flight/[id]/page.tsx` → `components/flight-detail.tsx` → `airplane-interior.tsx` (the cabin scene)

Note the route param `[id]` is an **aircraft** id, not a flight id; the page resolves the flight itself via `getFlightByAircraft`.

**Data layer.** `src/lib/data/data-service.ts` is the only read path (Prisma queries); `src/lib/actions.ts` holds the single `"use server"` mutation (`createReservation`). Both use the shared client from `src/lib/prisma.ts` (globalThis-cached in dev); only `prisma/seed.ts` builds its own.

Seats are **not** a database table. `DataService.getSeats(aircraftId, flightId)` generates them on every call from the aircraft's `rows`/`seatsPerRow`/`aisleAfter`/`cabinWidth`/`cabinLength`, assigns classes by row (`first` = first 10% of rows, `business` = next 20%, rest `economy`), computes 3D positions, and marks a seat unavailable if a `Reservation` row exists for that `seatId` + `flightId`. Seat ids are `"12A"`-style (`${row}${column}`, columns from `"ABCDEFGHJK"`). Changing seat geometry or class split means editing this function — and keeping `airplane-interior.tsx`, which recomputes `firstClassRows`/`businessClassRows` with the same formula, in sync.

`getPassengers` derives NPC appearance/activity deterministically by hashing `seatId-flightId`, so the same flight always renders the same passengers without storing them.

**State.** Jotai, via `Providers` in the root layout. `src/state/atoms.ts`: `selectedAircraftAtom` and `selectedFlightAtom` use `atomWithStorage` (localStorage-persisted) — `flight-detail.tsx` renders the cabin only once `selectedFlight` is set, so deep-linking to `/flight/[id]` without going through the home page shows nothing.

**3D scene.** `airplane-interior.tsx` owns the `<Canvas>` and composes `CabinWalls` (`cabin.tsx`), `CabinLighting`, `SeatGrid`, and one of two mutually exclusive control rigs. `SeatGrid` renders `SeatModel` per seat plus `PassengerManager`. Models live in `src/components/models/` and load through `useGLTF` with `useGLTF.preload(...)` calls at module scope.

## 3D conventions and gotchas

- **Seat picking goes through `userData`, not React props.** `SeatModel` sets `userData={{ seatId, isAvailable, price, class }}` on its group; both control rigs raycast `scene.children` and walk `parent` upward until they find `userData.seatId`. Anything that should be clickable must carry that shape, and unavailable seats are filtered by `userData.isAvailable`.
- **Keyboard input is passed via DOM attributes.** `first-person-controls.tsx` writes `data-key-w`, `data-key-arrowup`, … onto `<body>` on keydown and both control rigs read them with `hasAttribute` inside `useFrame`. There is no React keyboard hook; movement state lives only in those body attributes.
- Only one control rig mounts at a time (`hybrid` = orbit + WASD, `firstPerson` = pointer-lock walk). First-person is the default. First-person also removes its `data-key-*` attributes on unmount; hybrid does not.
- `SeatModel` clones a single module-level cached GLTF scene (`cachedModel`) per seat and is wrapped in `memo`; `SeatGrid` and the models are memoized deliberately (commit `0e89988`). Preserve the memoization when editing — the cabin renders hundreds of seats.
- Rendering is tuned down on purpose: `shadows={false}`, `antialias: false`, `dpr={[1, 1.5]}`, `meshLambertMaterial`. `airbus_a380.glb` is flagged in-code as too heavy.
- `SeatGrid` hardcodes `seatWidth = 0.6` / `rowSpacing = 0.8` for dividers and labels, while `DataService.getSeats` derives them from cabin dimensions. These two do not agree for all aircraft.

## Generated Prisma client

`schema.prisma` outputs to `src/generated/prisma` (gitignored), so everything imports `PrismaClient` from `@/generated/prisma`, **not** `@prisma/client`. On a fresh checkout that directory does not exist and typecheck/dev will fail until `pnpm prisma:generate` runs.

Schema (MySQL): `Aircraft` 1—n `SeatClass` and 1—n `Flight`; `Reservation` is standalone with loose `seatId`/`flightId`/`passengerId` strings (no FKs, no uniqueness constraint on seat+flight — double booking is not prevented at the DB level). Seed data comes from `src/lib/data/aircraft.json`, `flights.json`, `seat-classes.json`; `SeatClass` ids are composed as `${aircraftId}-${seatClassId}`.

## UI

shadcn/ui ("new-york", neutral base, CSS variables) in `src/components/ui/` — generated code, prefer regenerating over hand-editing. Tailwind v4 via `@tailwindcss/postcss`, configured entirely in `src/app/globals.css` (no `tailwind.config.ts`). Icons: lucide-react. Toasts: `sonner` (`toast` from `sonner`, `<Toaster />` in the root layout). `@/*` maps to `./src/*`.

Ticket export: `flight-ticket.tsx` renders a DOM node with `id="flight-ticket"`, and `TicketGenerator` (`src/lib/ticket-generator.tsx`) snapshots it with `html2canvas-pro` into a jsPDF A4 page, falling back to PNG download. It uses **`html2canvas-pro`**, not `html2canvas` (which is also installed) — the pro fork is what tolerates modern CSS color functions. Avoid `oklch`/unsupported colors inside the ticket markup.

Note the README's "Project Structure" section is stale (it predates the `src/` + Prisma layout); trust the tree on disk.
