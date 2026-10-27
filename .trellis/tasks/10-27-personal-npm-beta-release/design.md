# Personal npm beta release — design

Status: implemented after `10-27-personal-five-platforms` delivered. The
execution evidence and the few plan adjustments are in `implement.md`.

## 1. Package identity and dependency graph

| File | Change |
|---|---|
| `packages/cli/package.json` | `name` → `@mokshaall/trellis`; `bin` → `{ "moksha-trellis": "./bin/trellis.js" }` (no `trellis`, no `tl`); dependency → `@mokshaall/trellis-core: workspace:*`; `repository`/`homepage` → `github.com/hongchenwendao/Trellis` |
| `packages/core/package.json` | `name` → `@mokshaall/trellis-core`; drop `publishConfig.provenance`; `repository` → fork |
| root `package.json` | all `pnpm --filter @mindfoldhq/...` scripts → new names |
| `.lintstagedrc`, `.github/workflows/{ci,publish}.yml` | same rename |
| `packages/cli/src/**/*.ts` (26 imports), tests, scripts | `@mindfoldhq/trellis-core` → `@mokshaall/trellis-core` |

`src/constants/version.ts` derives `PACKAGE_NAME` from `package.json`, so
`upgrade.ts` and `update.ts` follow automatically. The packed CLI's
`workspace:*` is rewritten by `pnpm pack` to the exact version — verified today
on the current tree (packed dep became `0.6.17`).

**Rename method:** a scripted, file-scoped replacement, then
`git grep -n '@mindfoldhq'` must return only historical records (migration
manifests, changelogs, archived tasks, `.trellis/` history).

## 2. Single terminal command

- `bin/trellis.js` file path stays (no reason to rename the file); the exposed
  command is `moksha-trellis` only.
- `cli/index.ts`: `.name("moksha-trellis")`.
- `upgrade.ts`: `binaryCheckCommand` → `which|where moksha-trellis`; success hint
  → `moksha-trellis --version`; install target stays derived from
  `PACKAGE_NAME` (now `@mokshaall/trellis@beta` on a beta install).
- Current-facing diagnostics that tell users to type `trellis …`:
  `cli/index.ts` (`update`/`upgrade` hints), `ablate.ts`, `workflow.ts`,
  `update.ts`. Historical changelog text is not touched.
- `templates/trellis/scripts/common/session_context.py`: `_PACKAGE_NAME` and the
  probe `subprocess.run(["trellis", "--version"])` → `moksha-trellis`; hint text
  `run trellis update` → `run moksha-trellis update`. **Both** the template and
  the byte-identical dogfood `.trellis/scripts/` copy (the parity test fails
  otherwise).
- Templates and bundled skills: only command-position occurrences change —
  `trellis init|update|upgrade|channel|mem|workflow|uninstall|ablate|restore|
  platforms` → `moksha-trellis …`. Never touch `.trellis/…` paths, `trellis-*`
  skill/agent names, `/trellis:…` slash commands, `Trellis` the product, or
  `packages/cli/src/templates/trellis/` path text.
- Preserved on purpose: `.trellis/`, slash commands, skill names, agent names.

## 3. Version, tag, manifest

- `node packages/cli/scripts/bump-versions.js beta` from `0.6.17` yields
  `0.6.18-beta.0` for both packages (existing, deterministic, no git side
  effects). Abort if the base version has moved.
- npm dist-tag `beta`; git tag is **not** created (local publish path).
- Add `src/migrations/manifests/0.6.18-beta.0.json` with empty migrations so the
  personal update chain is well-formed. `create-manifest.js` guards against
  overwriting published versions by querying npm; for the new scope it 404s and
  fails open.
- The official `check-manifest-continuity` currently fails on `personal`
  because upstream's `0.7.0-beta.4` manifest is absent here. That gate belongs
  to the upstream release line; it is **not** part of the personal beta path and
  is not "fixed" by borrowing upstream state.

## 4. License and modification notice (AGPL §5)

- Keep root `LICENSE` (AGPL-3.0-only) and `COPYRIGHT` (Mindfold LLC) unchanged.
- Add root `NOTICE`: identifies the work as a modified fork, states the
  modification date and the changes (platform reduction; `@mokshaall` scope;
  `moksha-trellis` command), preserves the original copyright, and signs the
  modification notice as `mokshaall`.
- Packaging is explicit, not implicit:
  - move the copy step from `prepublishOnly` to `prepack` (verified: `pnpm pack`
    and `npm pack` run `prepack`; neither runs `prepublishOnly`; publishing a
    tarball runs no lifecycle scripts);
  - `prepack` only copies `README.md`, `LICENSE`, `COPYRIGHT`, `NOTICE` into each
    package dir; the separate release check runs build and tests once before
    packing; `files` lists the copied assets;
  - add those four paths to `.gitignore` so the copies never show as dirty.
