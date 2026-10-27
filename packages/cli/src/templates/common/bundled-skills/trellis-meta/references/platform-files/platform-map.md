# Platform File Map

This page locates the five AI integrations supported by this Trellis fork. A user project contains only the directories selected by `moksha-trellis init`; older projects may also retain files from retired integrations. Those files are not automatically removed by `moksha-trellis update`.

| Platform | Init flag | Main directory | Skill directory | Agent directory | Hooks/extensions |
| --- | --- | --- | --- | --- | --- |
| Claude Code | `--claude` | `.claude/` | `.claude/skills/` | `.claude/agents/` | `.claude/hooks/` + `.claude/settings.json` |
| Codex | `--codex` | `.codex/` | `.agents/skills/` | `.codex/agents/` | `.codex/hooks/` + `.codex/hooks.json` |
| Cursor | `--cursor` | `.cursor/` | `.cursor/skills/` | `.cursor/agents/` | `.cursor/hooks.json` + `.cursor/hooks/` |
| Pi Agent | `--pi` | `.pi/` | `.agents/skills/` | `.pi/agents/` | `.pi/extensions/trellis/` + `.pi/settings.json` |
| DeepSeek Harness (dsh) | `--dsh` | `.dsh/` | `.agents/skills/` + `.dsh/skills/` entry skills | None; implement/check run inline | None; context is loaded by skills |

Pi Agent is not Oh My Pi: `.pi/` is the retained extension-backed integration. Codex uses native sub-agent context injection by default and can opt into inline mode with `codex.dispatch_mode: inline`; dsh always uses the inline workflow.

## Where to change behavior

- **Sub-agent definitions:** Claude Code, Codex, Cursor, and Pi Agent have `trellis-research`, `trellis-implement`, and `trellis-check` files in their agent directories. Pi's native `trellis_subagent` tool is implemented in `.pi/extensions/trellis/index.ts`; edit the extension for dispatch or progress behavior.
- **Shared skills:** Codex, Pi Agent, and dsh use `.agents/skills/`. dsh additionally exposes start/continue/finish entry skills under `.dsh/skills/`. Do not assume every tool reads the shared directory.
- **Main-session workflow:** `.trellis/workflow.md` is the local source of truth. For dsh and Codex inline mode, `trellis-before-dev` and `trellis-check` guide work in the main session.
- **Channel workers:** `.trellis/agents/` and `moksha-trellis channel` are a separate runtime whose providers are Claude Code and Codex. Per-platform agent files do not configure channel workers.

## Decision rules

1. If the user names one platform, inspect its actual settings, agent, skill, hook, command, or extension files before editing. Change shared workflow/spec files too only when the behavior is shared.
2. If the user requests a change across all configured platforms, synchronize equivalent entry points; editing one directory is not enough.
3. For project rules, prefer `.trellis/spec/` or a project-local skill.
4. If a path in this map disagrees with the user's project, follow the actual configured hook, command, and agent files. Preserve custom files and retired integration assets unless the user separately authorizes their removal.
