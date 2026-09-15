# Currency swap form

Status: EXECUTING — tasks 001–004 DONE; task 005 RUNNING; task 006 PENDING.

## Goal

Build an intuitive currency swap demo using Vite, with a light, clean appearance, black accents, and a mobile-first layout. Prepare it for Vercel.

## Background and current behavior

- Source: `requirement.md`; workflow: `.ai/ai_workflow.md`.
- Project scope: the current `problem2` directory; `.ai/` contains workflow guidance.
- Starter: `index.html` has two inputs and a disabled submit action; `script.js` is empty; `style.css` provides basic centering.
- No app dependencies, build setup, or tests currently exist. Node.js and Vercel CLI are installed; login was verified.
- This folder belongs to the existing `code-challenge` Git repository. Reuse it; do not run `git init` inside `problem2`.
- Feed inspection: 36 records, 32 unique symbols, duplicate BUSD/USDC entries, latest timestamp `2023-08-29T07:10:52.000Z`.
- Endpoint inspection: JSON response with `Access-Control-Allow-Origin: *`. Icon repository contains matching SVGs for all 32 symbols after five explicit filename-case mappings.
- Apply the conventions' component, hook, typing, and state-ownership guidance to swaps; their posts/feed examples do not add product requirements.

## Scope

- Vite + React + TypeScript, with shadcn/ui primitives and Tailwind CSS (the recommended UI stack).
- TanStack Query (`@tanstack/react-query`) for API queries; local React state for form inputs, with no separate global state store.
- One swap screen: source token, destination token, send amount, calculated receive amount, exchange rate, reverse action, and confirmation.
- Searchable token selection with icons and a text fallback for missing images.
- Price fetching, normalization, loading, empty/error states, and explicit Retry.
- Input validation and an asynchronous mock exchange through `useMutation`, with pending, success, and error states clearly labeled as a demo.
- Responsive styling, accessible interaction, focused tests, and Git-connected Vercel deployment with documentation.

## Out of scope

- Wallet connection, real trades, backend services, balances, fees, slippage, and transaction history.
- Live-market claims, invented prices, automatic price polling, and persistent user data.
- Extra pages, marketing sections, and custom domains unless requested.
- Browser/E2E automation and a separate automated component-test suite; use focused unit tests and manual UI checks for this scope.
- Planning/task creation does not install dependencies, change application code, or deploy.

## Target files or areas

| Area | Planned files |
| --- | --- |
| Build | `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig*.json`, `.gitignore`, `components.json` |
| App entry and theme | `index.html`, `src/main.tsx`, `src/App.tsx`, `src/styles.css` |
| Swap UI | `src/features/swap/SwapPage.tsx`, `components/SwapForm.tsx`, `components/TokenPicker.tsx`, `components/TokenIcon.tsx` |
| Data and behavior | `src/features/swap/hooks/useTokenPrices.ts`, `swap.api.ts`, `swap.types.ts`, `swap.validation.ts`, `swap.utils.ts` |
| Mock exchange | `src/features/swap/hooks/useSwap.ts`, `swap.mock.ts`; request/result types in `swap.types.ts` and service entry point in `swap.api.ts` |
| Shared primitives | Required components only under `src/components/ui/`; `src/lib/utils.ts` |
| Verification and handoff | Swap unit tests, test setup, `README.md`, `docs/manual-testing.md`; `vercel.json` only if defaults are insufficient |

Paths abbreviated in the swap UI/data rows are relative to `src/features/swap/`. Once the replacement works, remove obsolete starter `script.js` and `style.css` as part of the migration.

## Implementation approach

### 1. Foundation and visual design

- Configure Vite in this directory, preserve requirements and workflow documents, and commit dependency choices to the npm lockfile during implementation.
- Use a white page, subtle gray surfaces/borders, near-black text, and black primary buttons. Reserve status colors for errors/success.
- Put the swap form in the first viewport: full available width on mobile, centered at roughly 480px maximum width on desktop.
- Use clear labels, 16px input text, generous spacing, and touch controls at least 44px tall. Avoid horizontal overflow at 320px.
- Use only necessary shadcn primitives, such as buttons and an accessible token-selection dialog. Keep the form state local; avoid global state libraries.
- Create one stable `QueryClient` and wrap the app in `QueryClientProvider`. Query cache owns fetched data; do not copy it into form state.

