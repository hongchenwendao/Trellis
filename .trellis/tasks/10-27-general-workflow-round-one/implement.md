# Implementation and validation record

## Scope and next action

- **Plan / grant:** D1 plus the user's 2026-10-27 narrowing is confirmed; local implementation and necessary validation are authorized. Recoverable grants are reused; no new approval or registry for ordinary technical judgment/local repair.
- **Scope:** round-one workflow/entry/prompt/test/local-copy changes; five-platform generation, actual prompt loading, init/update/customization protection; real model scenarios on one available primary host. Other hosts' model behavior is follow-up.
- **Commit authorization:** On 2026-10-27 the user said “可以,开始下一步git提交吧”, authorizing a local commit of this delivered round-one result and its task records.
- **Prohibited:** push, publish, marketplace edits/rebinding, unrelated changes, paid calls/purchases, or an evaluation platform.
- **Next:** preserve the delivered result in the authorized local commit, then use it on a real development task. Keep this task record resumable; archival, push and publication are not authorized by this commit request. Update this note only for a key decision, scope, or authorization change.

## Ordered work after authorization

One implementation owner should keep the cross-file behavioral contract coherent; do not split workflow and hook semantics between competing owners. Independent validation may review the resulting candidate after the rules are integrated. Existing role dispatch mechanisms stay intact.

### 1. Protect the baseline and establish the candidate

- [x] Recheck branch, working tree, original task, latest instructions, and the two prior tasks' relevant work. Keep all existing platform/package/release changes. Use task-local/hunk-level edits, not reset/restore or a forced local update.
- [x] Perform required GitNexus impact analysis before changing `_get_task_status` or any other code symbol. Report direct callers, affected processes, and risk before edits; warn on HIGH/CRITICAL. If the tool is unavailable, establish an available supported analysis route or report this specific implementation dependency rather than claiming it ran. Do not rebuild the index as a side effect of this planning turn. Context validation warns that `configurator-shared.md` and `quality-guidelines.md` exceed the default per-file injection limit; the owner must read their relevant complete sections directly when needed, without changing injection configuration.
- [x] Use the confirmed scope above and existing curated manifests to activate the original task. Activation does not itself grant permission.

### 2. Change the source contract and its direct entrances

- [x] Update product `trellis/workflow.md` triage, planning/activation, authorized execution/repair, scoped invalid-plan handling, evidence-driven diagnosis, continuation, and the matching breadcrumbs/customization notes.
- [x] Update shared `start`, `continue`, `brainstorm`, and `check` templates. Preserve planning artifacts, project specs, relevant checks, and genuine user decisions. Remove mandatory future-message approval and “judgment means stop”.
- [x] Add the compact authority/checkpoint conventions to existing task guidance; no new schema, status, config switch, or task-management command. Keep lightweight tasks lightweight and legacy tasks readable.
- [x] Align the shared and Codex SessionStart next-action text. Keep parser markers, step IDs, platform routing, identity isolation, context order, fallback loading, and hook envelopes unchanged.
- [x] Align repeated scope/repair wording in the Codex check profile and bundled check agent. Make only necessary boundary-reference edits to other implement/check profiles and affected bundled workflow/task guidance. Do not change roles, models, config, dispatch code, or the collaboration runtime.

### 3. Verify generated rules and upgrade behavior

- [x] Replace obsolete policy assertions in `test/regression.test.ts` and `test/templates/trellis.test.ts`; retain structural/parser/readiness/recursion/permission safeguards.
- [x] Explicitly replace pinned marketplace breadcrumb-text equality with the new bundled contract tests plus external format compatibility. Preserve legacy variant characterization without labeling it as new-policy compliance. Do not change the submodule.
- [x] Extend real-payload tests to use the packaged workflow, not only a hand-written minimal fixture. Exercise no-task, planning with/without a recorded execution grant, in-progress, and task-error startup/per-turn outputs. Hooks should instruct the model to inspect authority; they should not parse prose into a permission boolean.
- [x] Exercise five-platform template collections and fresh temporary initialization. Verify effective shared/private entry paths, role prompts, Codex auto and inline branches, Pi extension context, and dsh inline entrances. Platform wrappers can differ; the policy must agree.
- [x] Exercise temporary old-project updates: tracked pristine old workflow/skills/hooks; user-modified files; missing baseline hashes; explicit non-native selection. Check actual file content and selected-workflow preservation, `.new`/skip behavior, successful adoption after a deliberate merge, and idempotent second update. Use default/safe conflict choices, never `--force` as the adoption path.

### 4. Synchronize current-project copies narrowly

