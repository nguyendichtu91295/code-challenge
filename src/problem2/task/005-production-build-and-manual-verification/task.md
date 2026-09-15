# Task

## Goal

Verify the complete app and local production output before publishing.

## Scope

Unit tests, production build, manual UI/function checks and documentation. Depends on task 003 for a complete form and mock exchange; can be completed independently of Vercel access. Browser/E2E automation is explicitly skipped.

Read `.ai/ai_workflow.md`, `.ai/coding_convention.md`, `requirement.md`, and `plans/001-currency-swap.md` before execution. Work within the current `problem2` project, preserve user changes, and use the workflow's status/execution recording rules.

## Target Files

`docs/manual-testing.md`, `README.md`, affected app/test files only for defects found during verification; this task's `execution.md`.

## Steps

1. Run the existing unit suite and build. Fix demonstrated defects, then rerun affected checks. Do not broaden features or introduce browser/component automation.
2. Serve production output and manually check widths 320px, 390px, 768px and 1440px; include a real phone if available. Check no horizontal overflow, clear amounts, usable touch controls and 200% zoom.
3. Manually check token search/selection, empty search results, distinct-pair enforcement, reversal, decimal comma, valid/invalid/very small/very large amounts, calculated receive amount and confirm-button state.
4. Check pending label, disabled edits/reversal and repeated click/Enter protection. Confirm the summary matches the submitted snapshot and is visibly a demo; changing an input must clear old results.
5. Run development with VITE_MOCK_SWAP_MODE=fail-once: first valid submission fails, values remain, controls unlock, retry succeeds and reload resets the scenario. Restart normal development to confirm ordinary success.
6. Verify production ignores the mock failure setting, including a build with VITE_MOCK_SWAP_MODE=fail-once. Restore a normal final build afterward; verify that exact output before publishing.
7. Use browser developer tools to throttle/block the price request: loading, offline/error message, disabled confirmation and successful explicit Retry with inputs preserved. Block an image to check symbol fallback. Check historical dates are visible.
8. Check keyboard-only navigation, visible focus, picker focus trapping/return, Escape and accessible labels. Inspect console/network errors.
9. Document each case with actual pass/fail/untested status, browser/device/date, expected/observed result and any limitations. If interactive review cannot be performed, leave it untested and do not mark the required verification complete.
10. Complete README setup/build/mock-mode instructions and explain historical prices, demo behavior and lack of real transfers.

## Validation

- `npm run test -- --run` — all focused unit tests pass.
- `npm run build` — normal production bundle passes type checking and build.
- `npm run preview -- --host 127.0.0.1 --port 4173 --strictPort`, then `curl -fsS -o /dev/null http://127.0.0.1:4173/` — generated output responds.
- `VITE_MOCK_SWAP_MODE=fail-once npm run dev` — manually verify controlled failure then success.
- `VITE_MOCK_SWAP_MODE=fail-once npm run build` and production preview — valid first submission succeeds, proving dev-only gating; rebuild normally afterward.
- `docs/manual-testing.md` records all required manual results. A successful build or HTTP response alone does not prove visual or interaction correctness.
