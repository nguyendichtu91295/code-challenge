# Task

## Goal

Restrict the send-amount field to numeric decimal input while allowing leading-decimal values such as `.12`.

## Scope

Implement the input-character rule defined in `requirement.md` and `plans/002-numeric-only-amount-input.md`. Block invalid typing and paste before local amount state changes. Preserve the existing decimal-comma normalization, positive finite validation, quote behavior, UI design, and mock exchange flow. Do not deploy or add browser automation.

Read `.ai/ai_workflow.md`, `.ai/coding_convention.md`, `requirement.md`, and `plans/002-numeric-only-amount-input.md` before execution. Work only inside the current `problem2` project and follow the workflow status and execution-record rules.

## Target Files

- `src/features/swap/swap.validation.ts`
- `src/features/swap/swap.test.ts`
- `src/features/swap/components/SwapForm.tsx`
- `docs/manual-testing.md`
- This task's `execution.md`

## Steps

1. Add a pure predicate that accepts empty input, digits, and at most one decimal point or comma. It must allow `.`, `.12`, `12.`, `,`, `,12`, and `12,` as editing states.
2. Reject letters, whitespace, signs, exponent notation, symbols, mixed `.`/`,` input, and repeated separators.
3. Gate the amount `onChange` through a named handler. Valid candidates update state and reset the previous mutation result; invalid candidates preserve both.
4. Keep the input as text with `inputMode="decimal"`; keep `validateAmount` responsible for whether an editable value is submit-ready.
5. Add focused predicate tests while retaining all current amount, quote, API, and mock-exchange coverage.
6. Manually verify keyboard typing and paste behavior for valid and invalid candidates, including `.12` and `,12`, and record the result.

## Validation

- `npm run test -- --run` — all tests pass, including the new editable-input cases.
- `npm run build` — TypeScript and Vite production build pass.
- Manual Chrome check — invalid typing/paste leaves the value unchanged; `.12` and `,12` display as typed, calculate as `0.12`, and permit confirmation when the form is otherwise available.
- Inspect the form handler to confirm invalid input does not reset mutation state and submission still passes through `validateAmount`.