### 2. Price data

- Use `useQuery` inside `useTokenPrices`, with query key `['token-prices']` and a query function in `swap.api.ts` that fetches `https://interview.switcheo.com/prices.json`. Pass its abort signal to fetch and apply a finite request timeout; throw on HTTP/response errors.
- Validate the response at runtime. Omit records with empty symbols, invalid dates, or non-finite/non-positive prices.
- Deduplicate by exact symbol using the newest date; on equal dates, keep the last valid record. Preserve case for icon paths.
- Sort symbols consistently. Select ETH → USDC when available, otherwise the first two distinct valid symbols.
- Let TanStack Query own data, loading/error status, caching, and retries through `useTokenPrices`; avoid a parallel `useEffect` fetching state machine.
- Configure a five-minute stale time, one automatic retry for transient request failures, no interval polling, and no automatic focus/reconnect refetch. The explicit Retry action calls `refetch`; disable repeated clicks while fetching. Do not retry invalid response data automatically.
- Distinguish initial loading, fetching, and paused/offline states so the form cannot remain on an unexplained spinner. Preserve local amount/selections across retries.
- Block the form while loading, on failure, or when fewer than two valid tokens exist. Show a useful message and Retry; preserve user inputs on retry.
- Display the selected prices' timestamps and identify historical/sample rates. Do not label the feed as live.
- Use the supplied token-icon repository; failed images fall back to a symbol badge without breaking selection.
- Resolve images using `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/{filename}.svg`. Map `STEVMOS → stEVMOS`, `RATOM → rATOM`, `STOSMO → stOSMO`, `STATOM → stATOM`, and `STLUNA → stLUNA`; all other current symbols match filenames exactly. Preserve the original price-feed symbols.

### 3. Form behavior

- Start with an empty send amount and a neutral receive placeholder. Make receive amount read-only.
- Keep amount and selected symbols in `SwapForm`; derive the quote instead of maintaining duplicate output state.
- Compute `receive = send × sourcePrice / destinationPrice`; derive the displayed rate from the same prices.
- Accept ordinary decimal amounts, including a normalized decimal comma; reject empty submission, zero, negatives, malformed text, exponent notation, and non-finite results.
- Keep the typed value while editing. Round only for display and use significant digits so small positive quotes are not presented as zero. Reject numeric overflow/underflow rather than showing a misleading quote.
- Token search is case-insensitive, has an empty-results state, and indicates the current selection. Prevent identical source and destination tokens.
- Reverse exchanges the two tokens and preserves the entered send amount, then recalculates the quote.
- Provide inline validation after interaction, disable confirmation until valid, and announce errors/output appropriately without noisy updates.
- Confirm submits the validated quote through `useSwap`. Render the mutation's pending, success, and error states as described below; clear previous results/errors when inputs change.
- Support keyboard selection, visible focus, dialog focus trapping/return, Escape dismissal, and explicit labels for icon-only controls.

### 4. Mock exchange submission

- Add a typed asynchronous `submitSwap` service in `swap.api.ts`, backed by `swap.mock.ts`. Run locally in the browser with a roughly one-second delay; no server route or real transfer.
- Pass a snapshot of the selected symbols, send amount, receive amount, and rate into the request. Validate it at the service boundary; return a typed demo result based on that snapshot without invented fees, balances, or blockchain identifiers.
- Implement `useSwap` with TanStack Query `useMutation`. Let the mutation own pending/error/result state; do not duplicate it in local state. Disable automatic mutation retries and use `networkMode: 'always'` because this mock requires no network.
- While pending, show a progress label, disable amount/token/reverse controls, and guard against duplicate submissions. Preserve the submitted snapshot until completion.
- On success, show the submitted amount and token pair with an explicit demo/no-assets-moved message. Preserve the form values; changing them resets the old mutation result.
- On failure, show an inline error, preserve inputs, re-enable controls, and let the user explicitly retry. Clear the previous error on a new attempt.
- Default to success; never fail randomly. Provide a development-only `VITE_MOCK_SWAP_MODE=fail-once` mode: first valid submission fails, the next succeeds; reload resets the scenario. Ignore this setting in production. Unit tests inject the scenario directly.
- Document the failure mode in the manual checklist. Keep test controls out of the product UI.

