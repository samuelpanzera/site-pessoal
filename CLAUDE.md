# pdipessoal — Personal Portfolio

## Package Manager

**Bun** — always use `bun`, never npm, pnpm, or yarn.

```bash
bun install
bun run dev
bun run build
bun run lint
```

## Monorepo Structure

```
/
├── apps/
│   └── frontend/        # React 19 + Vite app
├── .agents/
│   ├── rules/           # Architecture rules (auto-applied by Claude)
│   ├── skills/          # Custom agent skills
│   └── workflows/       # Workflow definitions (speckit SDD)
└── CLAUDE.md
```

## Frontend Stack

| Tool | Version |
|---|---|
| React | 19 |
| TypeScript | Strict mode, no `any` |
| Vite | 8 |
| Tailwind CSS | 4 |
| i18next / react-i18next | Bilingual: PT-BR (default) + EN |
| Motion (Framer) | Animation library |

## Design System — Obsidian Pulse

Defined in `.agents/rules/design.md`. Key points:

- Background: `#121414` (OLED-friendly near-black)
- Primary: `#4b0082` (deep indigo/purple) — used for glows, borders, highlights
- Typography: **Space Grotesk** (headlines/labels) + **Manrope** (body)
- Elevation via luminous border glow (`box-shadow` purple, 30-60px blur, 0.2 opacity), not shadows
- Sections separated by `8rem+` vertical gaps
- Shape: `rounded-lg` for cards, `rounded` for buttons/chips

## Frontend Architecture

Defined in `.agents/rules/frontend_architecture.md`. Key rules:

- `components/` — Presentational only, receive props, no API calls
- `pages/` — Container components, orchestrate data and pass to components
- `hooks/` — All business logic and data fetching (`useSomething`)
- `services/` — External API calls and URLs (no hardcoded URLs in components)
- `utils/` — Pure functions, no React dependencies
- `types/` — Global TypeScript interfaces

## Data Fetching Pattern

Experience data lives in `apps/frontend/public/data/experiences.json` (static today, API-swappable via `useExperiences` hook). When an API is available, only `DATA_URL` in the hook needs to change.

## Available Skills

- `framer-motion-animator` — Framer Motion animations and micro-interactions
- `svg-animations` — SVG animations and illustrations
- `pen-dev-design` — Visual design generation via Pencil CLI

## Available Workflows

- `speckit` — Full Software Design Document cycle (Specify → Plan → Tasks → Implement)
