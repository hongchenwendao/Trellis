<p align="center">
<picture>
<source srcset="assets/trellis.png" media="(prefers-color-scheme: dark)">
<source srcset="assets/trellis.png" media="(prefers-color-scheme: light)">
<img src="assets/trellis.png" alt="Trellis Logo" width="500" style="image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;">
</picture>
</p>

<p align="center">
<strong>An out-of-the-box engineering framework for AI coding.</strong><br/>
<sub>AI writes code fast, but every session it starts from scratch — no memory of your project, your conventions, or your team's requirements. Trellis persists specs, tasks, and memory into your repo, so any coding agent works to your engineering standards.</sub>
</p>

<p align="center">
<a href="./README_CN.md">简体中文</a> •
<a href="https://docs.trytrellis.app/">Upstream Docs</a> •
<a href="#quick-start">Quick Start</a> •
<a href="#supported-platforms">Supported Platforms</a> •
<a href="https://docs.trytrellis.app/start/real-world-scenarios">Use Cases</a>
</p>

<p align="center">
<a href="https://www.npmjs.com/package/@mokshaall/trellis"><img src="https://img.shields.io/npm/v/@mokshaall/trellis.svg?style=flat-square&color=2563eb" alt="npm version" /></a>
<a href="https://github.com/hongchenwendao/Trellis/blob/personal/LICENSE"><img src="https://img.shields.io/badge/license-AGPL--3.0-16a34a.svg?style=flat-square" alt="license" /></a>
<a href="https://github.com/hongchenwendao/Trellis"><img src="https://img.shields.io/badge/fork-hongchenwendao%2FTrellis-181717?style=flat-square" alt="fork" /></a>
<a href="https://github.com/mindfold-ai/Trellis"><img src="https://img.shields.io/badge/upstream-mindfold--ai%2FTrellis-blue?style=flat-square" alt="upstream" /></a>
<a href="https://docs.trytrellis.app/"><img src="https://img.shields.io/badge/docs-upstream-0f766e?style=flat-square" alt="upstream docs" /></a>
</p>

<p align="center">
<img src="assets/trellis-demo.gif" alt="Trellis workflow demo" width="100%">
</p>

## Why Trellis?

| Capability | What it changes |
| --- | --- |
| **Auto-injected specs** | Write conventions once in `.trellis/spec/`, then let Trellis inject the relevant context into each session instead of repeating yourself. |
| **Task-centered workflow** | Keep PRDs, implementation context, review context, and task status in `.trellis/tasks/` so AI work stays structured. |
| **Project memory** | Journals in `.trellis/workspace/` preserve what happened last time, so each new session starts with real context. |
| **Team-shared standards** | Specs live in the repo, so one person's hard-won workflow or rule can benefit the whole team. |
| **Multi-platform setup** | Bring the same Trellis structure to 5 AI coding platforms instead of rebuilding your workflow per tool. |

## Supported Platforms

This personal fork supports only these installation adapters:

| Platform | ID | Init flag |
| --- | --- | --- |
| Claude Code | `claude-code` | `--claude` |
| Codex | `codex` | `--codex` |
| Cursor | `cursor` | `--cursor` |
| Pi Agent | `pi` | `--pi` |
| DeepSeek Harness | `dsh` | `--dsh` |

Pi Agent is not Oh My Pi (`omp`). Shared specs, tasks, skills and workflows
remain available. Codex keeps its auto/inline modes; dsh uses the inline route.

Updates maintain the supported adapters and shared content. Existing retired
adapter files are left unchanged, not uninstalled. Projects containing only
retired adapters must add a supported platform before updating. Removal commands
stop if retired managed assets prevent safe cleanup. Historical session readers
remain available independently of installation support, so existing logs can
still be searched.

## Prerequisites:

- **Node.js** >= 18
- **Python** >= 3.9

## Quick Start

```bash
# 1. Install this fork
npm install -g @mokshaall/trellis@beta

# 2. Initialize your project with the platforms you use
cd /path/to/your-project
moksha-trellis init --claude --codex --cursor --pi --dsh -u your-name

# 3. Update that project later
moksha-trellis update
```

`moksha-trellis` is the only terminal command this fork installs; `trellis` and
`tl` are not provided. Pass only the platform flags you need. The upstream
`@mindfoldhq/trellis` package and the linked online docs, `docs-site` and
`marketplace` submodules are upstream resources; their platform lists may
differ. Use the table above for this fork's support boundary.

## How to Use

The workflow is simple:

