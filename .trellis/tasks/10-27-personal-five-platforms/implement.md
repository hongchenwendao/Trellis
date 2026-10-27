# Execution plan

Status: approved and delivered locally on 2026-10-27. Implementation and
validation are complete; changes remain uncommitted as requested. Archival and
auto-committing finish-work commands are deferred.

## Baseline and prerequisites

- Baseline: `personal`, commit `f089cb32`; initial worktree clean; verified
  origin/upstream match the user's URLs. Recheck changes before editing.
- At planning time `node_modules` was absent; dependencies subsequently became
  available without changes to the lockfile. Node 22.22.3 and Python 3.14.5 are
  available; `/usr/bin/python3` provides CPython 3.9.6 for minimum-version checks.
  The pnpm shim's write attempt failed; the existing pinned pnpm executable
  works directly with package-manager auto-switching disabled (see evidence).
- Follow the pinned pnpm 10.32.1 and frozen lockfile. Dependency provisioning
  must not install global packages, alter global settings or set up git hooks.
- GitNexus impact is mandatory before symbol edits. Tools and two indexes are
  now available under `/private/tmp`, including hidden project integrations;
  project instructions and global installs were not changed.
- Environment context emitted this hint; do not execute it as part of planning:
  `Trellis update available: 0.6.14 -> 0.6.17, run trellis update`

## Ordered work after approval

1. [x] Activate the task after confirming current authorization and the curated
   context manifests. Read relevant backend/test specs and Python guidance.
2. [x] Establish baseline build/check/test results with available local tools;
   separate pre-existing failures from pruning regressions.
3. [x] Run and report symbol impact, especially registration, update ownership,
   migration selection and shared runtime. Keep one implementation owner for
   the coupled registry/update/removal contract.
4. [x] Add the narrow inert-legacy-ownership treatment and regression fixtures
   for mixed and pure-retired projects; retain meaningful poisoned-manifest
   protections. Do not delete historical migration manifests.
5. [x] Narrow types, active registries, CLI options, detection, init options and
   template imports; remove the 17 exclusive generators and templates after
   resolving shared import dependencies.
6. [x] Narrow Python/hook/platform routing branches and current descriptions;
   preserve all five platform behaviors and sync affected dogfood twins using
   small edits rather than regenerating the project.
7. [x] Update tests and fork-owned current docs; retain historical records and
   memory readers. Make docs checks cover real fork documentation rather than
   succeeding on an empty upstream submodule.
8. [x] Build, exercise real local CLI paths and run the final checks below.
   Independent review uses original acceptance criteria and the actual diff.
9. [x] Deliver changed scope, usable local invocation, results and actual gaps.
   Leave changes uncommitted and task history intact.

## Decisive validation matrix

| Scenario | Evidence required |
| --- | --- |
| Registry and CLI | Exactly five IDs and correct flags (`--claude`, `--codex`, `--cursor`, `--pi`, `--dsh`); obsolete flags rejected; `platforms --json` agrees. |
| Fresh init | Each of the five separately and all five together in temporary projects; generated files match template inventories; shared assets present, retired adapters absent. |
| Existing init | Adding retained adapters to an initialized project remains supported; no accidental default extras. |
| Update | All five fresh/older fixtures, repeated no-op update, dry-run, user-modified templates and versioned migrations; expected hooks/skills/agents/extensions survive. |
| Legacy coexistence | Mixed projects update retained/shared content while retired file contents and hash values remain unchanged; pure-retired update writes nothing; removal commands reject unsupported legacy ownership before mutations. |
| Shared migration | Pi shared-skill move remains allowed; retired-only migration endpoints skipped; shared hash records are not incorrectly discarded. |
| Runtime | Workflow phase loading for Claude, Cursor, Pi, dsh and both Codex modes; task JSONL gates; Claude/Cursor/Codex hooks, Cursor shell-ticket bridge, Pi extension. |
| Historical APIs | Existing mem readers and channel-provider regression suites remain effective. |
| Package contents | Clean build's `dist/templates` has only the five platform directories plus required shared directories; historical migration manifests remain packaged. |
| Documents | Current fork support counts, flags and lists agree with registry; external upstream docs and historical references are explicitly distinguished. |
| Protected state | Review diff for unintended changes to prior specs/tasks/research/journals/logs; check fixture user-data preservation through update paths. |

## Commands

From the repository root, with a functioning local pnpm:

```bash
pnpm typecheck
pnpm --filter @mindfoldhq/trellis lint:py
pnpm lint
pnpm build
pnpm test
```

