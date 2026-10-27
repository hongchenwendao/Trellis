# Post-pruning recheck (for step 0 of implement.md)

Snapshot taken 2026-10-27 13:52 CST while `10-27-personal-five-platforms` was
still `in_progress` (its `implement.md` had been updated minutes earlier, so it
is actively owned by another session). Nothing here authorizes edits yet.

## Observed pruning state (working tree, uncommitted)

- `AI_TOOLS` now has exactly 5 entries: `claude-code`, `cursor`, `codex`,
  `dsh`, `pi`.
- `configurators/` keeps only `claude, codex, cursor, dsh, pi, index, shared,
  workflow`; all other configurators are deleted in the worktree.
- `templates/` directories for the removed platforms are deleted (git status
  `D`); empty leftover dirs may remain on disk.
- `cli/index.ts` reduced to 17 `--` options (from 22 platform flags + others).
- `.trellis/scripts/common/*.py` dogfood twins are modified, so the dogfood ↔
  template parity set has changed.
- 296 files changed in the worktree at snapshot time.

## Touch points that the release task must re-read after delivery

1. `packages/cli/package.json` — name/bin/deps/files/prepack.
2. `packages/core/package.json` — name/publishConfig/repository.
3. Root `package.json` — 14 `--filter @mindfoldhq/...` occurrences.
4. `packages/cli/src/cli/index.ts` — `.name("trellis")` and command
   descriptions (pruning rewrote this file).
5. `packages/cli/src/commands/upgrade.ts` — binary check + hint strings.
6. `packages/cli/src/commands/update.ts` — registry probe uses PACKAGE_NAME
   (unchanged by pruning, re-verify).
7. `packages/cli/src/types/ai-tools.ts` + `configurators/index.ts` — pruning
   edited these; do not assume old line numbers.
8. `packages/cli/src/templates/trellis/scripts/common/session_context.py` and
   its `.trellis/scripts/` twin — parity test must still pass after the rename.
9. Tests asserting package name: `upgrade.test.ts`, registry invariants.
10. `.github/workflows/{ci,publish}.yml`, `.lintstagedrc`, release scripts.

## Risk notes

- Do not run `git checkout --` on any shared path; use hunk-level edits only.
- The pruning diff is uncommitted, so `git diff` cannot separate the two tasks.
  Record this task's own edits explicitly (file + hunk) as they are made.
