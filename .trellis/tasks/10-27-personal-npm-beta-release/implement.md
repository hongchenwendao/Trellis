# Execution plan — personal npm beta release

Status: implementation and local artifact verification complete. Publication
remains an operator action. The checklist below records the original plan;
the completion record at the end is authoritative where it differs.

## Step 0 — Re-baseline after the platform task

- [ ] Confirm current branch `personal`, note HEAD, confirm the pruning diff is
  present and the worktree contains no unrelated edits.
- [ ] Re-check every fact in `design.md` against the current tree:
  package names, bin entries, `PACKAGE_NAME` usages, `session_context.py`
  twin parity, release-script literals, packed file list.
  → verify: a short written diff of expected-vs-actual; stop and update the
  design if the pruning changed any of these files.

## Step 1 — Rename scope and command

1. [ ] Replace `@mindfoldhq/trellis-core` / `@mindfoldhq/trellis` in consumed
   files: both `package.json`s, root scripts, `src/**/*.ts`, tests, scripts,
   workflows, `.lintstagedrc`.
2. [ ] `bin` → `{ "moksha-trellis": "./bin/trellis.js" }`; `cli/index.ts`
   `.name("moksha-trellis")`.
3. [ ] `upgrade.ts`: binary-check + success hints use `moksha-trellis`.
4. [ ] Current-facing diagnostics (`cli/index.ts`, `update.ts`, `workflow.ts`,
   `ablate.ts`) say `moksha-trellis …`.
5. [ ] `session_context.py`: `_PACKAGE_NAME` + `--version` probe + hint text;
   mirror into `.trellis/scripts/common/session_context.py` byte-for-byte.
6. [ ] Current-facing docs/templates: READMEs, `dsh/DSH.md`, bundled-skill
   current guidance, `upgrade` spec — command-position only.
   → verify: `git grep -n '@mindfoldhq'` returns only historical records;
   `git grep -nE '(^|[^a-z.-])trellis (init|update|upgrade|channel|mem|workflow|uninstall|ablate|restore|platforms)'`
   returns nothing user-facing; parity test for the Python twins passes.

## Step 2 — Version and manifest

- [ ] `node packages/cli/scripts/bump-versions.js beta` → `0.6.18-beta.0` on both.
- [ ] Add `src/migrations/manifests/0.6.18-beta.0.json` (empty migrations).
   → verify: `release-preflight check-versions` and `npm-tag` prints `beta`;
   `grep version packages/*/package.json` matches.

## Step 3 — Packaging: license, notice, provenance

- [ ] Add root `NOTICE` (modification notice signed `mokshaall`); keep `LICENSE`,
  `COPYRIGHT` untouched.
- [x] `packages/cli/package.json`: `files` adds
  `README.md LICENSE COPYRIGHT NOTICE`; `prepack` only copies assets after
  the separate build and tests (replaces `prepublishOnly`); same copy step for
  core via a new `prepack`.
- [ ] Point `repository`/`homepage` at the fork (`hongchenwendao/Trellis`).
- [ ] Remove `publishConfig.provenance` from core.
- [ ] `.gitignore`: copied README/LICENSE/COPYRIGHT/NOTICE in package dirs plus
  `artifacts/`.
   → verify: `git status` clean after a pack; both tarballs contain all four
   files.

## Step 4 — Minimal personal publish path

- [ ] Update the hardcoded package literals in `release-preflight.js`
  (`verify-packed-cli`, docs) — no behavior change, no new tool.
- [ ] `publish.yml`: job-level `if: github.repository == 'mindfold-ai/Trellis'`.
- [ ] Write the exact local publish commands into the task's deliverable summary
  / spec (not a tag-based release).
   → verify: `npm pack --dry-run --json` + `tar -tzf` on freshly packed tarballs
   show the expected contents; `--dry-run` publish prints tag `beta` and public
   access.

## Step 5 — Out-of-tree verification with the real tarballs

- [ ] `npm install -g --prefix <tmp>/prefix <core.tgz> <cli.tgz>`.
- [ ] `which moksha-trellis` resolves inside the temp prefix; `trellis`/`tl`
  absent.
- [ ] Fresh temp git project: `init -y -u test --claude --codex --cursor --pi
  --dsh`; check generated files, `platforms --json`.
- [ ] `update` (up-to-date), `update --dry-run`, `upgrade --dry-run`
  (`@mokshaall/trellis@beta`), `--version`, `mem list`, `workflow --list`.
   → verify: captured command output for each; no writes outside the temp dirs.

## Step 6 — Final checks and delivery

- [ ] One full `pnpm typecheck && pnpm lint && pnpm test` run on the final code
  state; do not re-run checks whose inputs have not changed.
