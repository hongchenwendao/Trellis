---
name: trellis-start
description: "Initializes an AI development session by reading workflow guides, developer identity, git status, active tasks, and project guidelines from .trellis/. Classifies incoming tasks and routes to brainstorm, direct edit, or task workflow. Use when beginning a new coding session, resuming work, starting a new task, or re-establishing project context."
---

# Start Session

Initialize a Trellis-managed development session. This platform has no session-start hook, so manually load the equivalent compact context by following these steps.

---

## Step 1: Current state
Identity, git status, current task, active tasks, journal location.

```bash
python3 ./.trellis/scripts/get_context.py
```

If this output includes a line beginning `Trellis update available:`, copy the full line verbatim when summarizing session context. Do not shorten operational command hints.

## Step 2: Workflow overview
Compact Phase Index, request triage rules, planning artifact contract, and the step-detail command.

```bash
python3 ./.trellis/scripts/get_context.py --mode phase
```

Full guide in `.trellis/workflow.md` (read on demand).

## Step 3: Guideline indexes
Discover packages + spec layers, then read each relevant index file.

```bash
python3 ./.trellis/scripts/get_context.py --mode packages
cat .trellis/spec/guides/index.md
cat .trellis/spec/<package>/<layer>/index.md   # for each relevant layer
```

Index files list the specific guideline docs to read when you actually start coding.

## Step 4: Decide next action
Classify the current request before routing by task status. Answer consultation, explanation, review, and read-only investigation directly, even when a development task is active. For development, read the task's scope, current decisions, execution grant, prohibited operations, and next step; reconcile these with the latest user instruction and tool permissions. Status and artifact presence do not grant authority.

Then check the task directory:

- **Active task status `planning` + no `prd.md`** → Phase 1.1. Load the `trellis-brainstorm` skill.
- **Active task status `planning` + `prd.md` exists** → finish the applicable plan (PRD-only for lightweight work; `design.md` + `implement.md` for complex work). If plan confirmation and execution authorization are already established, proceed to `task.py start` without another ceremonial review.
- **Active task status `in_progress`** → resume the recorded authorized checkpoint (for example 2.1 implementation, 2.2 check, or 3.3 spec update), not automatically 2.1. Load that step's detail:
  ```bash
  python3 ./.trellis/scripts/get_context.py --mode phase --step <X.Y> --platform codex
  ```
- **Checks complete** → enter Phase 3.4 only if the task has work to commit and commit authorization exists. Enter finish-work only when no current-task work remains uncommitted and archive/journal writes plus any enabled auto-commits are authorized. Otherwise deliver the verified result and leave the task available for later continuation.
- **No active task** → answer read-only requests directly. For development, use an explicitly identified existing task or obtain missing task-creation consent; creation, plan confirmation, and execution authorization are separate.

---

## Skill routing (quick reference)

| User intent | Skill |
|---|---|
| New feature / unclear requirements | `trellis-brainstorm` |
| About to write code | `trellis-before-dev` |
| Done coding / quality check | `trellis-check` |
| Stuck / fixed same bug multiple times | `trellis-break-loop` |
| Learned something worth capturing | `trellis-update-spec` |

Full rules + anti-rationalization table in `.trellis/workflow.md`.
