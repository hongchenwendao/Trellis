# General workflow: task-based execution and proportionate checks

## Decision and authority

On 2026-10-27 the user explicitly chose and authorized local implementation of round two before revisiting any problems. This builds on round one's confirmed scope-based authority at `48fb69fa`. Commit, push, publication, destructive operations, paid calls, and edits outside the Trellis product/workspace remain unauthorized. The existing task system is the record; no new mode or schema is needed.

## Required behavior

1. Choose execution ownership by the task: a clear, small change may be investigated, implemented, tested, and repaired by one executor; independently deliverable work may be delegated. Keep explicit user/project assignment rules and the Codex `inline` restriction.
2. The executor owns its assigned result through necessary checks and repairs, then hands back evidence. An independent reviewer is required for a changed public interface, substantial cross-module change, important risk, or an explicit user/project requirement. Review seeks omissions, design drift, and integration risk rather than repeating every check. Where the host cannot run an independent reviewer, disclose that coverage gap.
3. Keep one writer for substantial rework: send it back to the original executor. A reviewer may make small, clearly assigned corrections and rerun affected checks.
4. Reuse a check result while candidate code, inputs, and premises remain the same. After a change, rerun affected checks, then perform final whole-deliverable acceptance and any project-required hooks or CI gates. A lint pass or a worker's report alone is not acceptance.
5. Prepare a role's JSONL context when that role is actually dispatched, not merely because the host supports agents. Load project specs for inline work; preserve reliable injected/fallback context for real delegation.
6. Preserve round-one authorization, read-only interruption, material-change feedback, task continuity, context loading, recursion guards, and all five host generation/update protection.

## Acceptance

- Product workflow, common skills/commands, applicable agent prompts, Codex mode banner/comment, and current-project copies agree on the rules above. No policy forces a separate implement→check agent relay for a simple task.
- `codex.dispatch_mode: auto` remains the sub-agent-capable route, `sub-agent` remains its alias, `inline` still forbids implement/check sub-agent dispatch, and invalid explicit values retain their existing safe behavior.
- Targeted tests cover policy routing and five-host generated/loaded assets. Existing init/update/user-customization protection and parser contracts pass. The linked local CLI is rebuilt once after source validation.
- If a primary host can be run without paid calls or new credentials, record observed simple-task, independent-review-trigger, and check-reuse behavior separately from template/runtime tests. Otherwise state the untested behavior plainly.

## Boundary

Do not refactor the collaboration runtime, config parser, task schema, retrieval, release or archive process, marketplace/docs-site submodules, or other projects. Minimal task notes may record owner, reason for review, check evidence, and invalidation; no new classification form or cache layer.
