# Continue Current Task

Resume work on the current task — pick up at the right phase/step in `.trellis/workflow.md`.

---

## Step 1: Load Current Context

```bash
{{PYTHON_CMD}} ./.trellis/scripts/get_context.py
```

Confirms: current task, git state, recent commits.

## Step 2: Load the Phase Index

```bash
{{PYTHON_CMD}} ./.trellis/scripts/get_context.py --mode phase
```

Shows the Phase Index (Plan / Execute / Finish) with routing + skill mapping.

## Step 3: Decide Where You Are

Classify the current turn first. Answer consultation, explanation, review, or read-only investigation directly even if a task is active. For development, identify the intended original task, then read its scope, decisions, execution grant, prohibited operations, and checkpoint. Reconcile them with the latest user instruction and actual tool permissions before using `status` and artifacts as progress hints. Neither `in_progress` nor file presence authorizes implementation.

- `status=planning` + no `prd.md` → **1.1** (load `trellis-brainstorm`)
- `status=planning` + `prd.md` only → decide whether the task is lightweight or complex. Lightweight can move to **1.4** review; complex returns to **1.1** to add `design.md` + `implement.md`.
- `status=planning` + a role selected for immediate delegation but its jsonl is uncurated → **1.3** for that role. Host support alone does not select a role.
- `status=planning` + required artifacts complete → **1.4** when the applicable plan is confirmed and execution is authorized. Use `task.py start --allow-empty-context` if either seeded manifest is empty, even when the other role is ready; curate each role before its dispatch. Reuse a valid grant already recorded or supplied in this request.
- `status=in_progress` + implementation not started + applicable grant → **2.1**
- `status=in_progress` + implementation done, not yet checked → **2.2**; the executor may complete checks for a simple task, while material interface/design/integration risk or explicit requirements call for independent review.
- `status=in_progress` + check passed → **3.3** (spec update). Enter **3.4** only when task work needs committing and that action is authorized. Enter finish-work when no current-task work remains uncommitted and archive/journal writes plus enabled auto-commits are authorized; otherwise deliver the verified result and keep the task available for continuation.
- `status=completed` (rare; usually archived immediately) → check the latest commit/archive grants before any wrap-up action

Phase rules (full detail in `.trellis/workflow.md`):

1. Run steps **in order** within a phase — `[required]` steps must not be skipped
2. `[once]` steps are already done if the required output exists. `prd.md` alone can be enough only for lightweight tasks; complex tasks also need `design.md` and `implement.md`.
3. A local repair within the confirmed contract continues without renewed approval. A falsified key premise pauses affected work; report evidence and a recommendation, update the original task after confirmation, and resume at the affected step. Continue independent work and retain unaffected checks.
4. Reuse evidence for unchanged candidate code, inputs, and premises. After a change rerun affected checks; retain final whole-deliverable acceptance and project-required hook/CI gates.

## Step 4: Load the Specific Step

Once you know which step to resume at:

```bash
{{PYTHON_CMD}} ./.trellis/scripts/get_context.py --mode phase --step <X.X> --platform {{CLI_FLAG}}
```

Follow the loaded instructions. After each `[required]` step completes, move to the next.

---

## Reference

Full workflow and detailed phase steps live in `.trellis/workflow.md`. This command is only an entry point — the canonical guidance is there.
