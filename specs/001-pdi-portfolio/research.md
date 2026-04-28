# Phase 0: Outline & Research

## Monorepo Tooling (Turborepo)
- **Decision:** Utilizar **Turborepo** para orquestração das aplicações (`apps/frontend` e `apps/backend`).
- **Rationale:** O Turborepo facilita a execução de comandos paralelos (ex: `dev`, `build`) e otimiza o fluxo de trabalho em monorepos, mesmo misturando ecossistemas (Node/Go), através do seu sistema de pipeline e cache.

## Vite + React + Tailwind CSS Configuration
- **Decision:** Use standard Vite template for React-TS. Tailwind will be configured with the "Obsidian Pulse" palette (`#000000`, `#4B0082`, `#1C243A`) derived from the constitution.
- **Rationale:** Meets the constitution's "Frontend Stack" requirement. Ensures fast HMR and optimized build times.

## Hero Architecture Animation
- **Decision:** The `arch-generator.js` logic will be loaded in the Hero component using React refs and optimized hooks to ensure it doesn't block the main thread.
- **Rationale:** Adheres to SC-001 (Performance) and the Interactive Experience principle.

## Backend Go Routing
- **Decision:** Use Go 1.22+ standard `net/http` enhanced routing capabilities.
- **Rationale:** Meets the "Backend Stack" requirement for an ultra-fast backend. No need for heavyweight external routers.

## Runtime & Package Manager (Bun)
- **Decision:** Utilizar **Bun** como runtime principal e gerenciador de pacotes para todo o ecossistema frontend e orquestração.
- **Rationale:** O Bun é significativamente mais rápido que o NPM/Node para instalação de pacotes e execução de scripts, alinhando-se ao objetivo de "ultra-performance" do projeto.