- [ ] Python 3.9 syntax gate when an interpreter is available; otherwise report
  the gap explicitly.
- [ ] Deliver: changed files, exact publish commands, the verification log, and
  the confirmed decisions from `design.md §8`. No commit, tag, push, or publish.

## Validation matrix

| Scenario | Evidence |
|---|---|
| Identity | Both tarballs `0.6.18-beta.0`; packed CLI pins core exactly |
| Command surface | `moksha-trellis` only; `--version/--help` work |
| Update line | `upgrade --dry-run` → `@mokshaall/trellis@beta`; `update` reads the personal registry; session hint uses `moksha-trellis` |
| Package contents | License/README/COPYRIGHT/NOTICE present; no private/task/log/credential paths |
| Out-of-tree | Install + init (5 platforms) + update + upgrade dry-run from a temp prefix |
| Publish path | Dry-run prints `beta`; no git writes; no provenance requirement; no CI dependency |
| Preserved | `.trellis/`, slash commands, skill/agent names unchanged |

## Rollback

Revert only this task's edits: restore the specific hunks this task changed and
delete files this task created. Never run a whole-file checkout/restore over a
path that also carries the platform-pruning work.

## Completion record — 2026-10-27

The five-platform task had finished implementation and verification before this
release work resumed. Its uncommitted diff was retained. This task completed
the package identity and lockfile, version, beta manifest, `NOTICE`, package
assets and `prepack` copy, channel-aware npm version probe, current command
guidance, and local publish instructions. `prepack` copies assets only; tests
and build run once before packing. The official `publish.yml` repository guard
remains in place. No commit, git tag, push, global install, or npm publication
was made.

Final artifacts:

- `artifacts/npm/mokshaall-trellis-core-0.6.18-beta.0.tgz`
- `artifacts/npm/mokshaall-trellis-0.6.18-beta.0.tgz`

`pnpm install --frozen-lockfile`, build, root typecheck and lint passed. Full
core tests: 399 passed, 1 existing skip; full CLI tests: 1572 passed. CLI
tests were run again after the last template wording edits (1572 passed).
The final two runtime-message edits passed CLI typecheck and lint plus their
33 targeted registry-config/channel-guard tests; both release scripts passed
`node --check` and the changed shell script passed `bash -n`. Evidence logs
are under `/private/tmp/trellis-npm-beta-check/` (`build-final.log`,
`typecheck.log`, `lint.log`, `test.log`, `cli-test-after-templates.log`,
`cli-typecheck-final.log`, `cli-lint-final.log`, `targeted-final.log`,
`core-tar-list.txt`, `cli-tar-list.txt`, `publish-*-dry.log`). The earlier
five-platform task's CPython 3.9.6 compile evidence remains applicable; no
Python source changed here.

Both final tarballs contain README, LICENSE, COPYRIGHT, NOTICE and the expected
package version; neither contains private task/workspace state, dotenv, npmrc, log, Python
cache, or macOS metadata paths. The 643-file CLI tarball has exactly one bin,
`moksha-trellis`, and pins `@mokshaall/trellis-core` to `0.6.18-beta.0`; core
has 233 files. `release-preflight check-versions`, `npm-tag` (`beta`), and
`verify-packed-cli` passed. Both `npm publish --dry-run` commands reported
public `beta` publication.

Both final tarballs were installed together outside the repository at
`/private/tmp/trellis-npm-beta-smoke.w3H1Fi/prefix-final2`. A fresh temporary
project initialized all five platforms; `platforms --json` returned exactly
Claude Code, Codex, Cursor, Pi, and dsh. `update`, `update --dry-run`,
`upgrade --dry-run`, `--version`, `--help`, `mem list`, and `workflow --list`
ran from the isolated prefix. The installed bin directory contains only
`moksha-trellis`; update reported “Already up to date”, and upgrade planned
`npm install -g @mokshaall/trellis@beta`. The npm registry response was mocked
to `0.6.18-beta.0` because the beta is not yet published; the fetch log proves
both update probes used `https://registry.npmjs.org/@mokshaall/trellis/beta`.
The workflow list displayed the bundled `native` template and an expected
offline marketplace warning. Smoke outputs remain under the temp directory.

For actual publication, follow `.trellis/spec/cli/backend/release-process.md`
“Personal fork: local beta tarballs”. On this workstation use a temporary
`NPM_CONFIG_CACHE` because the default `~/.npm` cache is unwritable. Authenticate
through npm's prompts, publish core first, wait for `@mokshaall/trellis-core@beta`
to resolve to `0.6.18-beta.0`, then publish CLI; each publish requires its own
OTP. No provenance is requested.
