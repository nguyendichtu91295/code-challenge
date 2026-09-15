# Task

## Goal

Implement price querying, normalization, amount validation, and conversion helpers with unit tests.

## Scope

Data and pure business logic. Depends on task 001 for the React/Query provider, TypeScript and Vitest foundation. No full form or mock exchange yet.

Read `.ai/ai_workflow.md`, `.ai/coding_convention.md`, `requirement.md`, and `plans/001-currency-swap.md` before execution. Work within the current `problem2` project, preserve user changes, and use the workflow's status/execution recording rules.

## Target Files

`src/features/swap/swap.api.ts`, `swap.types.ts`, `swap.validation.ts`, `swap.utils.ts`, `hooks/useTokenPrices.ts`, colocated `*.test.ts` files and deterministic fixtures. All abbreviated paths are relative to `src/features/swap/`.

## Steps

1. Define explicit types and pure functions; follow .ai/coding_convention.md naming/state-ownership guidance adapted to swaps, not its posts-specific rules.
2. Fetch https://interview.switcheo.com/prices.json through the API module. Throw on non-OK responses or invalid top-level shape; pass the query AbortSignal to fetch and apply a finite timeout.
3. Validate each record: nonempty symbol, valid date, finite positive numeric price. Omit bad records. Deduplicate exact symbols by latest timestamp; equal dates use the last valid record. Sort consistently and retain original symbol case.
4. Implement useTokenPrices around useQuery with key ['token-prices'], five-minute stale time, one retry for transient failures only, no polling, no focus/reconnect refetch, and explicit refetch support. Surface pending, fetching, error and paused/offline states without duplicate useEffect/state storage.
5. Derive default ETH → USDC selection if present, else the first two distinct valid tokens. Expose an insufficient-data condition when fewer than two valid tokens remain.
6. Validate ordinary positive decimal amounts and normalize decimal comma. Reject empty submissions, malformed text, negatives, zero, exponent notation and numeric overflow/underflow. Preserve editable strings in the later UI.
7. Compute receive = send × sourcePrice / destinationPrice and derive rate from the same prices. Reject non-finite/unrepresentable quotes. Round only for display, using significant digits so tiny positive quotes do not display as zero.
8. Add icon URL resolution for https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/{filename}.svg with STEVMOS→stEVMOS, RATOM→rATOM, STOSMO→stOSMO, STATOM→stATOM, STLUNA→stLUNA mappings.
9. Use deterministic unit fixtures for duplicate timestamps, invalid records, empty/insufficient feeds, amounts, conversions, tiny/large values, and icon mappings. Mock fetch for API errors/timeouts; no live endpoint dependencies in tests.

## Validation

- `npm run test -- --run` — all normalization, validation, conversion and API unit cases pass; use numeric tolerances appropriate to demo estimates.
- `npm run build` — hooks, types and helpers compile.
- Inspect useTokenPrices for sole query ownership, bounded retry, signal propagation and no automatic polling. Historical timestamps must remain available for UI display.
