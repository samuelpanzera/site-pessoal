---
description: "Full SDD Cycle — runs speckit-specify → speckit-plan → speckit-tasks → speckit-implement with review gates between each phase. Use /speckit to start a complete feature from natural language description."
---

# Spec Kit — Full SDD Cycle

This workflow orchestrates the complete Software Design Document (SDD) cycle using the Spec Kit skills.
It guides you from a raw feature description through specification, planning, task breakdown, and finally implementation — pausing at each gate for your review and approval.

---

## Inputs

| Input | Type | Required | Description |
|---|---|---|---|
| `spec` | string | ✅ | A natural language description of the feature you want to build |
| `scope` | string | ❌ | Implementation scope: `full` (default), `backend-only`, `frontend-only` |

---

## Step 1 — Specify

**Invoke skill**: `speckit-specify`

Read the skill file at `.agents/skills/speckit-specify/SKILL.md` and follow its instructions completely, passing the user's feature description (`spec` input) as the `$ARGUMENTS`.

This step will:
- Auto-generate a short feature name and create the `specs/<NNN>-<short-name>/` directory
- Copy the spec template and fill it with concrete requirements derived from the description
- Run the specification quality checklist and resolve any `[NEEDS CLARIFICATION]` markers
- Persist the resolved feature path in `.specify/feature.json`

**Upon completion**, report:
- The `SPECIFY_FEATURE_DIRECTORY` path
- The `SPEC_FILE` path (`spec.md`)
- A summary of the checklist results

---

## 🚧 Review Gate — Spec

> **STOP and ask the user before proceeding.**
>
> Present the following prompt:
>
> ```
> ✅ Specification complete: <SPEC_FILE>
>
> Please review the spec at the path above before we proceed to planning.
>
> → Type APPROVE to continue to the planning phase.
> → Type REJECT to abort the workflow.
> → Type EDIT to modify the spec manually first, then re-run /speckit-specify.
> ```
>
> - **APPROVE** → Continue to Step 2.
> - **REJECT** → Abort. Do not proceed further.
> - **EDIT** → Wait for the user to finish their edits, then ask again.

---

## Step 2 — Plan

**Invoke skill**: `speckit-plan`

Read the skill file at `.agents/skills/speckit-plan/SKILL.md` and follow its instructions completely.

This step will:
- Load `spec.md` and the project constitution from `.specify/memory/constitution.md`
- Fill the `plan.md` template with the technical context
- Run Phase 0 (Research) to resolve all unknowns → generate `research.md`
- Run Phase 1 (Design & Contracts) → generate `data-model.md`, files under `contracts/`, and `quickstart.md`
- Update the `AGENTS.md` agent context pointer to the new `plan.md`

**Upon completion**, report:
- The `plan.md` path
- All generated artifact paths (`research.md`, `data-model.md`, `contracts/`, `quickstart.md`)

---

## 🚧 Review Gate — Plan

> **STOP and ask the user before proceeding.**
>
> Present the following prompt:
>
> ```
> ✅ Plan complete: <IMPL_PLAN path>
>
> Please review the implementation plan and generated design artifacts before task generation.
>
> → Type APPROVE to continue to task generation.
> → Type REJECT to abort the workflow.
> → Type EDIT to adjust the plan manually, then resume with /speckit-tasks.
> ```
>
> - **APPROVE** → Continue to Step 3.
> - **REJECT** → Abort. Do not proceed further.
> - **EDIT** → Wait for the user to finish their edits, then ask again.

---

## Step 3 — Tasks

**Invoke skill**: `speckit-tasks`

Read the skill file at `.agents/skills/speckit-tasks/SKILL.md` and follow its instructions completely.

This step will:
- Load `plan.md` (tech stack, architecture, file structure) and `spec.md` (user stories with priorities)
- Optionally load `data-model.md`, `contracts/`, `research.md`, and `quickstart.md` if they exist
- Generate a fully dependency-ordered `tasks.md` organized by user story phase
- Each task must follow the strict checklist format: `- [ ] T### [P] [US#] Description with file path`

**Upon completion**, report:
- The `tasks.md` path
- Total task count and breakdown per user story
- Identified parallel execution opportunities
- Suggested MVP scope

---

## Step 4 — Implement

**Invoke skill**: `speckit-implement`

Read the skill file at `.agents/skills/speckit-implement/SKILL.md` and follow its instructions completely.

This step will:
- Verify all checklists in `checklists/` are complete before proceeding (pause for confirmation if not)
- Load `tasks.md`, `plan.md`, and all available design documents
- Execute tasks phase by phase, respecting sequential and parallel `[P]` rules
- Mark each completed task as `[X]` in `tasks.md`
- Validate final implementation against the original spec

**Upon completion**, report:
- Total tasks completed
- Any tasks that were skipped or failed (with reasons)
- Verification that the feature matches the original `spec.md` requirements
- Suggested next steps (e.g., run tests, open a PR)

---

## Notes

- Each skill reads its own pre/post extension hooks from `.specify/extensions.yml` automatically.
- If a `before_specify` hook is registered (e.g., `speckit-git-feature`), it will create/switch to a feature git branch before the spec is written.
- If an `after_implement` hook is registered (e.g., `speckit-git-commit`), it will auto-commit changes after implementation.
- At any review gate, typing `REJECT` aborts the entire workflow. Individual skills can be re-run independently later using their `/speckit-<name>` slash commands.
- If `scope` is `backend-only` or `frontend-only`, pass that context as additional guidance when invoking `speckit-specify` and `speckit-plan` so they can focus the spec and plan accordingly.
