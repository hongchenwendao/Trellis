# Execution and evidence

1. Measure old tag bodies and fixed-input real hook payload. Inspect all consumer instructions and existing truncation/host-output tests.
2. Change the smallest set of product prompts and current-project copies to use complete injected context, recover targeted gaps, and avoid unconditional rereads. Compress in-progress breadcrumbs while keeping phase gates and detailed routes.
3. Test actual hook/extension payloads for complete/truncated/index-only/missing/host-output paths, plus existing path/budget and five-platform init/update protection. Fix affected failures.
4. Run lint/typecheck/Python checks when affected, final CLI suite, and local CLI build. Re-measure with the same input; hand the stable candidate to the main agent for independent review, then report final evidence and limits. The main agent owns subsequent commit, push, and npm publish.

Baseline, before edits: `in_progress` body 2564 characters; `in_progress-inline` 1522. Fixed-input actual hook additionalContext: Claude `in_progress` 2624 characters and Codex `in_progress-inline` 1705 (includes Codex mode banner), measured with a local task/session fixture under `/private/tmp`.

## Delivered candidate and evidence (2026-10-27)

- Final bodies: `in_progress` 1376 characters (−46.3%); `in_progress-inline` 1076 (−29.3%). With the same task/session fixture and hook input, actual additionalContext was Claude 2624→1436 characters (−45.3%) and Codex inline 1705→1259 (−26.2%, including its mode banner). `no_task`/`planning` remain 349/725 characters. These are character counts, not latency or cost measurements.
- The current child uses complete relevant task/spec blocks directly. Existing truncated/index-only notices trigger named recovery; no-curated Pi task blocks trigger manifest inspection and guideline discovery rather than treating a PRD as complete. Missing references remain named alongside valid context; disallowed paths receive a distinct cannot-auto-read notice. Pi reading now accepts only realpaths within the repo or real `.trellis` root, including an externally symlinked `.trellis`, and refuses `..`/symlink escapes.
- Final review also found `type: "directory"` entries could disappear. Python now retains directory path/reason when missing, unreadable, empty, partly materialized, or disallowed; Pi emits an allowed-directory notice without adding recursive expansion and separate missing/disallowed notices. Outside-root directories are not enumerated or suggested for direct reading.
- After this narrow directory repair, `test/scripts/context-injection-limits.integration.test.ts` and `test/templates/pi.test.ts` passed together (95 tests); the additional external-`.trellis` directory case passed on focused rerun. ESLint, TS typecheck, and Python basedpyright passed again (0 errors, 68 existing warnings). The 0.6.19 local CLI build/copy-templates succeeded and the affected Claude/Cursor/Codex/Pi mirrors match generated payloads. The main agent's commit/release checks will run the full suite for this final candidate; this implementer did not rerun unrelated tests after the directory-only repair.
- `get_context.py` detail routes now pass the actual `--platform`; Codex's existing config chooses inline versus sub-agent Phase 2.1/2.2, without a new resolver. Required Phase 2 and conditional Phase 3 gates remain in the short breadcrumb and detailed steps.
- Actual Python hook, Pi `buildPrompt`, five-host generation/init/update/customization, Codex inline routing, path isolation, external `.trellis` symlink, and notice branches were exercised by focused tests. Final CLI suite: 74 files, 1606 tests passed. ESLint, TS typecheck, and Python basedpyright passed (0 errors, 68 existing unused-import warnings). Local CLI build/copy-templates and generated current-project mirror comparison passed; the existing global `moksha-trellis` link resolves to `packages/cli/bin/trellis.js` at version 0.6.18.
- Isolated Codex CLI read-only behavior used the generated profile and actual `build_codex_subagent_context` payload: with the complete tail rule in the prompt, it answered `violet` without a file command; with the rule excluded by the 70-byte cap, it read only `rule.md` and answered `violet`. The final prompts for these two cases are unchanged from those runs. Claude Code, Cursor, Pi, and dsh model behavior was not exercised; their generated/runtime loading paths and tests were.
- GitNexus initially returned false CRITICAL results from a stale incremental graph (empty target type and unrelated callers). A safe index-only forced rebuild resolved exact symbols: `buildPullBasedPrelude` LOW (2 direct callers, 2 mapped flows); shared implement/check/Codex prompt functions LOW (one caller/flow each); Python `_materialize_file`, `_read_file_bytes`, and `get_agent_context` LOW. Pi `.txt` symbols were not indexed and are UNKNOWN; source inspection found `buildContext` used by `buildPrompt` and `before_agent_start`, and `materializeFile` used by `buildContext`. No HIGH/CRITICAL symbol edit proceeded on the spurious result.
- The main agent owns final independent review and the authorized GitHub/npm release. This implementer did not commit, push, publish, change versions, or modify other projects/global settings.

## Final acceptance by the main agent

The independent reviewer identified missing-manifest, missing-reference, and
host-filtering gaps; those corrections were reviewed and retained. Its final
remaining directory-reference finding was repaired by the original owner and
checked by the main agent against the actual Python/Pi notice paths and the
reported targeted tests. Missing/partial directories stay visible, rejected
paths do not invite bypasses, and legal external `.trellis` roots remain valid.
No further blocking issue remains from that review. The user explicitly
authorized committing and publishing this completed round to GitHub and npm;
the release owner prepares 0.6.19 and the main agent performs the live release.

The first commit-hook run passed 1607 CLI tests but the pre-existing
`session-update-hint` stale-version notice case missed its hint under suite
load. The same case passed unchanged in an isolated run. No assertion or
production timeout was relaxed; the existing full commit gate is rerun.
