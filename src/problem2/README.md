# Currency Swap

Mobile-first currency swap demo built with Vite, React, TypeScript, shadcn/ui, Tailwind CSS and TanStack Query.

## Development

Requires Node.js 24 LTS and npm. Run from `src/problem2`:

```sh
npm ci
npm run dev
```

## Checks

```sh
npm run test -- --run
npm run build
npm run preview
```

The build checks TypeScript and outputs static files to `dist/`. Unit tests use Vitest; browser/E2E automation is excluded.

## Deployment target

Vercel team `coding-challenge`, project `currency-swap`; GitHub repository `nguyendichtu91295/code-challenge`, production branch `main`. Repository root: `src/problem2`; build: `npm run build`; output: `dist`.

Local environment files and `.vercel/` metadata are ignored. `VITE_` settings are public browser configuration, never secrets.

## Demo exchange

Prices come from the supplied Switcheo endpoint and currently date from August 2023. Duplicate symbols are normalized by newest timestamp, with the last valid record winning equal timestamps. Quotes are numeric estimates, not transaction accounting.

The exchange runs locally through a TanStack Query mutation with a one-second delay; no assets move. To manually exercise failure/retry during development:

```sh
VITE_MOCK_SWAP_MODE=fail-once npm run dev
```

The first valid submission fails; retry succeeds. Reload resets the scenario. Production ignores this flag and uses normal success behavior.

## Deployment setup status

- Created and linked `coding-challenge/currency-swap`.
- Verified Vite, Node.js `24.x`, root `src/problem2`, install `npm ci`, build `npm run build`, and output `dist`.
- GitHub API confirms push/admin access to `nguyendichtu91295/code-challenge`.
- Connected the GitHub repository and configured `main` as the production branch.
- Manual results are recorded in `docs/manual-testing.md`.

The configured root is relative to the Git repository; do not append `src/problem2` a second time when choosing a CLI directory.
