# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Vite)
npm run build    # Type-check + production build
npm run preview  # Preview production build
```

## Architecture

**Stack:** React 18 + TypeScript, Three.js via React Three Fiber (`@react-three/fiber`), `@react-three/drei` for helpers, `@react-three/postprocessing` for Bloom glow, Zustand for global state, Tailwind CSS for UI overlay.

**Layout pattern:** The `<Canvas>` fills the entire viewport (absolute, `z-index 0`). All UI panels (`Navbar`, `LeftPanel`, `RightPanel`, `BottomControls`) are `fixed`-positioned HTML overlays rendered outside the canvas using standard React/Tailwind. Element tooltips use `<Html>` from `@react-three/drei` so they're anchored to their 3D cube position.

**3D scene** (`src/components/Scene3D.tsx`): Sets up lighting (ambient + directional + point lights), `<Stars>` background, `<OrbitControls>` with a `CameraController` that reads `controlMode` from the Zustand store, post-processing `<Bloom>`, and maps every element to an `<ElementCube>`.

**Element positioning** (`src/data/elements.ts`): Each of the 118 elements has an `xPos` (0-indexed group column, 0–17) and `yPos` (0-indexed display row: 0–6 for periods 1–7, 8 for lanthanides, 9 for actinides). The 3D world position is `x = xPos * 1.25`, `z = yPos * 1.25`.

**ElementCube** (`src/components/ElementCube.tsx`): Renders a `BoxGeometry` mesh with a `MeshStandardMaterial` whose `emissive` color is derived from `CATEGORY_COLORS[element.category]`. `emissiveIntensity` is animated via `useFrame` on hover/select. Three `<Text>` components (atomic number, symbol, weight) are placed on the top face. A `<Html>` tooltip appears on hover.

**Global state** (`src/store/useStore.ts`): `selectedElement`, `hoveredElement`, `controlMode` (`'zoom-in' | 'zoom-out' | 'rotate' | 'orbit' | 'reset' | 'none'`), `autoRotate`, `filterCategory`.

## Design tokens (from `docs/DESIGN.md`)

- **Surface:** `#0b0e14` (base) → `#10131a` (low) → `#22262f` (highest)
- **Primary (cyan):** `#a1faff` — interactive states
- **Secondary (magenta):** `#ff59e3` — noble gases, high-energy
- **Tertiary (green):** `#c3ff96` — alkali metals, stable states
- **No solid 1px borders** — use background color shifts for separation
- **Glassmorphism:** `surface_bright` at 40% opacity + `backdrop-filter: blur(12px)` for tooltips
- **Fonts:** Space Grotesk (headers/symbols) + Inter (data/labels)
