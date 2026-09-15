# Task

## Goal

Initialize the Vite application and shared foundation.

## Scope

Vite, React, TypeScript, shadcn/ui, Tailwind, TanStack Query, and Vitest setup only. Existing starter is plain HTML/CSS with empty JavaScript; no app dependencies exist.

Read `.ai/ai_workflow.md`, `.ai/coding_convention.md`, `requirement.md`, and `plans/001-currency-swap.md` before execution. Work within the current `problem2` project, preserve user changes, and use the workflow's status/execution recording rules.

## Target Files

`package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig*.json`, `components.json`, `.gitignore`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/styles.css`, `src/lib/utils.ts`, required `src/components/ui/` primitives, `README.md`.

## Steps

1. Configure the app directly in `problem2` without overwriting requirements, workflow, plans, or tasks. Reuse the existing parent `code-challenge` repository; do not initialize nested Git or use worktrees.
2. Install compatible dependencies with npm and retain the lockfile. Configure TypeScript, aliases, React, Tailwind, and only necessary shadcn primitives. No global state library, browser automation, or component-test framework.
3. Provide `dev`, `build` (TypeScript check plus Vite build), `preview`, and `test` (Vitest) scripts. Configure unit tests without creating placeholder tests merely to make a command pass.
4. Create one stable QueryClient and QueryClientProvider. Form state stays local; fetched data will belong to the query cache.
5. Set the theme: white page, gray surfaces/borders, near-black text, black primary accent, 16px input text and 44px touch controls. Provide a minimal compiling app shell; final swap behavior belongs to task 003.
6. Ignore node_modules, dist, .vercel and local environment files. Document Node.js 24 LTS and local scripts. No secrets belong in VITE-prefixed settings.
7. Replace the starter entry only as needed for Vite. Remove obsolete starter script.js/style.css once the app entry no longer uses them; preserve unrelated files.

## Validation

- `npm run build` — TypeScript and production compilation pass; `dist/index.html` exists.
- `npm run dev -- --host 127.0.0.1 --port 5173 --strictPort`, then `curl -fsS -o /dev/null http://127.0.0.1:5173/` — app responds without a compile failure; stop the verification server afterward.
- `npm run test -- --help` — Vitest command is available; no-test state is expected until task 002. Inspect package scripts, provider ownership, and ignored output.
