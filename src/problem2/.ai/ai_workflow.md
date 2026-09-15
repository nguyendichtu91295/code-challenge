# Local AI Development Harness

This file defines a lightweight, repository-local workflow for planning and executing software work.

The workflow is intentionally independent of Git remotes, branches, worktrees, project registration, and external task systems.

## Scope and Repository Boundary

- Treat the directory containing this file as the repository root.
- Work only inside that repository root.
- Read project documentation and source files from this repository as needed.
- Do not create or use Git worktrees.
- Do not require a Git repository, Git remote, branch, commit, or push.
- Do not switch to another repository or project directory.
- Do not modify files outside this repository.
- Do not invent project configuration when the repository itself provides enough context.

## General Working Rules

- Keep planning, task creation, and implementation separate.
- Prefer small, focused changes.
- Inspect existing conventions before changing code.
- Do not broaden the task scope without recording the reason in the task execution notes.
- Ask the user when a product, scope, dependency, design, or implementation decision is required and cannot be inferred safely.
- Never claim work is complete without recording validation results.
- Preserve existing user changes.
- Do not delete, reset, overwrite, or broadly rewrite files unless the user explicitly requests it.

## Directory Layout

Create these directories in the repository root when they do not exist:

```text
./plans/
./task/
```

Plans are durable planning documents. Each task is a directory under `./task/`.

Recommended layout:

```text
./plans/
  001-<plan-name>.md

./task/
  001-<task-name>/
    basic_info.md
    task.md
    execution.md
```

Use filesystem-safe, readable names. Do not create temporary task manifests or hidden coordination files unless the user explicitly requests them.

## Planning

When the user asks to plan work:

1. Read the relevant repository documentation and inspect the implementation areas needed to understand the request.
2. Create `./plans/` if it does not exist.
3. Write a plan as a Markdown file under `./plans/`.
4. Make the plan concrete enough to create executable tasks.
5. Record:
   - Goal
   - Background and current behavior
   - Scope
   - Out of scope
   - Target files or areas
   - Implementation approach
   - Dependencies and sequencing
   - Validation commands and expected results
   - Open questions and risks
6. Do not modify source code while only planning.

### Frontend Automation Guidance

- This harness supports full-stack work, including frontend, backend, APIs, data, scripts, and infrastructure.
- For frontend work, do not plan browser or UI automation by default.
- Prefer static checks, unit tests, component tests, API tests, integration tests, or direct code inspection when they provide sufficient coverage.
- Use browser automation only when the behavior depends on real browser interaction, layout, navigation, visual state, or an end-to-end user flow that lower-level checks cannot verify.
- If frontend automation is skipped, record the reason and the validation that replaces it in the plan.
- If frontend automation is required, keep it focused on the smallest user flow that proves the behavior.

A plan may be revised by creating a new numbered plan or by clearly updating the existing plan. Preserve useful prior decisions when revising it.

## Task Creation

When the user approves a plan or asks to create tasks:

1. Read the selected plan from `./plans/`.
2. Create `./task/` if it does not exist.
3. Split the plan into focused, executable tasks only when the work benefits from sequencing or separate validation.
4. Create one directory per task under `./task/`.
5. Give every task the following files:

### `basic_info.md`

```markdown
# Task Info

## Task ID

task-001-<name>

## Status

PENDING

<!-- STATUS: PENDING -->

## Depends On

None

## Last Updated

YYYY-MM-DD
```

### `task.md`

```markdown
# Task

## Goal

...

## Scope

...

## Target Files

...

## Steps

...

## Validation

...
```

### `execution.md`

```markdown
# Execution Result

## Status

PENDING

## Summary

## Changes

## Validation

## Errors

## Notes
```

Task requirements:

- Set each new task to `PENDING`.
- Use explicit task IDs and keep them unique.
- Record dependencies in `basic_info.md` and explain meaningful sequencing in `task.md`.
- Make each `task.md` self-contained. An executor should not need to infer missing requirements from the conversation.
- Include concrete target files or directories when known.
- Include validation commands for every implementation task.
- Do not mark tasks as `DONE` during task creation.

## Single-Task Execution

When the user asks to execute a task:

1. Read the task's `basic_info.md`, `task.md`, and `execution.md`.
2. Confirm that the task is `PENDING` or explicitly retryable after `FAILED`.
3. Check that all dependencies are `DONE`.
4. Change the task status to `RUNNING` and update the status marker.
5. Implement only the task scope inside the repository root.
6. Run the targeted validation from `task.md`, adding closely related checks when needed.
7. Update `execution.md` with:
   - Final status
   - Summary
   - Files changed
   - Commands run
   - Validation results
   - Errors, if any
   - Important notes
8. Mark the task `DONE` only when implementation and validation succeed.
9. Mark the task `FAILED` when implementation, validation, or required information prevents completion.

Completion is local and filesystem-based. It does not require a commit, branch, push, pull, or remote repository.

## Continue Without Stopping

When the user asks to continue without stopping, run the task queue for the repository's current task set:

1. Read all task directories under `./task/`.
2. Select only tasks with status `PENDING` and all dependencies marked `DONE`.
3. Execute exactly one task at a time using the Single-Task Execution rules.
4. After a task is `DONE`, refresh the task state and select the next unblocked `PENDING` task.
5. Continue automatically without asking between successful tasks.
6. Stop immediately when:
   - a task becomes `FAILED`;
   - a dependency is missing or blocked;
   - requirements are ambiguous;
   - validation cannot be completed;
   - a task remains `RUNNING` without a reliable result; or
   - no unblocked `PENDING` tasks remain.
7. Report the stopping task or queue state clearly.

Do not automatically retry `FAILED` or `RUNNING` tasks. Retrying requires an explicit user request or a separately recorded retry decision.

## Status Rules

Valid task statuses are:

```text
PENDING
RUNNING
DONE
FAILED
```

Keep the visible status in `basic_info.md` synchronized with the `<!-- STATUS: ... -->` marker. Keep `execution.md` synchronized with the latest execution attempt.

## Final Response

Report:

- What was planned, created, or implemented
- Which task was executed or where the queue stopped
- Validation performed and its result
- Remaining blockers, failed tasks, or open questions

Do not report Git branches, worktrees, commits, pushes, remotes, or project configuration unless the user specifically asks about them.
