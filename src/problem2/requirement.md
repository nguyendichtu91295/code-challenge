Create a currency swap form based on the template provided in the folder. A user would use this form to swap assets from one currency to another.

*You may use any third party plugin, library, and/or framework for this problem.*

1. You may add input validation/error messages to make the form interactive.
2. Your submission will be rated on its usage intuitiveness and visual attractiveness.
3. Show us your frontend development and design skills, feel free to totally disregard the provided files for this problem.
4. You may use this [repo](https://github.com/Switcheo/token-icons/tree/main/tokens) for token images, e.g. SVG image.
5. You may use this [URL](https://interview.switcheo.com/prices.json) for token price information and to compute exchange rates (not every token has a price, those that do not can be omitted).

<aside>
✨ Bonus: extra points if you use Vite for this task!
</aside>

## Page style

- Light and clean, with black as the accent color.
- Mobile first, then desktop; touch-friendly controls.

## Stack and deployment

- Build: Vite.
- UI recommendation: React + TypeScript + shadcn/ui + Tailwind CSS; customizable components.
- API queries: TanStack Query (`useQuery`). Keep form state local; no separate global state library.
- Hosting: Vercel.
- Setup ready: Node.js 24 LTS, npm, Vercel CLI; Vercel login verified.
- Deployment target: Vercel team `coding-challenge`, project `currency-swap`.
- Deployment flow: connect GitHub repository `nguyendichtu91295/code-challenge` to Vercel; use `main` for production deployments on push.
- Verify GitHub push access and Vercel repository authorization during deployment setup. Custom domain is optional.
- Planned Vercel settings: root `src/problem2`, build `npm run build`, output `dist`.

References: [Vercel login](https://vercel.com/docs/cli/login), [Vercel deployment](https://vercel.com/docs/cli/deploy), [shadcn/ui with Vite](https://ui.shadcn.com/docs/installation/vite).

## Testing and setup

- Unit tests for price normalization, amount validation, conversion calculations, and mock exchange success/failure.
- Skip browser/E2E automation; manually test the form, responsive layout, keyboard access, and error states.
- Plan separate app initialization, deployment setup, and final deployment stages.
- Reuse the existing `code-challenge` repository; no nested Git initialization.

## Exchange behavior

- The supplied API provides prices only; no swap execution endpoint is provided.
- Mock exchange: local asynchronous function called through `useMutation`, with a short delay, pending state, success summary, and controllable failure for testing. No backend or real asset transfer.