Build precedes integration tests because tests execute `bin/trellis.js`, which
imports built `dist`. Use `node <repo>/packages/cli/bin/trellis.js` from temporary
project directories for actual CLI smoke tests, never a globally installed
`trellis`. Derive exact noninteractive flags from the built command's help and
existing fixtures. Disable external template/network sources in smoke fixtures
using established test controls.

For Python, run the existing CI syntax-compile path on tracked Python files
with caches redirected to a temporary directory. CI's minimum interpreter is
3.9 (`.github/workflows/ci.yml:42-50`); report it separately if unavailable
locally. Do not present Python 3.14 parsing as proof of 3.9 compatibility.

Targeted suites during implementation include `registry-invariants`,
`configurators/platforms`, `commands/init.integration`,
`commands/update.integration`, `commands/platforms.integration`,
`commands/uninstall.integration`, `utils/manifest-prune`, shared hooks/workflow
and task suites. Keep the final full core + CLI test run.

Do not commit. `detect_changes()` remains mandatory if a later user explicitly
authorizes a commit; no commit action is included here.

## Evidence collected during implementation

- Baseline typecheck, ESLint and build passed. Python typecheck: 0 errors,
  68 existing warnings. Core: 399 passed, 1 skipped; CLI: 1902 passed,
  2 failed because the pinned marketplace submodule was not checked out.
- Checked out marketplace at its existing gitlink
  `7d5298d16e07c328c09493eed1f0652571744b17`, without repinning or editing it.
- Existing pinned package manager invocation:
  `PNPM_MANAGE_PACKAGE_MANAGER_VERSIONS=false node /Users/chaofanrusheng/Library/pnpm/.tools/pnpm/10.32.1/node_modules/pnpm/bin/pnpm.cjs`.
- GitNexus 1.6.12 and storage are isolated under `/private/tmp/trellis-gitnexus*`.
  A temporary scanner copy includes hidden paths (the stock scanner excludes
  them); original source paths were indexed, without editing project code.
- HIGH/CRITICAL impact was reported to the user before the affected changes:
  platform detection/template collection (8/11 direct callers), session identity
  resolution (up to 26 affected symbols), and retired OpenCode root helpers
  (7 direct callers). Constant reads/dynamic dispatch need source evidence in
  addition to the graph's lower-bound results.
- Baseline real CLI smoke for dsh and all-five succeeded, including init,
  `platforms --json`, dry-run/update and user-file preservation. Reusable script:
  `/private/tmp/trellis-five-smoke.sh`; baseline results:
  `/private/tmp/trellis-five-smoke.rNHmzG`.
- Preserve the independently created, unrelated task
  `.trellis/tasks/10-27-personal-npm-beta-release/`; it is not this task's output.

## Final acceptance evidence

- Current CLI build passed. `dist/templates` contains exactly
  `claude`, `codex`, `cursor`, `pi`, `dsh`, plus `common`, `markdown`,
  `shared-hooks`, `trellis`. All 149 historical migration manifests remain
  packaged with the same filename inventory as source.
- Current typecheck, ESLint, Python typecheck and full tests passed. Core:
  21 files, 399 passed, 1 existing skipped test. CLI: 73 files, 1571 passed.
  Python typecheck has 0 errors and 68 pre-existing warnings (baseline unchanged).
- CPython 3.9.6 compiled all 71 current tracked/new Python files successfully.
  Logs: `/private/tmp/trellis-final-check.0yxGWt/`.
- Real CLI smoke passed for each retained platform and all-five together:
  init, reinit, `platforms --json`, dry-run, update, repeated update and
  user-file preservation. Results: `/private/tmp/trellis-five-smoke.EhFkox/`.
  The same CLI rejects removed flags; no global CLI was used.
- Independent read-only review completed. Repaired findings included missing/
  empty-manifest pure-retired safety, retained shared-skill last-writer parity,
  current skill-guide drift and init banner wording. Final review found no
  further confirmed AC3/AC7 defect.
- Regression review used GitNexus `detect-changes --scope compare --base-ref
  main`: 337 files, 1423 symbols, 137 affected flows, CRITICAL aggregate risk,
  consistent with the previously reported cross-cutting removal. Output:
  `/private/tmp/trellis-five-detect-changes.txt`.
- Four tracked, non-loading `.opencode/**/SKILL.md.backup` files remain as
  historical recovery material. Prior task/research/workspace/log records,
  core mem/channel code, dependency lockfile and global installations were not
  changed. Current platform specs and fork-owned docs were updated, not deleted.
- `git diff --check` passed; HEAD remains the baseline commit. The unrelated
  task above remains untouched. No commit, push, publishing or global install.