- Verified packaging facts: npm auto-includes only the package-dir
  `LICENSE`/`README.md` (not workspace-root ones); pnpm happens to include the
  workspace-root `LICENSE`; neither includes root `README`/`COPYRIGHT`/`NOTICE`.
  The explicit copy removes that packer-dependent behavior.

## 5. Provenance and publish-branch constraints (verified locally)

- **Provenance cannot be generated locally.** npm throws `EUSAGE` —
  "Automatic provenance generation not supported for provider: …" — outside
  GitHub Actions / GitLab CI. Therefore `publishConfig.provenance` must be
  removed (core) and never set (CLI); the personal commands pass
  `--no-provenance`.
- **`pnpm publish` has git gates:** dirty tree → `ERR_PNPM_GIT_UNCLEAN`; branch
  `personal` ≠ default `master|main` → interactive prompt. CI bypasses this with
  `--no-git-checks`.
- **`npm publish <tarball>` has no git checks at all**, so the personal path
  uses tarballs and keeps branch/clean-tree as deliberate preflight gates rather
  than packer gates.
- npm account `mokshaall` has `auth-and-writes` 2FA → every publish needs
  `--otp`. `@mokshaall` is the user scope, so no org setup is required.
- `.github/workflows/publish.yml` is the original official workflow and sets
  `NPM_CONFIG_PROVENANCE=true`. It gains one job-level guard,
  `if: github.repository == 'mindfold-ai/Trellis'`, so it only runs on the
  official repository. No CI publish capability is added for the personal
  scope; the workflow's package names are left as-is because it no longer runs
  here.

## 6. Artifact verification and out-of-tree test

No new verification tool. Existing tooling covers both checks:

- Contents: `npm pack --dry-run --json` (file allowance/exclusion) and
  `tar -tzf <tarball>` (actual artifact). Expected: `package/package.json`,
  `package/bin/trellis.js`, `package/dist/**`, `package/LICENSE`,
  `package/README.md`, `package/COPYRIGHT`, `package/NOTICE`; absent:
  `__pycache__`, `*.pyc`, `.DS_Store`, `.trellis/` task/workspace data, `*.log`,
  `.env*`.
- Dependency pin: existing `release-preflight verify-packed-cli` (its hardcoded
  `@mindfoldhq/trellis-core` literal updated).
- Version match: existing `release-preflight check-versions`.
- Out-of-tree test uses **these real tarballs**:
  - `npm install -g --prefix <tmp>/prefix <core.tgz> <cli.tgz>` (verified today
    that two interdependent tarballs install together without registry access,
    and only `moksha-trellis` lands in `bin/`);
  - fresh temp project: `moksha-trellis init -u test -y --claude --codex
    --cursor --pi --dsh`, check generated files and `platforms --json`;
  - `moksha-trellis update` (no-op, up to date), `update --dry-run`;
  - `moksha-trellis upgrade --dry-run` → `npm install -g @mokshaall/trellis@beta`;
  - smoke: `--version`, `mem list`, `workflow --list`.
  - PATH is pinned to the temp prefix's bin so no existing official `trellis`
    can be picked up.

## 7. Personal publish path (no commit/tag/push)

```bash
# preflight (repo root, branch personal, clean tree)
pnpm install --frozen-lockfile
pnpm typecheck && pnpm lint
pnpm build
pnpm test

mkdir -p artifacts/npm
(cd packages/core && pnpm pack --pack-destination ../../artifacts/npm)
(cd packages/cli  && pnpm pack --pack-destination ../../artifacts/npm)

node packages/cli/scripts/release-preflight.js check-versions
node packages/cli/scripts/release-preflight.js verify-packed-cli

# dry-run, then real publish (operator, core first)
npm publish artifacts/npm/mokshaall-trellis-core-0.6.18-beta.0.tgz \
  --tag beta --access public --no-provenance --dry-run
npm publish artifacts/npm/mokshaall-trellis-core-0.6.18-beta.0.tgz \
  --tag beta --access public --no-provenance
npm view @mokshaall/trellis-core@beta version --registry=https://registry.npmjs.org/
npm publish artifacts/npm/mokshaall-trellis-0.6.18-beta.0.tgz \
  --tag beta --access public --no-provenance
```

`artifacts/` is gitignored. No `release.js`, no tag, no push.

## 8. Decisions confirmed by the user

1. Package metadata: `repository`/`homepage` point at the fork
   (`github.com/hongchenwendao/Trellis`); install instructions use the
   `@mokshaall` names and `moksha-trellis`.
2. READMEs: replace official-npm badges/links with the new package URLs and the
   `moksha-trellis` quick start; historical text untouched.
3. `publish.yml`: restrict execution to the official repository only; no new CI
   publishing capability for the personal scope.
4. NOTICE modification notice signed `mokshaall`.
5. No SHA256SUMS and no duplicated hash verification; no new verification tool
   when existing tooling already covers the check.
