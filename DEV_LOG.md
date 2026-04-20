# DEV LOG

## How to use this file

- Read this file first before making any code changes.
- Update this file after each completed feature.
- Keep entries short and practical.

## Project snapshot

- Stack: Expo Router + React Native + TypeScript.
- Visual theme: dark navy background with orange accent for active actions.
- Main dependencies used for UI: expo-image, @expo/vector-icons, react-native-safe-area-context.

## Implemented flow

1. Home screen done in app/(tabs)/index.tsx.
2. Details screen done in app/details.tsx.
3. Ticket seat selection done in app/(tabs)/explore.tsx.
4. Dedicated seat selection screen done in app/select-seats.tsx.
5. Checkout screen done in app/checkout.tsx.
6. Post-payment ticket screen done in app/ticket.tsx.
7. Profile booked tickets tab done in app/(tabs)/profile.tsx.

## Routing map

- Home to Details: router.push("/details") from hero button and movie cards.
- Details to Select Seats: router.push("/select-seats") from Choose Seats button.
- Select Seats to Checkout: router.push("/checkout") from Continue button.
- Tickets tab to Checkout: router.push("/checkout") from Confirm Seats button.
- Checkout to Ticket: router.push("/ticket") from Pay Now button.
- Ticket to Profile: router.push("/(tabs)/profile") from View In Profile button.

## Navigator config

- Root stack in app/\_layout.tsx includes:
  - (tabs)
  - details
  - select-seats
  - checkout
  - ticket
  - modal
- All custom screens use headerShown: false.

## UI conventions

- Primary action color: #F97316.
- Base background: #090B13.
- Card background: #111827.
- Border color: #1F2937.
- Text hierarchy:
  - Main text: #F8FAFC
  - Secondary text: #94A3B8

## Notes and limitations

- Figma links were not directly readable through tooling because of WebGL gate.
- Current UI is a close recreation and not guaranteed pixel-perfect.

## Update template

### yyyy-mm-dd

- Changes:
  - Added profile tab screen to display booked tickets and linked ticket screen CTA.
- Files touched:
  - app/(tabs)/profile.tsx
  - app/(tabs)/\_layout.tsx
  - app/ticket.tsx
- Follow-up:
  - Optional: sync profile ticket list with real booking data source.