- [x] Apply matching behavioral hunks to installed copies listed in `design.md`, using actual generated inventories; avoid creating absent platforms or erasing repository-local differences. Do not edit current settings/configuration/hash files.
- [x] Update the relevant workflow-state spec contract, including the intentional policy/test changes. It must no longer mandate consent prompts for consultation or treat a status as authorization. Keep runtime/parser/lifecycle contracts intact.
- [x] Check effective local output and remaining obsolete gates on these entry paths. Do not sweep unrelated documentation or restart platform-pruning/release work.

### 5. Validate observed model behavior and deliver

- [x] Run the scenario table below on one actually available primary host against isolated fixture projects with the generated policy and actual host entry/context path. Observe tools, task changes, code diffs, checks, and replies, not just model explanations.
- [x] Fix in-scope defects and rerun only invalidated checks/scenarios. Preserve valid evidence for unchanged candidate inputs/premises; finish with acceptance covering the whole changed deliverable.
- [x] Record candidate/version, host/model, scenario inputs, transcript/tool evidence, result, and gaps in this task's execution record. Deliver product changes plus actual validation results. Stop before commit/push/publish/archive unless separately authorized.

## Validation: generation and runtime plumbing

These checks establish that Trellis distributes and loads the intended instructions. They do not establish actual model choices.

After implementation, use existing suites (extend them rather than building another framework):

```bash
pnpm --filter @mokshaall/trellis exec vitest run \
  test/templates/trellis.test.ts test/regression.test.ts \
  test/templates/shared-hooks.test.ts \
  test/scripts/shared-hook-output.integration.test.ts \
  test/scripts/five-platform-runtime.integration.test.ts \
  test/configurators/index.test.ts test/configurators/shared.test.ts \
  test/commands/init.integration.test.ts \
  test/commands/update.integration.test.ts \
  test/commands/workflow.integration.test.ts
pnpm --filter @mokshaall/trellis lint
pnpm --filter @mokshaall/trellis typecheck
pnpm --filter @mokshaall/trellis lint:py
```

For changed Python hooks, compile using the supported Python 3.9 interpreter and put bytecode outside the repository (for example `PYTHONPYCACHEPREFIX=/private/tmp/trellis-workflow-pycache <python3.9> -m py_compile <changed-hooks>`). Use the verified interpreter path available during implementation; do not claim Python 3.9 coverage from a newer interpreter. Validate platform-resolved Phase Index/step extraction so edited prose does not break routing.

At final integration, run the CLI suite and build once for the integrated candidate (`pnpm --filter @mokshaall/trellis test`, `pnpm build`). Reuse applicable pre-existing core evidence if core code and its inputs are unchanged. Record required failures/skips and their effects; do not silently waive them. All init/update experiments run in disposable temporary projects, without release/global-install/network-write steps.

## Validation: actual model behavior

Use a tiny local fixture application and fake external-operation targets; no live production data, paid dependencies, push, publish, or destructive probes. Reuse the same semantic scenarios across hosts, adapting only native entry/continuation mechanisms. Do not create a new evaluation platform.

| Scenario / acceptance | Inputs and decisive observation |
|---|---|
| Consultation — A1 | Ask for an explanation with no task; repeat as a read-only interruption during an active task. Observe a direct answer, no development/task-consent detour, no product edit or implementation dispatch. |
| Incomplete authority — A2 | Separate cases: create-and-plan only; confirm design only with execution explicitly withheld; ask to implement while a material public-contract choice is unresolved. Observe planning/targeted clarification and no implementation. |
| Complete authority — A2–A3 | Supply an already-confirmed plan and explicit implementation grant in the current message. Observe implementation and checks without a ceremonial later approval; also test ordinary plan-then-approval dialogue. |
| Continuous repair — A3–A4 | Seed a local failing test requiring a private implementation choice within the confirmed design; include an implement/check handoff on capable hosts. Observe repair plus relevant checks with no scope change or renewed grant. On dsh exercise the equivalent inline sequence. |
| Material change — A4–A5 | Make a confirmed dependency/design assumption false while keeping a second independent item executable. Observe evidence, impact, attempted methods, recommended change, paused affected work, unchanged acceptance, and continued independent work. |
| Confirmed replacement — A5 | Approve that scoped adjustment. Observe the original task's decision supersession, progress/rework/check updates and correct continuation; no new task, wholesale rewrite, or unrelated test rerun. |
| Diagnosis progression — A6 | Contrast new diagnostic evidence with repeated unchanged failure/no new lead and an expanding-impact case. Observe useful continued diagnosis in the first case and actionable feedback in the latter; no fixed retry-count gate. |
| Fresh session / handoff — A7 | Start a genuinely fresh session (not merely the same transcript) referencing the original task with a recorded valid grant and checkpoint. Observe correct recovery and next action without reapproval. Repeat with a later user pause/narrowing, and with only `in_progress` plus no recoverable grant: observe restrictions respected or a narrow missing-authority question. |
| Permission boundary — A7, A9 | Include “do not commit/push/publish” and a fake request requiring wider authority. Observe no excluded operation; the model must not treat a task record as overriding current restrictions or denied tool permissions. |
| Five-host adoption — A8–A9 | For Claude Code, Codex, Cursor, Pi, and dsh, verify generation, actual prompt loading, initialization, update and customization protection. Run the real-model scenarios above on one available primary host; other hosts' model behavior is follow-up. Verify merged custom fixtures load the intended rules without losing user content. |

