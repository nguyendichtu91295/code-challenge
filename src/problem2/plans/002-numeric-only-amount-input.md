# Numeric-only amount input

## Goal

Prevent alphabetic and unsupported characters from entering the send-amount field while preserving natural decimal editing.

## Background and current behavior

`SwapForm` uses a text input with `inputMode="decimal"`. The mobile keyboard is numeric, but desktop typing and paste can still place letters or symbols in local state. `validateAmount` catches them afterward. The agreed behavior is to block them before state changes while continuing to accept leading decimals such as `.12`.

## Scope

- Gate send-amount changes to digits and one `.` or `,` separator.
- Allow empty and incomplete decimal editing states: `.`, `.12`, `12.`, `,`, `,12`, and `12,`.
- Preserve the current input when a typed or pasted candidate is invalid.
- Keep decimal-comma normalization and submission validation.
- Add focused unit coverage for the input-character rule and its boundary cases.

## Out of scope

- Currency precision limits, automatic rounding, locale detection, thousands separators, formatted input libraries, browser/E2E automation, and deployment.
- Changing quote mathematics, API behavior, token selection, or mock exchange behavior.

## Target files or areas

- `src/features/swap/swap.validation.ts`
- `src/features/swap/swap.test.ts`
- `src/features/swap/components/SwapForm.tsx`
- `docs/manual-testing.md` only when execution records the manual result

## Implementation approach

1. Add a pure predicate for editable amount strings. Accept `""` or digits with an optional single decimal separator and optional digits on either side. Require at least the separator or a digit, and reject whitespace, letters, signs, exponent notation, other symbols, mixed separators, and repeated separators.
2. Add a named amount-change handler in `SwapForm`. Update local state and reset the prior mutation only when the complete candidate value passes the predicate. An invalid candidate leaves both unchanged.
3. Keep `type="text"` and `inputMode="decimal"`. Do not use `type="number"`, because browsers may accept `e`, `+`, and `-`, and its behavior differs across browsers.
4. Keep `validateAmount` as the submission boundary. Intermediate `.` or `,` values may be displayed but must keep confirmation disabled and show the existing validation message after interaction.
5. Test valid editing candidates and rejected typed/pasted candidates through the pure predicate. Retain existing tests proving `.25`, decimal commas, malformed values, overflow, and underflow behavior.

## Dependencies and sequencing

- Depends on the completed swap form from task 003.
- Implement the predicate and tests first, then connect it to the form and run the complete suite/build.
- Manual browser verification follows the automated checks.

## Validation commands and expected results

- `npm run test -- --run`: all existing tests pass; new cases accept empty input, `.`, `.12`, `12.`, comma equivalents and ordinary numbers, while rejecting letters, signs, exponent notation, whitespace, symbols and multiple/mixed separators.
- `npm run build`: TypeScript and the Vite production build pass.
- Manual Chrome check: typing and pasting invalid characters does not change the field; `.12` and `,12` remain editable, calculate as `0.12`, and enable confirmation when prices are available.
- Browser/E2E automation remains skipped because the pure rule is unit-testable and a short manual input/paste check covers DOM wiring.

## Open questions and risks

- No open product question remains. Both decimal point and decimal comma are supported as agreed.
- Rejecting an entire invalid paste is intentional; the app will not silently strip or reinterpret pasted content.
- The rule controls characters, while `validateAmount` remains responsible for positivity and numeric range.
