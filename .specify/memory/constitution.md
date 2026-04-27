<!-- 
Sync Impact Report:
- Version change: 0.0.0 -> 1.0.0
- Modified principles:
  - Added Monorepo Architecture
  - Added Frontend Stack
  - Added Backend Stack
  - Added Design-Driven Development
  - Added Interactive Experience
- Added sections: Technology Requirements & Aesthetics, Development Workflow
- Templates requiring updates: 
  - .specify/templates/plan-template.md (⚠ pending)
  - .specify/templates/spec-template.md (⚠ pending)
  - .specify/templates/tasks-template.md (⚠ pending)
- Follow-up TODOs: none
-->

# PDI Pessoal Constitution

## Core Principles

### I. Monorepo Architecture
Use an ultra-fast monorepo structure. Ensure all frontend, backend, and shared libraries are housed within a single repository for streamlined development and testing.

### II. Frontend Stack
Use Vite with React and Tailwind CSS for the frontend to achieve high performance and modern aesthetics, ensuring a 'void', cyber-atmospheric, dark theme.

### III. Backend Stack
Use Golang for the backend. Services should be extremely fast, robust, and handle API demands for the portfolio efficiently.

### IV. Design-Driven Development
Follow the design specified in `designs/desgin-pdi.pen` using the pen.dev MCP. Emphasize a 'void' aesthetic with 'pulsing' luminosity and high-tech minimalist style. No placeholders; demonstrate functionality via the provided design system.

### V. Interactive Experience
Focus on creating an impressive first page portfolio with dynamic software architecture animations in the hero section and smooth transitions between screens.

## Technology Requirements & Aesthetics

- **Frontend:** React, Vite, Tailwind CSS.
- **Backend:** Golang.
- **Design Aesthetics:** Obsidian Pulse palette (Deep black `#000000` canvas, `#4b0082` primary accents, `#1C243A` secondary surfaces). Use Space Grotesk and Manrope typography. Glow effects, minimalist lines, and premium responsive animations.

## Development Workflow

All UI development must reference the `desgin-pdi.pen` definitions for components (cards, chips, input fields). Features should be built as self-contained within the monorepo.

## Governance

All UI additions must strictly adhere to the defined color palette and typography. Backend APIs must be clearly typed and documented. Performance regressions in the Vite build or Golang services are unacceptable. All pull requests must verify compliance with this constitution.

**Version**: 1.0.0 | **Ratified**: 2026-04-27 | **Last Amended**: 2026-04-27