1. **Describe what you want** in natural language.
2. **Brainstorm** with the AI one question at a time until the PRD is clear, then implementation begins.
3. **Let it run** — the AI calls Trellis Implement and auto-checks the result against specs, lint, type-check, and tests.
4. **Type `/trellis:finish-work`** when the work is done or the session context fills up. Trellis archives the task and updates journals.

## How It Works

Trellis runs a 4-phase loop with auto-invoked skills and sub-agents:

1. **Plan** — `trellis-brainstorm` walks through requirements one question at a time and writes `prd.md`. Research-heavy items go to a `trellis-research` sub-agent. The result is curated specs + research files referenced from `implement.jsonl` / `check.jsonl`.
2. **Implement** — a `trellis-implement` sub-agent writes code from the PRD with the curated context auto-injected, no git commit.
3. **Verify** — a `trellis-check` sub-agent reviews the diff against specs and runs lint, type-check, and tests, self-fixing where it can.
4. **Finish** — a final check runs, then `trellis-update-spec` promotes new learnings back into `.trellis/spec/` so the next session starts smarter.

## Resources

| Need                            | Link                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------ |
| Use this local fork in a repo | [Quick Start](#quick-start) |
| Check this fork's platform support | [Supported Platforms](#supported-platforms) |
| See the workflow in practice    | [Real-World Scenarios](https://docs.trytrellis.app/start/real-world-scenarios) |
| Start from spec templates       | [Spec Templates](https://docs.trytrellis.app/templates/specs-index)            |
| Track releases                  | [Changelog](https://docs.trytrellis.app/changelog)                             |

## FAQ

<details>
<summary><strong>How is Trellis different from <code>CLAUDE.md</code>, <code>AGENTS.md</code>, or <code>.cursorrules</code>?</strong></summary>

Those files are useful entry points, but they tend to become monolithic. Trellis adds scoped specs, task PRDs, workflow gates, workspace memory, and platform-aware generated files around them.

</details>

<details>
<summary><strong>Is Trellis only for Claude Code?</strong></summary>

No. Trellis is a project layer that works across multiple coding agents and IDEs.

</details>

<details>
<summary><strong>Is Trellis for solo developers or teams?</strong></summary>

Both. Solo developers use it for memory and repeatable workflow. Teams get the larger benefit: shared standards, task boundaries, reviewable context, and platform portability.

</details>

<details>
<summary><strong>Do I have to write every spec file manually?</strong></summary>

No. Many teams start by letting AI draft specs from existing code and then tighten the important parts by hand. Trellis works best when you keep the high-signal rules explicit and versioned.

</details>

<details>
<summary><strong>Can teams use this without constant conflicts?</strong></summary>

Yes. Personal workspace journals stay separate per developer, while shared specs and tasks stay in the repo where they can be reviewed and improved like any other project artifact.

</details>

<details>
<summary><strong>Can I temporarily compare a project with and without Trellis?</strong></summary>

Yes. `trellis ablate` temporarily removes all supported project-owned Trellis
surfaces after creating a verified recovery transaction outside the project.
Start a fresh agent session for the comparison, then run `trellis restore` to
recover the exact prior state. Use `--dry-run` to preview either operation.
The private recovery transaction includes exact `.trellis` task, spec, and
workspace bytes, which may contain user-authored sensitive text, and is kept
until restore verifies successfully.

This is different from `trellis uninstall` (permanent removal) and
`TRELLIS_HOOKS=0` (hooks only). Ablation does not launch agents, manage
worktrees, hide Git changes, or remove the global CLI, channel logs, or host
transcripts. If a managed path changes while ablated, restore refuses all
writes until the conflict is resolved.

</details>

## Star History

[![Star History Chart](https://star-history.dera.page/svg?repos=mindfold-ai/Trellis&type=Date)](https://star-history.dera.page/#mindfold-ai/Trellis&Date)

## Community & Resources

- [Official Docs](https://docs.trytrellis.app/)
- [GitHub Issues](https://github.com/mindfold-ai/Trellis/issues)
- [Discord](https://discord.com/invite/tWcCZ3aRHc)
- [Tech Blog](https://docs.trytrellis.app/blog)

<p align="center">
<a href="https://github.com/mindfold-ai/Trellis">Official Repository</a> •
<a href="https://github.com/mindfold-ai/Trellis/blob/main/LICENSE">AGPL-3.0 License</a> •
Built by <a href="https://github.com/mindfold-ai">Mindfold</a>
</p>
