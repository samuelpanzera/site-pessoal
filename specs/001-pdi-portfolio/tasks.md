# Tasks: PDI Portfolio First Page

**Input**: Design documents from `/specs/001-pdi-portfolio/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize root monorepo with `bun init -y` and configure Workspaces in `package.json`
- [x] T002 [P] Install Turborepo (`bun add turbo --dev --ignore-workspace-root-check`) and create `turbo.json` with `dev` and `build` pipelines
- [x] T003 Initialize Golang backend project with `go mod init` in `apps/backend/`
- [x] T004 Initialize Vite React TypeScript project with `bun x create-vite apps/frontend --template react-ts`
- [x] T005 [P] Configure Tailwind CSS with "Obsidian Pulse" theme in `apps/frontend/tailwind.config.js` and `apps/frontend/src/styles/index.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Setup Go `net/http` basic server routing in `apps/backend/cmd/server/main.go`
- [x] T007 [P] Configure CORS middleware in `apps/backend/internal/api/middleware.go`
- [x] T008 Create base data structures (Project, ExecutionLogEntry, Skill) in `apps/backend/internal/models/models.go`
- [x] T009 Configure main layout and root container in `apps/frontend/src/App.tsx`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Descoberta Inicial (Hero & Animação) (Priority: P1) 🎯 MVP

**Goal**: O usuário acessa o site e é recebido por uma interface escura (Void) com luminosidade pulsante, apresentando o desenvolvedor e uma animação arquitetural.

**Independent Test**: Carregar a página raiz e verificar a renderização estática do Hero com a animação ativa sem bloqueios.

### Implementation for User Story 1

- [x] T010 [P] [US1] Create Navigation component structure in `apps/frontend/src/components/Navigation.tsx`
- [x] T011 [P] [US1] Create Hero component structure in `apps/frontend/src/components/Hero.tsx`
- [x] T012 [US1] Implement architecture animation logic (`arch-generator.js` equivalent) inside `apps/frontend/src/components/Hero.tsx`
- [x] T013 [US1] Assemble Navigation and Hero inside `apps/frontend/src/App.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Exploração Técnica (Tech Stack & Projetos) (Priority: P2)

**Goal**: O usuário pode visualizar as habilidades técnicas do desenvolvedor e o grid de projetos executados.

**Independent Test**: Verificar se os projetos são carregados da API backend e renderizados com efeitos de Luminous Depth no hover.

### Implementation for User Story 2

- [x] T014 [P] [US2] Implement `GET /api/projects` endpoint returning mocked models in `apps/backend/internal/api/projects.go`
- [x] T015 [P] [US2] Create TechStack component UI with progress bars in `apps/frontend/src/components/TechStack.tsx`
- [x] T016 [P] [US2] Create Projects grid component in `apps/frontend/src/components/Projects.tsx`
- [x] T017 [US2] Integrate Projects component with backend `GET /api/projects` fetch logic in `apps/frontend/src/components/Projects.tsx`
- [x] T018 [US2] Mount TechStack and Projects components inside `apps/frontend/src/App.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Acompanhamento de Execução (Execution Log) (Priority: P3)

**Goal**: O usuário rola até o Execution Log para ler a linha do tempo de atualizações.

**Independent Test**: Timeline deve carregar do backend e ser disposta verticalmente de maneira responsiva.

### Implementation for User Story 3

- [x] T019 [P] [US3] Implement `GET /api/logs` endpoint returning mocked entries in `apps/backend/internal/api/logs.go`
- [x] T020 [P] [US3] Create ExecutionLog component UI in `apps/frontend/src/components/ExecutionLog.tsx`
- [x] T021 [US3] Integrate ExecutionLog component with backend `GET /api/logs` fetch logic in `apps/frontend/src/components/ExecutionLog.tsx`
- [x] T022 [US3] Mount ExecutionLog component inside `apps/frontend/src/App.tsx`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: User Story 4 - Acesso ao PDI Restrito (Priority: P4)

**Goal**: Usuário clica no botão PDI (com cadeado) e aciona o fluxo de login simulado (Mock Google Login).

**Independent Test**: O clique no botão CTA do PDI ou na Navbar deve renderizar a tela/modal de "Loading" simulada antes do acesso.

### Implementation for User Story 4

- [x] T023 [P] [US4] Create PDISection component with CTA button in `apps/frontend/src/components/PDISection.tsx`
- [x] T024 [P] [US4] Create mock Google Authentication flow state/modal in `apps/frontend/src/components/MockAuth.tsx`
- [x] T025 [US4] Link CTA buttons in `Navigation.tsx` and `PDISection.tsx` to trigger `MockAuth.tsx` state.
- [x] T026 [P] [US4] Create Footer component UI in `apps/frontend/src/components/Footer.tsx`
- [x] T027 [US4] Mount PDISection, MockAuth (hidden by default), and Footer in `apps/frontend/src/App.tsx`

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T028 [P] Apply global "Luminous Depth" and glowing hover effects (box-shadow classes) across all cards/buttons in `apps/frontend/src/styles/index.css`
- [x] T029 [P] Add linear gradient `divider` components between main sections in `apps/frontend/src/App.tsx`
- [x] T030 Run Lighthouse performance audit and optimize Vite build (e.g. tree shaking, lazy loading if necessary)
- [x] T031 Ensure mobile responsiveness (stacking columns < 768px) across all created components
