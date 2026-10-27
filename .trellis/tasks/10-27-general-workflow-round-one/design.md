# Design: scope-based authority, continuous execution

## Recommendation

Change the existing workflow contract, not the workflow engine. Use one rule across all five platforms: **continue within confirmed and authorized scope; pause only the affected work when a material decision or authority is missing.** Keep existing phases, task files, status values, role dispatch, parsers, and context transports. No new mode, configuration, authorization service, or task schema is needed.

**D1 is confirmed**, with the user's 2026-10-27 narrowing: brief material-change records; five-host generation/loading/init/update/customization checks; real model scenarios on one available primary host. No paid calls, purchases, or evaluation platform. The evidence below comes from the inspected `personal` working tree, including the prior five-platform work, not an assumed clean `main`. The baseline's external commit advancement during planning is recorded in `prd.md`.

## 1. Problems and evidence

Paths below are repository-relative; line anchors describe the investigated candidate and can move during implementation.

| Problem | Evidence | Recommended correction / protection retained |
|---|---|---|
| Even simple conversation is routed to task consent. | `.trellis/workflow.md:151-178`; `packages/cli/src/templates/trellis/workflow.md:154-181`; `templates/common/commands/start.md:41-50` under the same templates root. | Classify the current intent before phase routing. Answer read-only requests directly, including during an active task. Keep consent for creating persistent development tasks, recognizing consent already present in the user's request. |
| Approval is tied to message order rather than applicable authority. | `.agents/skills/trellis-brainstorm/SKILL.md:8-14,53-61,78-82`; product `packages/cli/src/templates/common/skills/brainstorm.md:3-7,53-56,75-77,193-195`. | Remove the universal subsequent-message requirement. Keep plan review and unresolved consequential decisions as real gates. A request may supply a confirmed plan and execution grant together; a new plan proposed by the AI is not thereby confirmed. |
| Artifact/status routing can cause both reapproval and excessive authority. | `packages/cli/src/templates/common/commands/continue.md:25-39`; workflow template planning and in-progress breadcrumbs; `trellis/scripts/task.py:112-114,194-215` under the templates root. | Read the grant, applicable decision, latest instructions, and checkpoint before interpreting status. `start` records execution state; it does not create user permission. Keep existing task/context readiness checks. |
| “Judgment” is treated as a reason to stop even for local choices. | `.agents/skills/trellis-check/SKILL.md:104-111`; product `packages/cli/src/templates/common/skills/check.md:99-106`; `templates/codex/agents/trellis-check.toml:26,48`; `templates/trellis/agents/check.md:42-46`. | Replace mechanical-versus-judgment with within-contract-versus-contract-changing. Preserve public interface, key-design, scope, and acceptance protections. Workers report consequential changes to the main owner; they do not obtain wider authority themselves. |
| Failure handling alternates between “until green” and broad rollback. | `.trellis/workflow.md:524,530-534`; product `packages/cli/src/templates/trellis/workflow.md:535,541-545`. | Continue useful evidence-driven diagnosis; report stalled or expanding work. No fixed retry gate. Do not silently revise the PRD or broadly revert code when the approved plan is falsified. |
| SessionStart repeats the obsolete gates independently. | `packages/cli/src/templates/shared-hooks/session-start.py:387-396,448-476`; `templates/codex/hooks/session-start.py:230-236,281-297`. | Change these compact next-action messages to recover authority and the next checkpoint, requesting only missing decisions. Keep task resolution and payload plumbing. |
| Per-turn prompts already have a single source; duplicating them would create drift. | `packages/cli/src/templates/shared-hooks/inject-workflow-state.py:398-427`; `.trellis/spec/cli/backend/workflow-state-contract.md`, “Source of truth” and “Update boundary”. | Update workflow bodies and matching walkthroughs together; retain marker syntax, phase/step identifiers, platform blocks, parser behavior, and generic missing-tag fallback. |
| Tests deliberately lock in obsolete consent and external-text parity. | `packages/cli/test/regression.test.ts`, workflow-state consent/planning/commit assertions; `test/templates/trellis.test.ts:132-170`. | Replace obsolete policy assertions with the new decision contract. Retain phase/parser/context safety assertions. Explicitly change the marketplace equality contract as described in section 5. |

`templates/...` abbreviations in the table refer to `packages/cli/src/templates/...`. GitNexus MCP tools/resources were not exposed in this session; investigation used named source paths and their direct consumers. No functions/classes were edited. Before any implementation that changes Python/TypeScript symbols, perform required impact analysis and report callers/processes/risk; do not silently bypass unavailable analysis.

## 2. Decision contract

### Intent and authority

