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

## Stable 0.6.18 follow-up — local preparation (2026-10-27)

The user subsequently authorized GitHub push and npm publication. The main
agent owns the commit, push, and live npm publish; this section records local
release preparation only. The beta pair is already published, and `0.6.18`
was confirmed unoccupied on npm before version preparation.

- Promoted both package versions from `0.6.18-beta.0` to `0.6.18`; the CLI
  source dependency remains `workspace:*`, and the packed CLI pins core to
  exactly `0.6.18`. `release-preflight` reports matching versions and npm tag
  `latest`. No lockfile dependency upgrade was needed.
- Added `src/migrations/manifests/0.6.18.json` with round-two workflow
  guidance, `breaking: false`, and no automatic file migration. Updated the
  current English and Chinese README install commands to untagged
  `npm install -g @mokshaall/trellis`; updated the personal release spec to
  the stable tarballs and `latest` publish sequence while retaining the beta
  as release history.
- New local artifacts are
  `artifacts/npm/mokshaall-trellis-core-0.6.18.tgz` and
  `artifacts/npm/mokshaall-trellis-0.6.18.tgz`. The old beta tarballs remain
  beside them. Actual tarballs and `npm pack --dry-run --json` each report
  233 core files and 644 CLI files. Both include README, LICENSE, COPYRIGHT,
  NOTICE, and no private task/workspace, credential, log, or cache paths.
  The CLI has only the `moksha-trellis` bin and contains the new workflow,
  check/continuation templates, and stable manifest. Both `npm publish
  --dry-run` commands report public `latest` publication.
- `pnpm build`, CLI typecheck and lint passed. Targeted update, upgrade, and
  migration suites passed: 87 tests. The prior round-two full CLI run passed
  1596 tests; it was not repeated for the version/packaging-only change.
- The final stable tarballs were installed together into
  `/private/tmp/trellis-stable-smoke.PY0dUL/prefix` without touching the
  linked global CLI. Fresh five-platform init, `platforms --json`, update,
  update dry-run, version/help, and `upgrade --dry-run` passed. The only bin
  was `moksha-trellis`; upgrade targets `@mokshaall/trellis@latest`. A project
  initialized from the published beta tarballs then updated with the stable
  tarball CLI from `0.6.18-beta.0` to `0.6.18`; a user-edited skill and
  user-owned workspace file survived. The registry version responses in
  these offline smoke runs were mocked; fetch logs confirm the stable CLI
  queried the personal package's `/latest` endpoint.

Logs and pack inventories: `/private/tmp/trellis-npm-stable-verify/`,
`/private/tmp/trellis-npm-stable-{build,targeted,typecheck,lint}.log`, and
`/private/tmp/trellis-stable-smoke.PY0dUL/`. Stable publication and remote
visibility remain for the main agent.

## Patch 0.6.19 follow-up — local preparation (2026-10-27)

The user authorized third-round implementation and subsequent GitHub/npm
release. The main agent owns the commit, push, and live publication. It
confirmed both published packages still pointed to `0.6.18` and version
`0.6.19` was unoccupied before this preparation.

- Bumped both packages to `0.6.19`; the CLI source dependency remains
  `workspace:*`, while the final CLI tarball pins core exactly to `0.6.19`.
  `release-preflight check-versions` and `npm-tag` report a matching pair and
  `latest`. The lockfile required no dependency/version edit.
- Added `src/migrations/manifests/0.6.19.json`: shorter execution reminders,
  targeted recovery of missing/truncated context, named missing/rejected
  file and directory notices, and Pi realpath containment. It has no
  automatic deletion or migration; pristine managed templates update normally,
  while local edits retain the standard conflict protection. The personal
  release spec now shows `0.6.19` tarballs and `latest`. The README's untagged
  stable install command was already correct and was left unchanged.
- Final local artifacts are
  `artifacts/npm/mokshaall-trellis-core-0.6.19.tgz` and
  `artifacts/npm/mokshaall-trellis-0.6.19.tgz`; prior beta/stable tarballs
  remain. Actual tarballs and `npm pack --dry-run --json` report 233 core and
  645 CLI files. Both include README, LICENSE, COPYRIGHT, NOTICE and exclude
  private task/workspace state, credentials, logs, and caches. The CLI has
  only the `moksha-trellis` bin and includes the shortened workflow reminder,
  Pi agent/extension, shared-hook directory notices, and `0.6.19` manifest.
  Both `npm publish --dry-run` commands report public `latest` publication.
- The third-round product owner reported a full CLI suite of 1606 passing
  tests plus build, lint, TS typecheck, and Python checks before the last
  directory-notice correction. After that correction, it reported 96 focused
  passing tests and clean lint/typecheck/Python checks. This release task ran
  `pnpm build` before the correction, 87 version/update/upgrade/manifest
  tests, then packed the final CLI dist supplied by that owner; it did not
  repeat the full suite. The main agent will run commit-time gates.
- The final pair was installed only into
  `/private/tmp/trellis-npm-0619-smoke.awKKmY/prefix-new`. Fresh five-platform
  init, `platforms --json`, update and dry-run, `--version`, `--help`, and
  `upgrade --dry-run` passed; upgrade plans
  `npm install -g @mokshaall/trellis@latest`. A separate project initialized
  with the actual `0.6.18` tarballs updated to `0.6.19`; a user-edited Pi
  agent and user-owned workspace file survived, while pristine workflow and
  shared hooks received the new content. The smoke registry response was
  mocked because `0.6.19` is not yet published; its requests used the personal
  `/latest` endpoint.

Build/targeted logs: `/private/tmp/trellis-npm-0619-{build,targeted}.log`.
Pack lists and publish dry-run logs:
`/private/tmp/trellis-npm-0619-verify/`. Isolated install/smoke outputs:
`/private/tmp/trellis-npm-0619-smoke.awKKmY/`. Live npm publication and
registry verification remain for the main agent.
