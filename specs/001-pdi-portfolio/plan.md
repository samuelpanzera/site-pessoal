# Implementation Plan: PDI Portfolio First Page

**Branch**: `master` | **Date**: 2026-04-27 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-pdi-portfolio/spec.md`

## Summary

Construir a página inicial do portfólio "DEV_VOID" de um Desenvolvedor Back-end ("Samuel") usando uma arquitetura ultra-rápida de Monorepo com Vite/React no frontend e Golang no backend, baseando-se estritamente no design do Pencil (`desgin-pdi.pen`).

## Technical Context

**Language/Version**: Bun (Runtime/Package Manager), TypeScript, Go 1.26 (Backend)  
**Primary Dependencies**: React 18, Vite, Tailwind CSS, Go standard library, **Turborepo** (Orchestration)  
**Storage**: N/A for Phase 1 (Data will be mocked/static in Go memory or JSON)  
**Testing**: Vitest/React Testing Library (Frontend), Go testing package (Backend)  
**Target Platform**: Web Browser (Client), VPS Docker/Reverse Proxy (Server)  
**Project Type**: Web Application (Monorepo)  
**Performance Goals**: FCP < 1.5s, Lighthouse 90+  
**Constraints**: Hero animation must be non-blocking and visually match "Void" theme.  
**Scale/Scope**: Single developer portfolio page, high performance.  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Monorepo Architecture**: Frontend, backend, and shared libraries will be in a single repository.
- [x] **Frontend Stack**: Vite + React + Tailwind CSS chosen.
- [x] **Backend Stack**: Golang chosen.
- [x] **Design-Driven Development**: Implementation closely maps to `desgin-pdi.pen`.
- [x] **Interactive Experience**: Hero animation and hover states are planned.

*Status: Pass*

## Project Structure

### Documentation (this feature)

```text
specs/001-pdi-portfolio/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
├── turbo.json           # Configuração do Turborepo
├── package.json         # Root package.json (Workspaces)
├── apps/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── TechStack.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── ExecutionLog.tsx
│   │   │   ├── PDISection.tsx
│   │   │   └── Footer.tsx
│   │   ├── hooks/
│   │   ├── styles/
│   │   │   └── index.css
│   │   └── App.tsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
└── backend/
    ├── cmd/
    │   └── server/
    │       └── main.go
    ├── internal/
    │   ├── api/
    │   ├── models/
    │   └── storage/
    ├── go.mod
    └── go.sum
```

**Structure Decision**: Monorepo architecture containing two main applications under the `apps/` directory: a Vite frontend (`apps/frontend`) and a Golang backend (`apps/backend`).
