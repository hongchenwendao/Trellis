# Personal npm beta release for the fork

## Goal

Produce the first publishable beta release of this personal Trellis fork as two
npm packages under the `mokshaall` scope, with a single terminal command, using
a local-tarball publish path that does not add CI publishing.

## Confirmed decisions (already settled by the user — do not re-litigate)

| Item | Decision |
|---|---|
| Main package | `@mokshaall/trellis` |
| Core package | `@mokshaall/trellis-core` |
| npm user | `mokshaall` |
| Only terminal command | `moksha-trellis` — no `trellis`, no `tl` alias |
| Branch | `personal` |
| First version | `0.6.18-beta.0` on both packages, npm dist-tag `beta` |
| Publish mechanism | Local tarballs published by the operator; no new CI, no cloud provenance |
| Existing `.trellis/`, slash commands, skill names, agent names | Preserved unchanged |
| License/copyright | Original materials kept, fork modification notice added, both present in installed artifacts |

**Environment facts verified during this planning turn**

- Repositories: origin `hongchenwendao/Trellis`, upstream `mindfold-ai/Trellis`; both public (HTTP 200).
- npm identity: `npm whoami` → `mokshaall`; 2FA mode `auth-and-writes` (OTP required at publish).
- Both scoped names are unpublished today (`E404` for `@mokshaall/trellis`, `@mokshaall/trellis-core`, and the user scope).
- Local npm 10.9.8 / pnpm 10.32.1 / Node 22.22.3; `pnpm install --frozen-lockfile` succeeds.
- `pnpm build` succeeds; the packed CLI currently contains 829 files.

## Dependencies and ordering

This task **must not modify code until `10-27-personal-five-platforms` has
delivered**. The two tasks share `package.json`, `pnpm-workspace.yaml`, the CLI
entry point, `session_context.py` (template + dogfood twin), `upgrade.ts`, tests
and release scripts. Planning is complete now; implementation starts from the
platform-pruned state and re-verifies every finding below against that state.

## Requirements

- R1: Rename both packages to the `mokshaall` scope and update every internal
  reference that names them: root workspace scripts, CLI `package.json`
  dependency (`workspace:*` stays as the source spec), the 26
  `@mindfoldhq/trellis-core` imports in CLI source, build/release tooling
  (`release-preflight.js`, `bump-versions.js`, `check-manifest-continuity.js`,
  `create-manifest.js`, `release.js`), `.github/workflows/{ci,publish}.yml`,
  `lintstagedrc`, `eslint`/workspace filters, and tests that assert the package
  name.
- R2: Rename the bin entry to `moksha-trellis` only. Remove `tl` and `trellis`
  from `bin`. Keep the capability `tl mem …` references only where they are
  historical records (migration manifests, changelogs, archived tasks).
- R3: Make update/upgrade stay on the personal line:
  - `upgrade.ts` derives its command from `PACKAGE_NAME`, so the npm global
    install target becomes `@mokshaall/trellis@beta` automatically — confirm by
    test, and fix the binary-check strings (`which trellis` → `moksha-trellis`).
  - `update.ts`'s registry probe already uses `PACKAGE_NAME`; confirm it queries
    the new scope and never falls back to the official one.
  - `session_context.py` `_PACKAGE_NAME` and its `["trellis", "--version"]`
    subprocess must use the new name/binary, in **both** the template and the
    byte-identical dogfood `.trellis/scripts/` twin (the parity test enforces
    this).
  - Current-facing install instructions (READMEs, `dsh/DSH.md`, bundled skills'
    current guidance) must say `npm install -g @mokshaall/trellis@beta` and
    `moksha-trellis …`. Historical changelogs, migration manifests and archived
    tasks keep their original text — no mechanical replacement.
- R4: Establish a minimal personal publish path that reuses existing build and
  check tooling and never commits, tags, or pushes. The official `release.js`
  flow is not used.
- R5: First release is `0.6.18-beta.0` for both packages, with npm tag `beta`.
  Versions must match exactly, and the packed CLI must pin
  `@mokshaall/trellis-core@0.6.18-beta.0`.
- R6: Inspect the real packed artifacts and prove they contain the license and
  copyright materials and contain no private state (workspace journals,
  `.trellis/tasks`, runtime markers, credentials, logs, local settings).
- R7: Validate the **actual built tarballs** — not throwaway test packages — by
  installing them outside the source tree, initializing a project, and running
  an update.
- R8: Document the local publish prerequisites: exact commands, OTP handling,
  provenance stance (no cloud provenance in this path), and the note that the
  existing `publish.yml` will not cover the `mokshaall` scope.

## Acceptance criteria

- [ ] AC1 (R1): No remaining `@mindfoldhq` reference in any file that a user or
  a build actually consumes; every occurrence left is provably historical.
- [ ] AC2 (R2): Global install exposes exactly `moksha-trellis`; `trellis` and
  `tl` are absent; `--version` and `--help` work.
- [ ] AC3 (R3): On a beta install, `upgrade --dry-run` prints
  `npm install -g @mokshaall/trellis@beta`, `update` reports the personal
  registry version, and the session-start update hint invokes the new binary.
- [ ] AC4 (R4): The documented publish path is local, deterministic, performs no
  git write, reuses existing checks, and its dry-run/OTP steps match what the
  operator will run.
- [ ] AC5 (R5): Both tarballs report `0.6.18-beta.0`; packed CLI dependency is
  the exact matching version; the dist-tag used is `beta`.
- [ ] AC6 (R6): Tarball listings show the license, README and a fork
  modification notice, and no private/task/credential/log paths.
- [ ] AC7 (R7): From a directory outside the repo, a global install of the two
  real tarballs initializes each retained platform, `moksha-trellis update`
  reports up-to-date, and `upgrade` targets the personal package.
- [ ] AC8 (R8): The publish instructions state exactly what is required locally
  (auth/OTP, order core → CLI, dist-tag, no provenance) and why CI is not
  involved.

## Out of scope

- Commits, tags, pushes, npm publication, or any remote write in this turn.
- Changing the five-platform scope, workflows, skill/agent names, or `.trellis/`
  layout.
- Adding a GitHub Actions publish workflow for the new scope.
- Cloud provenance / attestations.
- Freezing a stable (`latest`) release.
