# Task

## Goal

Publish the verified app through Git-connected Vercel deployment and verify the production site.

## Scope

Final publishing and hosted verification only. Requires both completed deployment setup (004) and production/manual verification (005). Target coding-challenge/currency-swap, GitHub nguyendichtu91295/code-challenge, production branch main, app root src/problem2.

Read `.ai/ai_workflow.md`, `.ai/coding_convention.md`, `requirement.md`, and `plans/001-currency-swap.md` before execution. Work within the current `problem2` project, preserve user changes, and use the workflow's status/execution recording rules.

## Target Files

`README.md`, `docs/manual-testing.md`, this task's `execution.md`; reviewed intended Problem 2 files for commit; Vercel Git connection and deployment metadata.

## Steps

1. Verify prerequisite tasks are DONE and review their evidence. Recheck relevant local changes: rerun tests/build/manual cases if the validated implementation changed.
2. Review the existing repository/remote and intended Problem 2 changes. Inspect newer remote changes and reconcile safely before push; do not reset user work, force-push, initialize nested Git or commit unrelated changes.
3. Commit the intended validated Problem 2 source/docs only, excluding secrets, node_modules, dist and .vercel metadata. Git commands may operate the existing parent repository from this directory; keep staged content limited to approved project changes.
4. Connect the intended repository with vercel git connect using coding-challenge scope. Verify Git provider, production branch main and root src/problem2; preserve the configured npm run build/dist settings. Confirm any initial connection-triggered deployment is not mistaken for the final validated version.
5. Push the validated commit to main. Observe the resulting automatic Vercel build/deployment until success or an actionable failure. Verify deployed commit matches the validated commit.
6. Open the production URL manually: HTTPS, page load and refresh, price fetching, token icons, mobile and desktop layouts, keyboard basics, amount conversion and demo submit pending/success behavior. Check browser console/network errors and missing-icon fallback.
7. Check hosted price-fetch failure/retry with developer tools. Production must use normal mock success; controlled exchange failure was verified locally in task 005.
8. Record final production URL, deployed commit, build result and hosted manual results. If public access is needed for submission, verify the URL is accessible without the owner's session; report any deployment protection blocking it.
9. Fix actual deployment defects within scope, rerun affected validation and publish a new validated commit if needed. Report any authorization or external blocker with evidence; never claim an unverified deployment succeeded.

## Validation

- `git status --short` and review of staged changes before commit — only intended content is staged; do not require an entirely clean parent repo.
- `git push origin main` — intended validated commit reaches the chosen production branch without force.
- Vercel CLI/API deployment inspection — Ready/success status, correct project/team, root settings and exact source commit.
- `curl -fsS -o /dev/null <production-url>` — public page responds; if protected, separately document the access limitation.
- Manually complete the hosted flow and record results in docs/manual-testing.md. Compare a known selected pair against sourcePrice/destinationPrice, verify pending→success and no production failure injection.
- Confirm README has the working production URL and execution.md records final status, checks, changed files, deployment result and any limitations.
