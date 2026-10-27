# General workflow round three: use delivered context once and shorten execution reminders

## Authorization and boundary

On 2026-10-27 the user confirmed both proposed changes and authorized implementation, then authorized the main agent to commit, push to GitHub, and publish npm after completion. This implementer owns only local product code, tests, task record, and local build; the main agent owns independent review and release operations. Start from `personal` HEAD `0dcac156`, clean tree, version `0.6.18`.

## Requirements

1. A hook marker or a host's visible excerpt does not prove every task/spec file is complete. Distinguish complete, per-file truncated, total-budget index-only, missing, and host-output-truncated context using existing notices. A dispatched child uses the full, current, relevant content it already received and reads only missing, incomplete, or stale parts; no unconditional second full read. A new child never inherits the main agent's read state. On compaction, new session, task/file changes, recover affected context.
2. Shorten the `in_progress` and `in_progress-inline` per-turn workflow bodies while retaining current request triage, authority, task ownership/review, check validity, material-change pause, recursion, task-path/context, final acceptance, and separate commit/archive/publish authority. Keep detailed mechanics in existing phase steps/skills. Preserve phase/step IDs and parser markers.
3. Keep five-platform generation and current-project mirrors aligned. Do not change JSONL/task schema, injection budgets, path containment, configuration, collaboration runtime, retrieval, marketplace, docs-site, versions, or release files.

## Acceptance

- Generated/live agent instructions and actual hook/extension payloads: a complete relevant injection is used without duplicate reads; a tail-truncated key spec, index-only entry, missing manifest, or host-output truncation leads to targeted recovery. Direct/no-hook fallback and child isolation remain usable.
- Five host entry paths remain loadable and consistent. Context compression or file changes cannot justify using stale content. No new cache/hash/read database.
- Fixed-input baseline vs final reports both tag-body and actual hook-payload character counts; this is a prompt-size comparison, not a claimed speed/cost improvement.
- Relevant injection, prompt-loading, five-platform init/update/customization tests and final CLI suite/build pass. Real Codex fixture behavior may supplement but must be reported separately; other hosts' model behavior is not inferred from templates.
