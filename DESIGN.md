---
version: 1.0.0
name: Kernwerk Design System
description: A warm, minimalist aesthetic for fitness analytics and content management.
colors:
  background: "#EAE6DE"
  surfaceMain: "#F9F8F4"
  surfaceSecondary: "#F2EFE9"
  surfaceDark: "#1A1A1A"
  accentPrimary: "#FACC15"
  accentSuccess: "#22C55E"
  accentDanger: "#EF4444"
  textPrimary: "#1C1917"
  textSecondary: "#78716C"
  borderSoft: "#E7E5E4"
typography:
  fontFamily: "'Inter', sans-serif"
  h1:
    size: "1.875rem"
    weight: "500"
    letterSpacing: "-0.025em"
  statValue:
    size: "3rem"
    weight: "300"
    letterSpacing: "-0.05em"
  body:
    size: "1rem"
    weight: "400"
  label:
    size: "0.875rem"
    weight: "500"
    textTransform: "uppercase"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  containerPadding: "2rem"
rounded:
  small: "8px"
  medium: "12px"
  large: "24px"
  full: "999px"
  card: "2rem"
  container: "2.5rem"
components:
  navPill:
    background: "rgba(255, 255, 255, 0.6)"
    blur: "12px"
    border: "1px solid rgba(231, 229, 228, 0.5)"
  bentoCard:
    background: "rgba(255, 255, 255, 0.6)"
    shadow: "0 10px 30px -10px rgba(0,0,0,0.02)"
    transition: "all 0.3s ease"
  darkLogCard:
    background: "#1A1A1A"
    textColor: "#D6D3D1"
  statItem:
    gap: "4px"
    valueColor: "#1C1917"
  exerciseTable:
    rowHover: "rgba(255, 255, 255, 0.5)"
    headerColor: "#A8A29E"
motion:
  hoverScale: "scale(1.05)"
  transitionSpeed: "300ms"
  transitionCurve: "cubic-bezier(0.4, 0, 0.2, 1)"
---
## Overview
Kernwerk is designed for high-performance fitness administration. It blends a "Stone" and "Sand" palette with a structured bento-grid layout, focusing on legibility, sophisticated depth, and rapid data visualization.

## Colors
The palette is grounded in warm neutrals.
- Primary Background: #EAE6DE
- Surface: #F9F8F4 (Primary container), #F2EFE9 (Secondary tiles)
- Accents: #FACC15 (Yellow-400) for active states and highlights; #1A1A1A for high-contrast sidebars.
- Semantic: Red-500 for alerts; Green-500 for operational status.

## Typography
Relies exclusively on 'Inter'. Use thin/light weights (300) for large numerical values to maintain elegance. Use medium weights (500-600) for navigation and headers. Labels should be uppercase with wide tracking for a professional utility feel.

## Spacing
A consistent 8px grid (Tailwind-based). Standard container gutters are 32px (p-8). Use generous negative space between bento blocks (gap-6) to prevent visual clutter.

## Layout
- **Container**: Max-width of 1600px with centered placement.
- **Grid System**: 12-column flex/grid system. Desktop typically splits into 3-6-3 or 4-8 distributions.
- **Z-Indexing**: Foreground elements use `z-10`. Background glows and decorative blurs use `pointer-events-none` at lower levels.

## Elevation & Depth
- **Shadows**: Large, soft shadows for the main container (`shadow-2xl`). Bento cards use subtle `0_10px_30px` offsets.
- **Glassmorphism**: Headers and navigation use `backdrop-blur-md` and `bg-white/60` to create a semi-transparent layered effect over the background decorative glows.

## Shapes
Extremely rounded corners are a signature.
- Main container: `2.5rem`
- Bento cards: `2rem`
- Interaction elements (buttons/inputs): `0.75rem` to `1rem`
- Status Pills: Fully circular (`999px`)

## Components
- **Pill Navigation**: A floating horizontal list with a high-contrast black active state.
- **Stat Blocks**: Large typography paired with Lucide icons in stone-500.
- **Bento Tiles**: Independent modules for charts (bar/circular), featured images, and quick action buttons.
- **Audit Logs**: High-contrast dark theme module with vertical scroll and color-coded activity icons.
- **Data Table**: Clean lines, no vertical borders, with integrated thumbnail previews for media content.

## Motion
- **Hover States**: Cards should subtly scale (`scale-105`) or shift background opacity.
- **Pulse**: Use for system status indicators (`animate-pulse`).
- **Transitions**: Apply a standard `300ms` duration for color and transform changes on interactive elements.

## Do's and Don'ts
- **Do**: Use high-quality Unsplash imagery with dark gradients for text overlays.
- **Do**: Keep backgrounds warm and off-white; never use pure #FFFFFF for large surfaces.
- **Don't**: Use sharp corners; the system relies on soft, pill-shaped aesthetics.
- **Don't**: Overload the screen with high-saturation colors; keep the yellow accent localized.

## Accessibility
- Use `stone-800` or darker for primary body text on light backgrounds to pass AA contrast.
- Interactive icons must have a minimum target of 40x40px.
- Navigation must be scrollable on mobile to ensure all menu items are reachable.