1. **Read-only:** answer/investigate without initiating development, task-consent prompts, or implementation dispatch. The user may explicitly request a planning record, as in this assignment.
2. **Planning:** investigate technical facts and make ordinary implementation recommendations. Ask only for unresolved decisions that materially affect goal, external behavior, interface contract, key design, acceptance, authority, significant cost, or irreversible consequences. Plan confirmation and execution permission are separate facts, even when one explicit user instruction supplies both.
3. **Execution:** after both facts are established for the applicable scope, complete implementation, relevant validation, and local repair continuously. Phase/agent/session transitions are not new permission events. Continue to respect later restrictions and platform permissions.
4. **Local problem:** the executor may change implementation details, fix regressions, add necessary adjacent tests, or choose a different local technique if all agreed invariants remain intact. A changed filename or a technical judgment alone does not imply scope expansion; an unchanged filename does not imply safety.
5. **Invalid plan / wider scope:** pause the affected work, not the entire task by default. Report the failed assumption and evidence, impact/dependencies, attempts and results, and a recommended adjustment with its scope/acceptance consequences. Preserve the old confirmed decision until a replacement is approved.
6. **Stalled diagnosis:** new evidence plus a useful next discriminating action warrants continued work. Repeating an unchanged failure, lacking new leads, or growing impact warrants a concise report with the next decision/dependency. No numeric retry threshold and no endless “until green”.

These rules retain requirements/design discussion, scope discipline, quality gates, final integrated acceptance, spec learning, role ownership, context manifests, sub-agent self-exemption, and permission checks. They remove conversational ceremony, not the work those protections require. Commit/archive/publish mechanics remain unchanged; summaries must not imply that execution authority authorizes those operations.

### Representative local-versus-material decisions

- Wrong import, off-by-one, test fixture mistake, or choosing a private helper/data structure within the approved architecture: fix and check without asking.
- Changing a documented API result, the agreed data-storage design, an acceptance threshold, or adding a paid dependency: report and request the affected decision first.
- A dependency proves incompatible with a confirmed key design: diagnose within bounds, then present the evidence and replacement recommendation; do not silently substitute a new architecture.

## 3. Record authority in the existing task

Reuse the original task. Keep one brief execution note with the applicable plan, execution scope, prohibited operations, and next action. Existing PRD/design/checklist content carries the substantive requirements and progress; do not duplicate it into an authorization ledger.

Update authority/decision notes only when a key decision, scope, or authorization changes. For a material replacement, identify the old decision and the affected rework/next step in plain language. Ordinary technical choices and local fixes need no approval, identifier, authorization registration, or mandatory checkpoint update. Recoverable user authority is reused, not requested again. Records never override current user instructions or platform permissions.

Resume in this order: identify the intended original task using existing session resolution or the user's explicit task reference; read scope and current decisions; reconcile recorded grants with latest instructions; inspect work/checkpoint and changed premises; execute the next authorized action. A lost pointer does not imply a lost task, and no pointer means no guessing another session's task. Rebind the original task through the existing mechanism when appropriate, without treating rebinding as implementation consent.

Legacy tasks remain readable. If authority is recoverable from existing task notes or available user dialogue, use it and add only the missing checkpoint. If a consequential grant cannot be established, ask the narrow missing question. Do not demand a full replanning or backfill ceremonial approval for unchanged authorized work.

After an adjustment is approved: update the affected PRD/design section, mark which decision it replaces, amend only the affected execution/check list, and continue at the recorded point in the same task. Reuse evidence for unchanged code/inputs/premises. Recheck invalidated evidence and affected integration risks; keep final whole-deliverable acceptance. Do not lower requirements to make a test pass.

## 4. Product and current-project change surface

### Required product edits after approval

- `packages/cli/src/templates/trellis/workflow.md`: triage, Phase Index, all applicable no-task/planning/in-progress breadcrumbs (including Codex inline variants), planning/activation semantics, execution/rollback, and customization notes. Keep numbered steps and parseable markers; make any commit reminders conditional on actual authority without redesigning Phase 3.
- `packages/cli/src/templates/common/commands/{start,continue}.md`: current intent first; recover existing confirmed scope/grants/checkpoint before selecting the next step. Do not add approval loops.
- `packages/cli/src/templates/common/skills/{brainstorm,check}.md`: replace message-order and judgment-based stops with the decision contract. Keep inquiry/evidence rules, planning artifacts, local repairs, and relevant checks. `break-loop.md` remains a retrospective; do not turn it into a retry counter.
- `packages/cli/src/templates/{shared-hooks,codex/hooks}/session-start.py`: align compact status/next-action text; retain task identity resolution, output envelopes, disable controls, and context order. No change to the per-turn parser is expected.
- `packages/cli/src/templates/codex/agents/trellis-check.toml` and `templates/trellis/agents/check.md`: remove the independently repeated judgment stop. In existing implement/check profiles for Claude, Cursor, Codex, Pi and the two bundled runtime agent definitions, add only the minimal scope/authority handoff reference where their current text would otherwise imply unrestricted fixing or omit the new boundary. Do not change role names, models, dispatch mechanisms, or runtime code.
- Update only affected workflow/task guidance in `common/bundled-skills/trellis-meta/references/local-architecture/{workflow,task-system}.md` if it still teaches the old gates. Do not sweep unrelated bundled references.