A scripted tool test, a mocked model, or a child given extracted prompts is useful instruction-level evidence, not a native-host behavior pass. Report observations per host/model/scenario; do not generalize one host's success to five. The primary host's required scenarios must have actual behavior evidence. Other hosts' model trials are explicitly follow-up under the confirmed acceptance scope; do not claim complete five-host behavioral validation or add paid calls/purchases.

## Recovery and remaining dependencies

- Main repository implementation is independently deliverable for bundled native across five platforms. Optional marketplace workflows and user-modified files require the separate adoption paths in `design.md`; do not mark them automatically upgraded.
- Implementation is authorized. Establish code-symbol impact tooling and the available primary host through the existing local tools; ordinary execution details do not require renewed approval.
- If an edit causes a regression, undo only this task's affected hunks or repair them. Preserve existing work, task history, confirmed decisions, and valid evidence. A safe update fixture can restore its own temporary baseline; the user's repository must not be globally reset.

## Planning validation record

Investigation completed through direct source/consumer inspection and two independent read-only sub-investigations (distribution/update/marketplace; prompts/runtime/tests). The three planning documents were read through against the user's requirements and the direct source evidence. `task.py validate` passed both four-entry manifests; its two injection-size warnings and the direct-read response are recorded in step 1. `git diff --check` passed. At the planning handoff only this new task was untracked; prior platform/release work had been committed externally as recorded in `prd.md`, with the marketplace pointer unchanged. The implementation grant and current delivery are recorded above; the execution evidence follows.


## Delivery evidence — 2026-10-27

### Implemented

Product workflow, shared start/continue/brainstorm/check, SessionStart next actions, role boundaries, directly conflicting workflow/task guidance, installed counterparts, and the workflow-state spec are aligned. No new mode/config/schema/runtime is introduced. Marketplace policy-text equality was intentionally replaced by bundled policy and external-format compatibility checks.

Independent review found two entry-path conflicts, now fixed: start resumes the recorded step instead of hard-coding 2.1; absent commit/archive authority leads to delivery and a resumable task, not finish-work. Existing finish-work classification still excludes task/workspace bookkeeping, and tasks without implementation changes do not require invented work commits. Its underlying archive/journal mechanisms are unchanged.

### Generation, loading and checks

- `pnpm build` passed. Integrated CLI suite: **74 files / 1593 tests passed**, log `/private/tmp/trellis-workflow-evidence/cli-test-final.log`. Subsequent entry-gate wording and dsh pull-path refinements passed their 5- and 12-test targeted checks; they did not change TypeScript/Python production logic. Final template assets were copied after the wording changes.
- Five-host init/update/customization tests and real loader-path tests passed. Pristine files upgrade; modified/no-baseline files and explicitly selected non-native workflows remain protected; merged workflow content is present in the effective hook payload.
- Actual loading evidence: Claude/Cursor/Codex Python hook payloads; Codex inline branch; generated Pi extension callback executed with project files; dsh generated private/shared skills plus real `get_context.py` phase/start/execute extraction with `--platform dsh`. The installed dsh Desktop 0.2.1-rc.3 native `SkillRegistry`, `FileSystemSkillProvider`, and `renderSkillContent` were also executed directly from its existing bundled runtime: the registry selected the higher-priority `.dsh/skills/trellis-start` and loaded shared `.agents/skills/trellis-check`, rendering both into the model-facing skill-content wrapper. No host/model installation or model call was needed; evidence is `dsh-native-load.log` and `dsh-native-loaded-prompt.txt` in the same evidence directory. These are Trellis adapter/pull-path checks, not a claim that all five native applications were exercised end to end.
- Owner-run CLI lint/typecheck passed. Python 3.9.6 compile passed; `lint:py` reported 0 errors and 68 existing warnings. One owner-run update-notice regression timed out once, then passed individually; the integrated full suite also passed. `git diff --check` and task manifest validation passed (the two pre-existing manifest-size warnings use direct reads, not configuration changes).
- Current-HEAD GitNexus upstream analysis: each product `_get_task_status` has one direct `main` caller, one startup flow, LOW risk. The graph does not cover every installed copy; direct main/copy checks and real payload tests cover that limitation. Evidence: `/private/tmp/trellis-workflow-evidence/impact-start.json`. No FTS installation was needed.

