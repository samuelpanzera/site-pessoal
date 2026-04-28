# Quickstart

1. **Install Dependencies:**
   - Frontend: `cd apps/frontend && bun install`
   - Backend: Ensure Go 1.22+ is installed. `cd apps/backend && go mod tidy`

2. **Run Development Servers:**
   - Root (Orchestrated by Turbo + Bun): `bun dev`
   - Individually:
     - Frontend: `cd apps/frontend && bun dev`
     - Backend: `cd apps/backend && go run cmd/server/main.go`

3. **Access:**
   - The Vite frontend will be available at `http://localhost:5173`.
   - The Go API will be running at `http://localhost:8080`.