### 5. Deployment setup and publishing

- Document local run/build commands and deploy the standalone `problem2` app with Vercel when execution reaches deployment.
- Connect the existing GitHub remote `https://github.com/nguyendichtu91295/code-challenge.git` to Vercel using `vercel git connect` after local validation. Use `main` as the production branch.
- Set the Vercel repository root to `src/problem2`, build to `npm run build`, and output to `dist`. Keep CLI working-directory behavior consistent with the configured repository root.
- Target team: `coding-challenge`; project name: `currency-swap`. Team access was verified through the CLI.
- Make deployment setup a separate stage: recheck `vercel whoami`, inspect whether `currency-swap` already exists in the team, link the intended project or create it if absent, and verify build/output settings. Inspect any existing project before changing its configuration.
- Verify GitHub push access and Vercel's GitHub repository authorization during setup; complete browser authorization if needed.
- Use explicit scope `coding-challenge` for project commands. Prepare the local/project link and build settings during setup; defer Git connection and pushes that can trigger a build until successful checks and manual review.
- At publishing, review and commit only the intended Problem 2 changes, connect the repository, and push to `main` without force-pushing. Handle any newer remote changes before pushing. Verify the resulting deployment matches the validated commit.
- Keep `.vercel/`, dependencies, build output, and local secrets ignored. No app secrets are expected.
- No custom routing configuration is needed for the single root page. Add configuration only if verification reveals a need.

## Dependencies and sequencing

1. Initialize the app: set up Vite, TypeScript, UI primitives, TanStack Query/provider, the base theme, unit-test tooling, and local ignore rules. Reuse the existing repository; no Git initialization task is needed.
2. Implement typed price loading, normalization, validation, and calculation helpers with unit coverage.
3. Build the responsive form and token picker; implement the mock exchange service and `useSwap` mutation, then connect pending/success/error states and add mock-service unit coverage.
4. Set up deployment: verify GitHub/Vercel access, link `coding-challenge/currency-swap`, configure root/build/output and production branch, check ignored metadata, and document commands. Depends on app initialization; defer Git connection and deployment-triggering pushes.
5. Run unit tests and the production build, complete the manual checklist below, and record results in `docs/manual-testing.md` and the eventual task execution notes.
6. Commit the validated Problem 2 changes, connect the GitHub repository with `vercel git connect`, and push to `main`. Verify automatic production deployment, repeat the hosted smoke checks, and record the final URL and deployed commit.

Keep planning, task creation, and implementation separate. Created tasks:

| Task | Dependencies |
| --- | --- |
| [001 — Initialize Vite app](../task/001-initialize-vite-app/task.md) | None |
| [002 — Price query and swap logic](../task/002-price-query-and-swap-logic/task.md) | 001 |
| [003 — Swap UI and mock exchange](../task/003-swap-ui-and-mock-exchange/task.md) | 002 |
| [004 — Vercel deployment setup](../task/004-vercel-deployment-setup/task.md) | 001 |
| [005 — Production build and manual verification](../task/005-production-build-and-manual-verification/task.md) | 003 |
| [006 — Git-connected production deployment](../task/006-git-connected-production-deployment/task.md) | 004, 005 |

Execute one task at a time under the workflow. The user installed the Vercel GitHub App and explicitly retried task 004; Git connection setup now passes. Manual verification and publishing remain.

## Validation commands and expected results

Commands below are planned; they become available after implementation.

| Check | Command / procedure | Expected result |
| --- | --- | --- |
| Unit tests | `npm run test -- --run` using Vitest | Valid/invalid amounts, small/large quotes, invalid prices, duplicate-date rules, bad feed records, and rate calculations pass using deterministic fixtures; no live-network dependency |
| Mock exchange unit tests | Same Vitest command; use fake timers and injected scenarios | Delay resolves to the submitted snapshot; invalid requests reject; controlled failure rejects once and the next valid attempt succeeds; no real network request |
| Types and production output | `npm run build` including TypeScript checking | No type/build errors; `dist/index.html` exists |
| Local production smoke check | `npm run preview -- --host 127.0.0.1 --port 4173`, then `curl -fsS -o /dev/null http://127.0.0.1:4173/` | Production page responds successfully |
| Responsive and accessibility review | Manually check 320px, 390px, 768px, and 1440px widths; keyboard-only flow and 200% zoom | No overflow/clipped controls; legible amounts; usable touch targets; visible focus and correct dialog behavior |
| Deployment setup | `vercel whoami`, `vercel project inspect currency-swap --scope coding-challenge`, and inspect the local project link | Account has team access; project and local link match `coding-challenge/currency-swap`; build/output settings are correct |
| Git-connected deployment | Inspect the Vercel Git connection and resulting deployment after pushing | Correct GitHub repository, production branch `main`, root `src/problem2`, and deployed commit; automatic deployment succeeds |
| Hosted smoke check | `curl -fsS -o /dev/null <deployment-url>` and manually complete token selection → amount → demo confirmation | Site and price/icon requests work on the hosted origin; no runtime errors |

