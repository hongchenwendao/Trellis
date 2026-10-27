# Five-platform fork: design

Status: approved and delivered locally on 2026-10-27; no commit or publication.

## Direction

Keep the current Trellis architecture and reduce its active installation
registry, not its development methodology. The supported IDs become exactly
`claude-code`, `codex`, `cursor`, `pi`, and `dsh`.

Remove these 17 active adapters:
`opencode`, `kilo`, `kiro`, `gemini`, `antigravity`, `devin`, `qoder`,
`codebuddy`, `copilot`, `droid`, `reasonix`, `zcode`, `trae`, `omp`, `grok`,
`kimi`, `snow`.

Pi Agent and Oh My Pi are separate integrations. Preserve `pi`; remove `omp`.
Claude Code's installation flag remains `--claude` although its ID is
`claude-code`.

## Evidence and impact

These planning findings came from source inspection. Implementation subsequently
completed real GitNexus impact analysis; see `implement.md` for risk reports
and validation evidence.

| Boundary | Evidence | Required change / risk |
| --- | --- | --- |
| Platform identity and metadata | `packages/cli/src/types/ai-tools.ts:10-32,525-539` | 22 IDs today; narrow types, metadata and derived lists together. |
| Configuration and detection | `packages/cli/src/configurators/index.ts:85-179,230-250` | Registry also controls discovery, managed directories and backup scope. |
| Static CLI entry points | `packages/cli/src/cli/index.ts:71-96`; `packages/cli/src/commands/init.ts:1004-1050` | Remove obsolete flags and option types, not just picker entries. |
| Direct retired-template dependencies | `packages/cli/src/commands/update.ts:49-54,915-921,2172,2466`; `packages/cli/src/utils/managed-removal.ts:13-18,208-216` | Decouple Copilot constants/handling and ZCode guidance before deleting templates. |
| Manifest ownership and migrations | `packages/cli/src/utils/manifest-prune.ts:60-75,123-162`; `packages/cli/src/commands/update.ts:2203-2302` | Registry pruning can drop legacy ownership; automatic historical deletions can still touch retired paths. Highest data-safety risk. |
| Shared Python runtime | `packages/cli/src/templates/trellis/scripts/common/task_store.py:243-276,578-590`; `common/active_task.py:68-85,122-160,514-555,710-729`; `common/cli_adapter.py:44-64,687-950` | Narrow active platform decisions without changing session identities or task contracts; sync affected `.trellis/scripts` twins. |
| Workflow routing | `packages/cli/src/templates/trellis/workflow.md:286-300,486-566`; `packages/cli/src/templates/trellis/scripts/common/workflow_phase.py:144-197` | Preserve dispatch/inline semantics, Codex modes and dsh phase loading. Do not overwrite the locally customized workflow wholesale. |
| Hooks and shared skill layer | `packages/cli/src/templates/shared-hooks/index.ts:33-44,95-149`; `packages/cli/src/templates/pi/index.ts:19-21`; `packages/cli/src/templates/dsh/index.ts:4-17` | Claude/Cursor/Codex hooks, Pi native extension, and dsh inline skills remain distinct. |
| Historical memory and worker providers | `packages/core/src/mem/types.ts:10-19`; `packages/core/src/mem/platforms.ts:82-140`; `packages/cli/src/commands/channel/adapters/index.ts:189-210` | Separate contracts; preserve readers and Claude/Codex workers rather than applying the install registry to them. |
| Distribution | `packages/cli/scripts/copy-templates.js:67-73` | All existing template directories are copied; inspect built assets after source deletion. |
| Documentation | `README.md:47,64`; `README_CN.md:47,64`; `packages/cli/test/registry-invariants.test.ts:216-278` | Current claims advertise 22; docs-site checks can assert zero pages when the submodule is empty. |

## Retired assets are inert, not deleted from consumer projects

Use a small path-ownership compatibility table, separate from active adapter
registration. It has no generators, templates, CLI selection or hooks.

