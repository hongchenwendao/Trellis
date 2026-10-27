# Keep only five personal-fork platforms

## Goal

Reduce maintenance in the personal Trellis fork by supporting exactly five AI
platforms while retaining their existing workflows and shared capabilities.

## Background

- Repository: `/Users/chaofanrusheng/Documents/Technique/ai/Trellis`.
- Branch: `personal`; baseline commit: `f089cb32`.
- Remotes: origin `https://github.com/hongchenwendao/Trellis.git`, upstream
  `https://github.com/mindfold-ai/Trellis.git` (verified locally).
- The initial worktree was clean. Preserve any changes made by other owners.
- The user approved the final planning summary on 2026-10-27; implementation
  is authorized within this scope, with no commit/push/publish/global changes.

## Requirements

- R1: Retain Claude Code (`claude-code`), Codex (`codex`), Cursor (`cursor`),
  Pi Agent (`pi`, not `omp`), and DeepSeek Harness (`dsh`). Remove the other
  17 platform adapters across the complete active support surface.
- R2: Cover source, templates, CLI entry points, install/update behavior,
  tests, packaging, and current-facing documentation, not just directories.
- R3: Preserve shared functionality needed by the retained platforms and their
  existing initialization/update contracts.
- R4: Keep development workflow semantics and project knowledge: specifications,
  historical tasks, research material, journals, and logs.
- R5: Preserve meaningful tests. Replace removed-platform fixtures where they
  test shared behavior; do not remove valid coverage to obtain passing checks.
- R6: Present the recommended design, impact, risks, and verification method,
  and wait for explicit approval before activating or implementing this task.
- R7: Existing mixed projects must remain updateable for retained platforms.
  Leave retired platform files and their existing ownership records unchanged;
  do not automatically uninstall them. Purely retired projects receive an
  actionable unsupported-platform result before update writes occur.
- R8: Preserve read-only historical session readers and the existing channel
  providers. These are separate capabilities, not installation adapters.

## Acceptance Criteria

- [x] AC1 (R1, R2): Supported-platform lists, CLI selection/detection, generated
  adapters, and packaged assets agree on exactly the five retained IDs.
- [x] AC2 (R3): All five platforms initialize individually and together; their
  expected hooks, skills, commands, agents, or extensions are usable.
- [x] AC3 (R3, R4): Updates work for all five, including older project state,
  repeated updates, and locally customized files; unrelated/user-owned data is
  preserved and removed adapters are not generated again.
- [x] AC4 (R4): No workflow redesign or mini-trellis migration; specifications,
  historical tasks, research, journals, and logs remain available.
- [x] AC5 (R5): Relevant regression coverage, build, lint, type checks, and tests
  pass, with any pre-existing/environmental failures reported separately.
- [x] AC6 (R6): Planning artifacts exist and implementation waits for the user's
  subsequent approval of the final summary.
- [x] AC7 (R7): Mixed-project updates preserve retired assets and hash values,
  skip migrations into/out of retired exclusive paths, and still perform
  retained-platform/shared migrations, including Pi's shared-skill migration.
  Destructive removal commands refuse unsupported legacy ownership before
  changing files or records when they cannot safely honor it.
- [x] AC8 (R8): Historical memory readers and Claude/Codex channel providers
  keep their current behavior and meaningful regression coverage.

## Out of Scope

- Commits, pushes, publishing, global installation changes, or remote writes.
- Destructive cleanup of existing consumer projects.
- Dependency upgrades, workflow redesign, or a move to mini-trellis.
- Deleting project specifications, historical tasks, research, or logs because
  they mention a removed platform.
