# General workflow autonomy — round one

## Goal

Make Trellis support autonomous delivery after sufficient planning and authorization, while retaining requirements discussion, technical design, task continuity, project specs, collaboration boundaries, quality acceptance, and user control over consequential decisions. This is a general product change, not a personal, novice, or model-specific preset.

## Current assignment and baseline

- On 2026-10-27 the user confirmed D1 with the narrowed recordkeeping and validation scope below, and authorized local implementation and necessary validation. No commit, push, publication, marketplace changes, paid calls, purchases, or evaluation platform are authorized.
- Branch: `personal`. At initial inspection the five-platform and npm-release work was extensively uncommitted; during planning, HEAD advanced externally to `3776c45d` (`feat: streamline platforms and prepare personal npm release`). At that planning handoff only this new task was untracked. No commit, staging, push or other Git write was performed by this task. Prior work remains an input, not part of this task's diff. Retain Claude Code, Codex, Cursor, Pi Agent, and dsh.
- No active session task was resolved. The related active tasks concern platform pruning, npm packaging, or earlier template convergence, not this behavior change. A separate task was initially created with `--no-start`; it was activated in the implementation turn after the user confirmed D1 and granted execution.
- `marketplace` is a separate submodule. Its optional workflows must be assessed without editing it or changing its binding. See `design.md` for the supported delivery boundary.
- The context command reports no initialized developer identity. This task uses an explicit assignee (`codex`); no developer identity/configuration was initialized.

## Requirements

| ID | Required outcome |
|---|---|
| R1 | Consultation, explanation, and read-only analysis complete directly, including inside an active development task. Do not require task creation or repeatedly ask whether to create one. |
| R2 | Investigate ordinary technical questions independently. Discuss unresolved requirements and consequential design trade-offs with the user; do not implement an unsettled key decision. AI participates in planning rather than outsourcing project management to the user. |
| R3 | Distinguish task-record consent, plan confirmation, and implementation authorization. Once the applicable plan is confirmed and execution is authorized, continue implementation, tests, and local repairs without renewing the same grant at phase, agent, or session boundaries. |
| R4 | Resolve local problems autonomously when the confirmed goal, external behavior, interface contract, key design, acceptance requirements, and authorized scope remain intact. Technical judgment alone is not a reason to stop. |
| R5 | When the plan becomes invalid or a change needs wider authority, pause the affected work and report evidence, impact, attempts, and a recommended adjustment. Preserve acceptance and scope until confirmed; continue independent work where possible. |
| R6 | Continue diagnosis when new evidence identifies a useful next repair. Escalate repeated unchanged failures, lack of new leads, or growing impact; do not use a fixed failure-count approval gate. |
| R7 | Confirmed adjustments update the original task's relevant decisions, progress, rework boundary, and next step, identifying the superseded decision. Avoid new tasks, wholesale document rewrites, and rerunning unaffected checks for a local adjustment. |
| R8 | Resume from recorded scope, decisions, authorization evidence, checkpoints, and current user instructions. Neither artifact presence nor `in_progress` proves arbitrary authority. Missing material authority must be recovered or clarified, not invented; valid recorded authority must not be requested again. |
| R9 | Deliver through product templates, shared entrances, effective prompts, tests, and selected current-project copies. New initialization and ordinary updates must agree across the five platforms, while preserving user customizations. Distinguish five-platform generation/loading/init/update/customization checks from real model-behavior evidence on one available primary host; other hosts' behavior remains follow-up validation. |
| R10 | Commit, push, release, destructive actions, and other risky/external operations remain subject to actual authorization and platform permissions. Implementation authority does not imply these grants. |

## Acceptance criteria

The concrete fixtures and evidence rules are in `implement.md`.

- **A1 (R1):** A no-task consultation and a read-only question during an active task produce an answer with no development activation, product edit, or task-consent question.
- **A2 (R2–R3):** Creation-only consent, plan-only confirmation, and an unresolved public-contract choice never trigger implementation. A supplied confirmed plan plus execution grant proceeds without requiring an additional later message solely as ceremony.
- **A3 (R3):** Authorized implementation proceeds through implementation, checks, and repairs, including a worker handoff, without asking for the same authorization again.
- **A4 (R4):** A local implementation defect requiring technical judgment is repaired within the agreed contract, with relevant checks; an interface/acceptance change is not disguised as a local repair.
- **A5 (R5–R7):** A falsified key assumption produces a scoped pause and actionable recommendation. Approval updates the same task, explicitly replaces the old decision, records required rework, and resumes at the affected step. Independent work and valid evidence remain usable.
- **A6 (R6):** Evidence-bearing diagnosis continues; a repeated unchanged approach without new leads reports the impasse. Behavior is not driven by a fixed retry count.
- **A7 (R8, R10):** A fresh session recovers a valid grant and next step, respects a later pause or narrower instruction, and refuses to infer new authority from stale status or documents. Ambiguous legacy tasks require only the missing material clarification.
- **A8 (R9):** Fresh five-platform generation, real hook/prelude/extension output, and temporary old-project updates carry consistent policy. Unmodified managed files update; user-modified/custom-selected content remains protected and unresolved adoption is disclosed.
- **A9 (R9–R10):** All five hosts pass generation, actual prompt-loading, initialization, update, and customization-protection checks. One available primary host passes real model scenarios for consultation, unsettled design, authorized execution, local repair, plan change, and fresh-session continuation. Report generated/runtime checks separately from observed model actions; other hosts' untested behavior is follow-up, not a claim of five-host behavioral validation. No unauthorized commit, push, publish, destructive operation, or submodule change occurs.

## Out of scope

- Removing the task system, sub-agents, or context injection; creating mini-Trellis, an Auto mode, or another configuration system.
- Refactoring fixed-role dispatch, the collaboration runtime, knowledge retrieval, or broadly reducing injected context.
- Reworking commit, archive, release, platform pruning, or personal npm publication workflows. Only cross-cutting reminders must respect their existing authorization boundary.
- Editing/rebinding the marketplace submodule or claiming unmodified third-party workflows implement the new contract.

## Delivery status

D1 and the narrowed validation scope are implemented locally. See `implement.md` for actual checks, primary-host observations and remaining native-host validation. Keep this task resumable; commit, push, publication and archive remain unauthorized. No new approval, identifier or authority entry is required for ordinary technical choices or local fixes.
