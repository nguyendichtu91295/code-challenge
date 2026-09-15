# Task

## Goal

Build the mobile-first swap form and asynchronous demo exchange.

## Scope

One light, clean swap page with black accent, token selection and mutation states. Depends on task 002 for validated prices/calculations and query behavior. No real trades, wallets, balances, fees, slippage, backend, or extra pages.

Read `.ai/ai_workflow.md`, `.ai/coding_convention.md`, `requirement.md`, and `plans/001-currency-swap.md` before execution. Work within the current `problem2` project, preserve user changes, and use the workflow's status/execution recording rules.

## Target Files

`src/App.tsx`, `src/styles.css`, `src/features/swap/SwapPage.tsx`, `components/SwapForm.tsx`, `components/TokenPicker.tsx`, `components/TokenIcon.tsx`, `hooks/useSwap.ts`, `swap.api.ts`, `swap.mock.ts`, `swap.types.ts`, mock-service unit tests, necessary shared UI primitives. Abbreviated swap paths are relative to `src/features/swap/`.

## Steps

1. Show the swap form immediately, full available mobile width and about 480px maximum on desktop. Use white/gray surfaces, black accents, legible labels, 16px input text, 44px touch targets, visible focus and no overflow at 320px.
2. Consume useTokenPrices. Show initial loading, offline/paused, error/Retry and insufficient-token states. Block submission when prices are unavailable/erroring. Disable repeated Retry while fetching and preserve entered values/selections.
3. Keep amount and selected symbols in SwapForm; derive output/rate instead of copying them to state. Start empty, with read-only receive output. Show selected price dates and historical/demo context; do not claim live rates.
4. Implement a searchable, case-insensitive token picker with no-results state, current-selection indication, distinct pair enforcement, icons and symbol fallback. A broken image must not break selection.
5. Implement reverse by exchanging symbols while preserving the entered send amount. Recalculate on amount/token changes and provide inline validation after interaction.
6. Use accessible names, keyboard selection, focus trapping/return and Escape dismissal in the picker. Provide clear labels for icon-only controls and restrained status announcements.
7. Create submitSwap in swap.api.ts backed by a local asynchronous mock in swap.mock.ts with about one-second delay. Validate a typed request snapshot of symbols, send/receive amounts and rate. Return a typed demo summary based on that snapshot; no fabricated blockchain details.
8. Implement useSwap using useMutation, retry false and networkMode always for the local mock. Mutation owns status/result/error. During pending, disable amount, selection, reversal and repeat submissions; preserve the submitted snapshot.
9. On success show the submitted pair/amounts and that no assets moved. On failure show an inline error, retain values, unlock controls and permit explicit retry. Reset old results/errors on input changes.
10. Default to success for valid requests. In development only, VITE_MOCK_SWAP_MODE=fail-once makes the first valid attempt fail and the next succeed; reload resets it. Ignore the setting in production. No random failure or visible developer test controls.
11. Add mock-service unit tests using fake timers and injected deterministic scenarios: delay, snapshot consistency, invalid requests, failure once then success. Do not add browser or component automation.

## Validation

- `npm run test -- --run` — existing logic tests and new mock-service tests pass.
- `npm run build` — complete app compiles for production.
- Inspect handlers for duplicate-submission guard, snapshot preservation, single state ownership, reset behavior and development-only failure gating. Complete manual visual/interaction verification in task 005.