Skip browser/E2E automation as requested. Unit tests remain automated checks of pure logic; they are distinct from the skipped browser automation. Manual review covers UI behavior and layout. Record actual results during execution; do not claim visual verification from a build alone. If no interactive browser is available, leave the manual checklist pending for the user rather than marking it passed.

### Manual test checklist

- Check 320px, 390px, 768px, and 1440px widths, plus a real phone when available: no horizontal scrolling, clipped amounts, or awkward touch controls.
- Search/select both tokens, check no-results search, prevent identical pairs, reverse the pair, and verify the rate/output updates.
- Enter valid decimals, a decimal comma, zero, negative, malformed, very small, and very large values. Check inline feedback and confirm-button state.
- Confirm a valid demo swap: verify the pending label, locked inputs/token/reverse controls, and protection against repeated clicks/Enter. Verify the success summary matches the submitted quote and shows the demo label. Change an input and confirm the old summary clears.
- Run `VITE_MOCK_SWAP_MODE=fail-once npm run dev`: submit once to see the inline exchange error and preserved inputs; retry to succeed. Verify the production preview always uses normal success mode. This scenario is separate from a price-fetch failure.
- Reload with network throttling and block the price request in browser developer tools to check loading, failure, disabled submission, and successful Retry with the input preserved.
- Block a token image request to check the symbol fallback; verify historical price dates are visible.
- Use keyboard only: Tab order, visible focus, picker search/selection, Escape, and focus return. Check readable labels and 200% zoom.
- After deployment, repeat the valid swap flow and price/icon loading checks on the hosted origin; inspect for console errors.
- Record pass/fail, browser/device, date, and unresolved issues in `docs/manual-testing.md`; explicitly mark any untested cases.

## Open questions and risks

- Deployment identifiers are resolved: `coding-challenge/currency-swap`. Whether a project with that name already exists will be checked during deployment setup.
- Mock exchange behavior is agreed: local asynchronous submission through `useMutation`; no product question remains for this flow.
- GitHub push permission and Vercel GitHub integration access are setup checks, not yet verified; authentication may require user interaction.
- React/shadcn/Tailwind remain the recommended stack recorded in the requirement; this plan adopts that recommendation.
- The supplied feed is historical. Its current CORS header permits cross-origin reads, but availability can change. Verify in the running app; show an error rather than silently substitute prices. Any proxy/backend change needs a revised scope.
- Duplicate timestamps have conflicting prices; the deterministic last-record rule is an implementation choice, not evidence that one price is more accurate.
- JavaScript number arithmetic is acceptable for displayed demo estimates, not transaction accounting; enforce finite results and document that distinction.
- Token icons are externally hosted and may be missing. Use a local text fallback.

## Planning validation

- Read the requirement, workflow, coding conventions, and all three starter source files.
- Confirmed feed shape, duplicate symbols, and historical timestamps with a read-only fetch.
- Verified the CORS header, compared every feed symbol with the icon directory, and fetched ETH, USDC, and bNEO SVGs. Confirmed uppercase `STLUNA.svg` returns 404 and its listed filename is `stLUNA.svg`.
- Checked this plan includes all workflow-required sections and preserves the agreed visual direction.
- No application code changed, dependencies installed, tests executed, or deployments performed during planning.

## Task creation validation

- 2026-09-15: passed structural checks for six task directories and all 18 required files.
- All task and execution statuses are PENDING; IDs are unique, dependencies exist without cycles, required sections and validation commands are present, and plan links resolve.
- Verified starter source files are unchanged. No task executed; no task-creation blockers.
