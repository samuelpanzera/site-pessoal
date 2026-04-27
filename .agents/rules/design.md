---
trigger: always_on
---

---
name: Obsidian Pulse
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#37393a'
  surface-container-lowest: '#0c0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#cec3d3'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#978d9d'
  outline-variant: '#4c4451'
  surface-tint: '#ddb7ff'
  primary: '#ddb7ff'
  on-primary: '#4a0080'
  primary-container: '#4b0082'
  on-primary-container: '#ba7ef4'
  inverse-primary: '#7b41b3'
  secondary: '#bec6e3'
  on-secondary: '#283046'
  secondary-container: '#3e465e'
  on-secondary-container: '#adb4d1'
  tertiary: '#c9c6c5'
  on-tertiary: '#313030'
  tertiary-container: '#323131'
  on-tertiary-container: '#9b9998'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#f0dbff'
  primary-fixed-dim: '#ddb7ff'
  on-primary-fixed: '#2c0050'
  on-primary-fixed-variant: '#622599'
  secondary-fixed: '#dae2ff'
  secondary-fixed-dim: '#bec6e3'
  on-secondary-fixed: '#131b30'
  on-secondary-fixed-variant: '#3e465e'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c9c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474646'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  code:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1200px
  section-gap: 8rem
  gutter: 1.5rem
  margin-page: 2rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

## Brand & Style

The design system is engineered for a high-end Back-end Developer portfolio, prioritizing a high-tech, "void" aesthetic that emphasizes precision and logic. The brand personality is mysterious yet authoritative, evoking the feeling of a sophisticated terminal or a high-performance server environment. 

The visual style is a fusion of **Minimalism** and **Cyber-Atmospheric**. By utilizing a deep black canvas, the interface allows structural elements to emerge through light rather than mass. The core aesthetic relies on "pulsing" luminosity—subtle glow effects that suggest a living, breathing system running behind the scenes. This creates a distinctive, immersive experience that separates the developer from standard corporate layouts.

## Colors

The palette is rooted in absolute darkness to provide maximum contrast for functional highlights. 

- **Primary (#4b0082):** A deep Indigo/Purple used exclusively for structural outlines and interactive "glow" states. It represents the energy of the system.
- **Secondary (#1C243A):** A muted navy-charcoal used for subtle surface differentiation, such as card backgrounds or code blocks.
- **Background (#000000):** The primary canvas color, ensuring a "true black" OLED-friendly experience.
- **Neutral (#FFFFFF):** Used sparingly for high-readability text and icons to ensure professional clarity against the dark backdrop.

## Typography

This design system employs a dual-font strategy to balance technical rigor with modern readability. 

**Space Grotesk** is used for headlines and labels. Its geometric, slightly quirky terminals reflect a "cutting-edge tech" vibe suitable for a developer. Headlines should use tight letter spacing to appear more "engineered."

**Manrope** serves as the body typeface. It provides a clean, neutral, and highly legible experience for long-form descriptions of technical projects and experience. 

For navigation and small metadata, uppercase labels with increased letter spacing are preferred to maintain a professional, organized hierarchy.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy centered within the viewport. A 12-column system is used for content, but the visual boundaries are often defined by thin, glowing borders rather than solid blocks.

Large vertical gaps (8rem+) between sections create a sense of scale and focus, preventing the dark interface from feeling cluttered. Elements within cards or sections follow a strict "Stack" pattern, using consistent multipliers of 0.5rem to maintain a rhythmic, mathematical precision essential for a back-end professional.

## Elevation & Depth

In a deep black environment, traditional shadows are ineffective. Instead, this design system uses **Luminous Depth**:

1.  **Border Illumination:** Hierarchy is established by the intensity of the purple border. Active or hovered elements feature a brighter, 1px solid purple stroke.
2.  **Pulsing Glows:** Key containers utilize a `box-shadow` with a large blur radius (30px-60px) and low opacity (0.2) in the primary purple hue. This glow should subtly animate (pulse) on a slow 4-second loop.
3.  **Tonal Tiers:** Secondary surfaces (like code blocks or cards) use a very slight lift with the `#0A0A0A` color to distinguish them from the `#000000` background without breaking the void aesthetic.

## Shapes

The shape language is **Soft (0.25rem)**. While a technical site often leans toward sharp corners, the slight rounding provides a premium "hardware" feel, reminiscent of high-end server racks or modern electronics. 

Large-scale containers like cards should use `rounded-lg` (0.5rem), while buttons and chips remain at the base `rounded` level to keep the aesthetic crisp and professional.

## Components

- **Buttons:** Primary buttons feature a 1px purple border and a subtle internal gradient. On hover, the border glow intensifies, and a faint purple drop shadow appears behind the text.
- **Cards:** Backgrounds should be nearly transparent or `#0A0A0A`. The "Pulsing Glow" effect is applied to the border. Content within cards is left-aligned to emphasize a structured, data-driven look.
- **Chips/Tags:** Used for tech stacks (e.g., Python, AWS). These should have a `#1C243A` background with `Space Grotesk` labels in white. No borders, unless the tag is being highlighted.
- **Input Fields:** Minimalist lines. Only the bottom border is visible by default. Upon focus, the border turns purple and emits a soft glow.
- **Code Blocks:** A signature component. Use a dark navy background (#1C243A) with a thin purple left-accent bar.
- **Progress Indicators:** For skill levels, use thin horizontal bars. The "filled" portion should have a linear gradient from purple to a brighter neon violet, ending with a small glow-dot.