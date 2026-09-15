# Manual testing

Date: 2026-09-15  
Browser: Google Chrome on macOS

| Check | Result | Observed |
| --- | --- | --- |
| Production page and price feed | PASS | ETH/USDC loaded from the supplied endpoint; price date displayed as Aug 29, 2023. |
| Responsive layout | PASS | Chrome responsive mode at 320px, 390px and 768px, plus the desktop window; controls remained readable without horizontal clipping. |
| Token picker | PASS | Picker opened with 32 tokens; case-insensitive search, empty results, keyboard Escape and focus return worked. The selected token cannot be chosen for the opposite side. |
| Amounts and quote | PASS | Decimal comma `1,5`, zero, negative, malformed, exponent, small and large-number behavior matched validation; confirm enabled only for a valid finite quote. |
| Reverse | PASS | ETH/USDC reversed and recalculated while preserving the send amount. |
| Submission | PASS | Pending locked amount, token and reverse controls; success matched the submitted snapshot and stated that no assets moved. Editing cleared the old result. |
| Controlled failure | PASS | The deterministic fail-once service test verifies that the first request rejects and the next succeeds. |
| Production failure gating | PASS | A production build with `VITE_MOCK_SWAP_MODE=fail-once` compiled with the production success path; the normal build was restored afterward. |
| Keyboard and labels | PASS | Controls expose descriptive accessible names; picker focus, Escape dismissal and focus return were checked. |
| Token image fallback | PASS | Image errors replace the image with a symbol badge; filename mapping has focused unit coverage. |
| Price failure and retry | PASS | Focused tests cover query errors and retry decisions; the unavailable-price UI blocks confirmation and exposes Retry. |
| Console | PASS | No application runtime exception remained. A missing favicon request found during review was fixed with an inline favicon. |
| 200% zoom | PASS | Content remains in document flow and scrollable; no fixed-height app container clips the form. |

Browser/E2E automation was intentionally skipped. Vitest covers price normalization, validation, quote math, icon resolution and mock exchange behavior.

## Hosted verification

Production URL: https://currency-swap-coding-challenge.vercel.app

- PASS: public HTTPS request returned HTTP 200 without a Vercel login.
- PASS: hosted ETH/USDC prices and icons loaded with the historical date visible.
- PASS: `0.5 ETH` produced `823.06707 USDC`; pending completed with the demo/no-assets-moved success message.
- PASS: the production deployment uses the Git-connected `main` branch and the configured `src/problem2` root.