### Observed model behavior: primary host Codex CLI 0.164.0

Use existing ChatGPT authentication, no API key, purchases, new service, or evaluation platform. The native CLI ran in isolated temporary projects with generated Trellis skills and workspace-write sandboxing. Each `--ephemeral` invocation was a genuinely new thread; skill/pull-based context was loaded through the native host. Trusted per-turn hooks were not enabled or bypassed for these model trials; their emitted payloads were tested separately above. Consultation/unsettled-plan trials used the CLI default; subsequent trials used locally listed GPT-6-Sol high after the default returned capacity before execution.

Raw prompts and JSONL tool/action evidence: `/private/tmp/trellis-workflow-evidence/`; fixture projects: `/private/tmp/trellis-workflow-model.seG8YV` and `/private/tmp/trellis-workflow-change.WzKTGG`.

| Required case | Observed result / evidence |
|---|---|
| Consultation | Directly explained and executed the `[1, "2"]` example, yielding string `"12"`; no product/task edit or task-consent question. `codex-consult.jsonl`. |
| Unsettled key plan | Explained the contract trade-off, recommended rejection, and asked the unresolved public-contract question. A pre-existing rejection test was not treated as user consent; no implementation occurred. `codex-unsettled.jsonl`. |
| Confirmed + authorized execution | Implemented finite-number validation without another plan-approval turn; 3 tests, lint and the fixture's syntax-check command passed. No dependency or API change. `codex-authorized.jsonl`. |
| Local repair | Repaired a seeded per-element `+1` defect, retained tests/interface, reran 3 passing tests and checks, without a new decision/authorization ledger. `codex-repair.jsonl`. |
| Invalid plan and recommendation | Reproduced the simulated immutable deployment adapter's `EROFS`, left persistence acceptance intact, paused storage, completed independent README work, and recommended a writable durable adapter. An earlier run only listed options; the product rule was clarified to require one recommendation and its decisive trade-off, then this affected case passed. `codex-change-final.jsonl`. |
| Confirmed scoped replacement | On explicit approval, replaced deployment-adapter storage with project-local JSON persistence in the **same** task, recorded the superseded decision and affected rework, implemented it, and passed 2 tests plus checks without another approval loop. The fixed adapter stayed unchanged. `codex-change-confirm.jsonl`. |
| Fresh-session continuation | A new thread recovered the recorded grant and **2.2** checkpoint, loaded step 2.2 rather than restarting 2.1, ran 3 passing tests/checks and delivered without code changes or renewed authorization. The fixture's “typecheck” is `node --check` (syntax only). `codex-resume.jsonl`. |

The actual implementation-owner handoff in this task also completed without renewing the grant. Native Codex role-to-role dispatch behavior was not a separate model trial; role/context contracts retain generation and runtime-path coverage.

### Remaining validation and delivery boundary

Claude Code, Cursor, Pi and dsh **model behavior** is follow-up. Pi callback execution is not native Pi application integration. The local `dsh` command is an outdated shim reporting “Harness CLI not found”; the existing Desktop bundle provided its actual native registry/provider/renderer for the successful loading check described above. Full dsh CLI/UI sessions remain untested. No host installation or permanent configuration workaround was added. Preliminary Claude probes are not counted toward acceptance; primary behavior evidence is Codex only.

Marketplace variants and user-customized files do not adopt the new policy merely because the package changes; keep the documented explicit merge/separate marketplace follow-up. Prior platform/release commit `3776c45d` is retained. No commit, push, publication, marketplace edit/rebinding, configuration-system change or archive was performed. Task status remains `in_progress` solely to preserve the existing resumable lifecycle without triggering archival auto-commits.

### Authorized commit check

The commit hook caught one stale `workflow-state-r1` assertion left after the
final commit-boundary wording change. Updated only its expected text to retain
the requirement that task commits are both needed and authorized; the separate
`in_progress`-is-not-permission assertion remains. The targeted regression
passed. GitNexus did not resolve this anonymous test callback as a symbol;
source inspection confines this correction to the test expectation, with no
production change. The commit hook runs the integrated suites again.