- Update a mixed project using only retained adapters and shared runtime.
  Preserve retired exclusive files and existing hash values. Keep ordinary
  poisoned-manifest protection for unrelated user-owned paths.
- Filter migration entries by both `from` and `to` before pending migration,
  orphan recovery and automatic `safe-file-delete` classification. If either
  endpoint is retired-exclusive, skip the entire entry. Do not split directory
  operations or rewrite historical migration manifests.
- `.agents/skills` is shared, not retired. Preserve the Pi
  `.pi/skills` -> `.agents/skills` migration. Where only retired platforms own
  existing shared-skill records, leave those records/assets untouched; current
  Codex/Pi/dsh installations retain their normal shared-skill updates.
- A pure-retired project reports that it has no supported platform before any
  update mutation. Explain how to add a retained platform or use the original
  CLI; do not auto-convert.
- `uninstall`/`ablate` must not feed unsupported legacy ownership to deletion
  planners. If present, stop before pruning/writing/removal and explain that
  legacy cleanup requires the original CLI or a separately approved conversion.
  Retained-only projects keep existing removal behavior.
- When updating a mixed project, say that the project version reflects shared
  content and retained adapters; retired assets remain unchanged. Returning to
  the upstream CLI may require its own migration/version review.

This is preferable to blocking every mixed-project update, which would remove
existing retained-platform usability merely because legacy files coexist.

## Shared capabilities and protected knowledge

Retain common commands/skills, shared hooks required by the five platforms,
Python task/session machinery, all current workflow choices, Codex auto/inline
modes, Pi's native sub-agent extension, and dsh's inline route. Only platform
lists, retired-only branches and guidance change in shared workflow material.

Keep historical memory readers, including readers named for retired tools,
because they provide access to existing logs independently of installation
support. Document this distinction; do not add Cursor/dsh readers in this task.
Keep channel providers and core APIs unchanged unless an actual pruning
dependency requires a minimal repair.

Do not delete `.trellis/spec`, prior `.trellis/tasks` or their research,
`.trellis/workspace`, raw logs, shared `.trellis/agents` or `.agents/skills`.
Do not remove `.github` wholesale: CI is not the Copilot adapter.
Retired-only tracked root integration assets may be removed only after
file-level ownership/dependency review; never remove user/global installations.

## Tests and documentation

Keep shared-behavior tests and port removed-platform fixtures to retained
platforms when they exercise a shared contract. Remove only tests exclusively
for intentionally deleted implementations. Preserve the generic Windows
rendering checks; add an exact-five registry/CLI/packaging assertion and dsh
init/update integration coverage.

Update both READMEs, current contributor/platform guidance, bundled skill maps
and active dogfood routing. Historical changelogs, tasks, research and release
migration records retain their factual platform references.

`docs-site` and `marketplace` are uninitialized upstream submodules. They are
not a fork-owned five-platform documentation source. Do not silently edit or
repin them. Mark links as upstream references where appropriate, and move the
fork's support-count/flag consistency coverage onto the fork-owned READMEs
and current guidance. Explicitly report uninspected external contents; do not
claim an empty-directory docs check verifies documentation. This changes the
documentation-test target, not the requirement to test supported-platform docs.

## Permissions and recovery

No commits, pushes, releases, global installs, or destructive consumer-project
cleanup. Local test projects live in temporary directories. Use the lockfile
without dependency upgrades. If dependencies/tooling need bootstrapping, use
workspace/temporary caches and avoid global installation or hook changes.

GitNexus tools and indexes were absent at planning time. They were restored
under `/private/tmp`, including an isolated hidden-path index. Upstream impact
ran before affected symbol edits/deletions, with HIGH/CRITICAL warnings to the
user. Dynamic/constant-read limitations were supplemented by source references;
UNKNOWN graph results were not treated as proof of safety.

Preserve existing diffs at every handoff. Roll back only task-owned edits if
needed; do not reset the worktree or change global tools. Deliver an uncommitted
reviewable diff with validation evidence.