### Current-project copies

After product edits and generated-output checks, apply only corresponding changes to `.trellis/workflow.md`, shared `.agents/skills/trellis-{start,continue,brainstorm,check}/SKILL.md`, actual installed `.claude/`, `.codex/`, `.cursor/`, `.pi/`, and (if present) `.dsh/` entry/skill/hook/agent copies. Update `.trellis/agents/{check,implement}.md` only for affected wording. Update `.trellis/spec/cli/backend/workflow-state-contract.md` for changed behavioral invariants and five-platform reachability notes relevant to this contract.

Use the generated path inventory, not a presumed platform layout: Codex/Pi/dsh share `.agents/skills`, while dsh has private higher-priority entry skills (`configurators/dsh.ts:5-23,73-78`). Preserve native `task_error` protections and any existing local edits; this repository's `.trellis/workflow.md` is already not identical to the product template. Do not run a repository-wide forced update, replace whole customized files, or edit settings/configuration/hash manifests just to synchronize wording.

### Existing distribution mechanisms, retained

`configurators/index.ts:66-75,169-174` and `shared.ts:489-524,582-602` already collect shared templates for the five platforms. Default initialization uses the bundled workflow (`commands/init.ts:1854-1894`); updates collect the same template (`commands/update.ts:857-864`). There is no evidenced need to change these dispatch/update algorithms in round one.

- **Pristine old project:** when the file matches its tracked template baseline, ordinary update replaces the whole managed file. Whole-file workflow updates are necessary because headings and platform markers are runtime input too.
- **Customized or untracked old file:** the existing conflict flow offers skip/overwrite/`.new` (`update.ts:953-987,1120-1178,2626-2673`). Recommend `.new` plus an explicit user-controlled merge for affected custom files. A skipped conflict means that project has not yet adopted all new behavior; report the remaining files rather than claiming success.
- **Do not use `update --force` for adoption:** it overwrites customizations. Re-running `init --yes` is not an upgrade strategy; it can return early (`init.ts:1165-1180,797-806`). `.trellis/spec/` is not ordinarily template-refreshed (`update.ts:124-132`), so product behavior cannot depend on a spec-only edit.

## 5. Marketplace boundary and test-contract change

The submodule is at `7d5298d16e07c328c09493eed1f0652571744b17`, with no local status changes at inspection. `marketplace/index.json:53-75` lists native/TDD/channel-driven variants. CLI `native` resolves to the bundled template, not the submodule copy (`utils/workflow-resolver.ts:203-209`), so the five-platform default improvement can ship independently.

An explicitly selected non-native workflow is user-selected content. Initialization and workflow switching remove its managed native hash (`init.ts:1960-1966`; `workflow.ts:144-181,221-227`). Ordinary update does not transparently upgrade that variant; preserve it. Recommend a separately authorized follow-up to synchronize marketplace native and adapt TDD/channel variants while retaining their distinct workflow semantics. Until then, document native as the round-one supported workflow and the manual adoption boundary for variants. Do not silently switch a project back to native.

**Deliberate test-contract revision:** `test/templates/trellis.test.ts:132-170` currently asserts exact breadcrumb equality with the pinned marketplace native. That is incompatible with an independently improved bundled policy and an unchanged submodule. Replace that equality with explicit bundled policy tests plus structural/parser compatibility checks (phase/step IDs and valid markers). Keep external variants' existing characterization tests where applicable; label their behavior as legacy, not round-one acceptance. This changes the old “identical policy text” contract intentionally, not merely to turn tests green. New rule coverage and real-output tests must carry the lost policy-checking responsibility.

## 6. Dependencies and risks

- Existing platform/release work is the baseline, whether committed or still dirty at implementation time; apply/revert only this task's hunks. No branch reset, pruning rerun, release work, or submodule rebinding.
- Conflicting copies can reimpose the old gate. Validate effective startup, per-turn, skill, and child prompts, not just the workflow source.
- Removing ceremony must not erase unresolved-design/permission gates. Include negative authority fixtures and fresh-session tests before behavioral acceptance.
- Approval records are interpreted evidence, not a security boundary. Platform permissions and user restrictions remain authoritative.
- Customized workflows may require a user-controlled merge; optional marketplace variants are a separate adoption dependency, not a reason to overwrite them.
- Validate real behavior on one available primary host. Other hosts receive generation/loading/init/update/customization checks; their untested model behavior is explicitly follow-up. Prompt tests alone cannot establish model behavior.

Implementation evidence and remaining host-validation scope are in `implement.md`. No second/third-round work or marketplace change is included.
