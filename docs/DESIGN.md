```markdown
# Design System Document

## 1. Overview & Creative North Star: "The Quantum Observatory"

This design system is engineered to transform the Periodic Table from a static 2D chart into a high-fidelity, immersive laboratory environment. The Creative North Star is **"The Quantum Observatory"**—a vision where data is not just read but observed through a lens of high-tech instrumentation.

To move beyond the "standard dashboard" look, this system utilizes **Intentional Asymmetry** and **Layered Depth**. We break the rigid grid by allowing 3D element clusters to overlap secondary UI panels, creating a sense of physical space. Information is treated as a holographic projection, using high-contrast typography scales and glowing light-matter interactions to guide the eye through the atomic landscape.

---

## 2. Colors: Luminance & Lithography

The palette is rooted in the deep void of space (`surface`), allowing neon accents to function as functional "energy signatures" for element groups.

- **Primary (`#a1faff`)**: The "Action Cyan." Used for interactive states and primary navigation.
- **Secondary (`#ff59e3`)**: The "Radioactive Magenta." Used for high-energy element groups (e.g., Noble Gases) and critical data points.
- **Tertiary (`#c3ff96`)**: The "Isotope Green." Used for stable states, Alkali Metals, and growth metrics.
- **Surface Hierarchy:** 
    - Base: `surface` (#0b0e14)
    - Mid-layer: `surface_container_low` (#10131a)
    - High-layer: `surface_container_highest` (#22262f)

### The "No-Line" Rule
**Explicit Instruction:** Prohibit 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts. To separate a data widget from the background, place a `surface_container_high` module onto the `surface` background. The transition of tone is the boundary.

### The "Glass & Gradient" Rule
To achieve a "Scientific Glass" aesthetic, all floating tooltips must use `surface_bright` at 40% opacity with a `backdrop-filter: blur(12px)`. Main Action Buttons should utilize a linear gradient from `primary` to `primary_container` to simulate the glow of a fueled ion engine.

---

## 3. Typography: Technical Precision

We pair the geometric authority of **Space Grotesk** for data headers with the neutral, high-legibility of **Inter** for technical specifications.

- **Display (Space Grotesk):** Large, airy, and commanding. Used for Atomic Numbers and Element Symbols. The wide tracking in `display-lg` suggests a premium, experimental feel.
- **Headline/Title (Space Grotesk):** Used for category headers (e.g., "Lanthanides").
- **Body/Label (Inter):** Used for "Hard Data"—melting points, electron configuration, and orbital descriptions. The shift from the expressive headline font to the functional body font signals a transition from "Discovery" to "Analysis."

---

## 4. Elevation & Depth: Tonal Layering

Depth in this system is not a shadow; it is a **Light State**. 

- **The Layering Principle:** Stacking is the primary tool for hierarchy. A 3D manipulation petal should sit on `surface_container_highest`, floating over the main element viewport (`surface`).
- **Ambient Shadows:** For floating 3D tooltips, use a shadow with a 40px blur, 0px offset, and 8% opacity of the `primary` color. This creates a "glow" rather than a shadow, making the component appear self-illuminated.
- **The "Ghost Border" Fallback:** If a tactile edge is required for a focused input, use `outline_variant` at 15% opacity. Never use 100% opaque lines.
- **Glassmorphism:** All "HUD" (Heads-Up Display) elements must use `surface_variant` with a 0.6 alpha and blur. This ensures the 3D periodic table remains visible behind the UI, maintaining spatial awareness.

---

## 5. Components

### 3D Manipulation Controls (Navigation)
Sleek, circular "Orbit" controls. Use `surface_container_highest` for the track and `primary` for the active thumb. Use `full` roundedness to emphasize the planetary motion of the interface.

### Glassmorphism Tooltips
Triggered on element hover. 
- **Background:** `surface_bright` (40% opacity) + 12px blur.
- **Content:** `on_surface` for the element name, `primary` for the atomic weight.
- **Edge:** A "Ghost Border" of `primary` at 10% on the top edge only to simulate a light source from above.

### Data Visualization Widgets
For electron shell diagrams or half-life charts:
- **Stroke:** Use `tertiary` for "stable" data and `secondary` for "volatile" data.
- **Fills:** Use semi-transparent gradients (`primary` to `transparent`) for area charts to create a "holographic projection" effect.

### Buttons & Inputs
- **Primary Button:** Gradient fill (`primary` to `primary_container`). Border-radius: `sm` (0.125rem) for a sharp, technical look.
- **Ghost Input:** Background: `surface_container_low`. No border. On focus, shift background to `surface_container_high` and add a subtle `primary` outer glow.

### Cards & Lists
**Forbid the use of divider lines.** Separate element properties (Density, Boiling Point, etc.) using `3` (0.6rem) vertical whitespace and subtle background-color banding using `surface_container_low` and `surface_container`.

---

## 6. Do's and Don'ts

### Do:
- **Do** use `secondary` (Magenta) and `tertiary` (Green) sparingly as "functional glows" to categorize elements.
- **Do** lean into asymmetry. A data panel can be anchored to the far right with a 3.5rem (`16`) margin while the 3D table is centered-left.
- **Do** use `label-sm` for "micro-data"—the tiny technical details that add to the "scientific" authenticity.

### Don't:
- **Don't** use 1px solid white or grey borders. This flattens the experience and destroys the "Laboratory HUD" feel.
- **Don't** use standard "Material" shadows. If it doesn't look like it's emitting light or refracting glass, it doesn't belong.
- **Don't** use standard icons. Use thin-stroke, technical vector icons that match the `outline` token weight.