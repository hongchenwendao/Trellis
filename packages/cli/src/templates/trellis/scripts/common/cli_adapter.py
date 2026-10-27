"""CLI and project-path conventions for the five supported AI hosts.

The installation registry lives in the TypeScript CLI. This helper is the
Python-facing path/command API used by project scripts and local extensions.
Claude Code uses the historical internal name ``claude``; the public platform
ID and installation flag remain ``claude-code`` and ``--claude``.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path
from typing import Literal

Platform = Literal["claude", "codex", "cursor", "pi", "dsh"]
_SUPPORTED_PLATFORMS: tuple[Platform, ...] = ("claude", "codex", "cursor", "pi", "dsh")
_CONFIG_DIRS: dict[Platform, str] = {
    "claude": ".claude",
    "codex": ".codex",
    "cursor": ".cursor",
    "pi": ".pi",
    "dsh": ".dsh",
}
# Passive signals only: a retired-only project with shared .agents/skills must
# not be mistaken for a Codex-only project. No adapter is installed for these.
_RETIRED_CONFIG_DIRS = (
    ".opencode", ".iflow", ".kilocode", ".kiro", ".gemini", ".agent",
    ".devin", ".windsurf", ".qoder", ".codebuddy", ".github/copilot",
    ".factory", ".trae", ".omp", ".grok", ".kimi-code", ".reasonix",
    ".zcode", ".snow",
)
_ALL_PLATFORM_CONFIG_DIRS = (*_CONFIG_DIRS.values(), *_RETIRED_CONFIG_DIRS)


@dataclass
class CLIAdapter:
    """Paths and CLI commands for one supported AI host."""

    platform: Platform

    def get_agent_name(self, agent: str) -> str:
        """Return the configured agent name (no retained host renames it)."""
        return agent

    @property
    def config_dir_name(self) -> str:
        """Return the host's project configuration directory."""
        return _CONFIG_DIRS[self.platform]

    def get_config_dir(self, project_root: Path) -> Path:
        """Return the host's project configuration directory path."""
        return project_root / self.config_dir_name

    def get_agent_path(self, agent: str, project_root: Path) -> Path:
        """Return a Trellis sub-agent definition path, when the host has one."""
        if self.platform == "dsh":
            raise ValueError("DSH runs Trellis implement/check inline; it has no agent definitions")
        suffix = ".toml" if self.platform == "codex" else ".md"
        return self.get_config_dir(project_root) / "agents" / f"{self.get_agent_name(agent)}{suffix}"

    def get_commands_path(self, project_root: Path, *parts: str) -> Path:
        """Return a host command path, preserving Cursor/Pi layout."""
        if self.platform in ("pi", "dsh"):
            root = self.get_config_dir(project_root) / ("prompts" if self.platform == "pi" else "skills")
            if not parts:
                return root
            if len(parts) >= 2 and parts[0] == "trellis":
                name = parts[-1].removesuffix(".md")
                if self.platform == "pi":
                    return root / f"trellis-{name}.md"
                return root / f"trellis-{name}" / "SKILL.md"
            return root / Path(*parts)

        root = self.get_config_dir(project_root) / "commands"
        if not parts:
            return root
        if self.platform == "cursor" and len(parts) >= 2 and parts[0] == "trellis":
            return root / f"trellis-{parts[-1]}"
        return root / Path(*parts)

    def get_trellis_command_path(self, name: str) -> str:
        """Return the repo-relative path of one generated Trellis command."""
        if self.platform == "cursor":
            return f".cursor/commands/trellis-{name}.md"
        if self.platform == "codex":
            return f".agents/skills/trellis-{name}/SKILL.md"
        if self.platform == "pi":
            return f".pi/prompts/trellis-{name}.md"
        if self.platform == "dsh":
            return f".dsh/skills/trellis-{name}/SKILL.md"
        return f".claude/commands/trellis/{name}.md"

    def get_non_interactive_env(self) -> dict[str, str]:
        """Return the host's established non-interactive environment flag."""
        if self.platform == "codex":
            return {"CODEX_NON_INTERACTIVE": "1"}
        if self.platform in ("claude", "cursor"):
            # Retain the historical Cursor fallback used by this Python API.
            return {"CLAUDE_NON_INTERACTIVE": "1"}
        return {}

    def build_run_command(
        self,
        agent: str,
        prompt: str,
        session_id: str | None = None,
        skip_permissions: bool = True,
        verbose: bool = True,
        json_output: bool = True,
    ) -> list[str]:
        """Build the existing headless run command for a CLI-capable host."""
        if self.platform == "dsh":
            raise ValueError("DSH runs Trellis work inline; no CLI sub-agent run is supported")
        if self.platform == "codex":
            return ["codex", "exec", prompt]
        if self.platform == "pi":
            return ["pi", "-p", prompt]

        # Claude Code's existing command remains the fallback for Cursor, whose
        # integration itself is IDE-only (supports_cli_agents is False).
        cmd = ["claude", "-p", "--agent", self.get_agent_name(agent)]
        if session_id:
            cmd.extend(["--session-id", session_id])
        if skip_permissions:
            cmd.append("--dangerously-skip-permissions")
        if json_output:
            cmd.extend(["--output-format", "stream-json"])
        if verbose:
            cmd.append("--verbose")
        cmd.append(prompt)
        return cmd

    def build_resume_command(self, session_id: str) -> list[str]:
        """Build the existing session-resume command for a CLI-capable host."""
        if self.platform == "dsh":
            raise ValueError("DSH runs Trellis work inline; no CLI sub-agent resume is supported")
        if self.platform == "codex":
            return ["codex", "resume", session_id]
        if self.platform == "pi":
            return ["pi", "-c", session_id]
        return ["claude", "--resume", session_id]

    def get_resume_command_str(self, session_id: str, cwd: str | None = None) -> str:
        """Return a display-ready resume command, optionally prefixed by cwd."""
        cmd_str = " ".join(self.build_resume_command(session_id))
        return f"cd {cwd} && {cmd_str}" if cwd else cmd_str

    @property
    def is_claude(self) -> bool:
        return self.platform == "claude"

    @property
    def is_cursor(self) -> bool:
        return self.platform == "cursor"

    @property
    def cli_name(self) -> str:
        """Return the host executable name (Cursor is IDE-only)."""
        return {"claude": "claude", "codex": "codex", "cursor": "cursor", "pi": "pi", "dsh": "dsh"}[self.platform]

    @property
    def supports_cli_agents(self) -> bool:
        return self.platform in ("claude", "codex", "pi")

    @property
    def requires_agent_definition_file(self) -> bool:
        return self.platform == "claude"

    @property
    def supports_session_id_on_create(self) -> bool:
        return self.platform == "claude"


def get_cli_adapter(platform: str = "claude") -> CLIAdapter:
    """Return a supported adapter; accept the public ``claude-code`` alias."""
    normalized = "claude" if platform == "claude-code" else platform
    if normalized not in _SUPPORTED_PLATFORMS:
        raise ValueError(f"Unsupported platform: {platform} (supported: {', '.join(_SUPPORTED_PLATFORMS)})")
    return CLIAdapter(platform=normalized)  # type: ignore[arg-type]


def _has_other_platform_dir(project_root: Path, exclude: set[str]) -> bool:
    """Check project host signals other than those in *exclude*."""
    return any((project_root / d).is_dir() for d in _ALL_PLATFORM_CONFIG_DIRS if d not in exclude)


def detect_platform(project_root: Path) -> Platform:
    """Detect a retained host from explicit context or project config paths.

    A shared skill directory alone is treated as Codex only when no other host
    directory, including a retired one, could own it.
    """
    env_platform = os.environ.get("TRELLIS_PLATFORM", "").lower()
    if env_platform == "claude-code":
        return "claude"
    if env_platform in _SUPPORTED_PLATFORMS:
        return env_platform  # type: ignore[return-value]
    if env_platform:
        raise ValueError(f"Unsupported TRELLIS_PLATFORM: {env_platform}")

    if (project_root / ".cursor").is_dir() and not (project_root / ".claude").is_dir():
        return "cursor"
    if (project_root / ".codex").is_dir() and not any(
        (project_root / d).is_dir() for d in (".claude", ".cursor", ".pi", ".dsh")
    ):
        return "codex"
    if (project_root / ".pi").is_dir():
        return "pi"
    if (project_root / ".dsh").is_dir():
        return "dsh"

    skills = project_root / ".agents" / "skills"
    if skills.is_dir() and not _has_other_platform_dir(project_root, set()):
        try:
            if any(entry.is_dir() and entry.name.startswith("trellis-") for entry in skills.iterdir()):
                return "codex"
        except OSError:
            pass
    if any((project_root / d).is_dir() for d in _RETIRED_CONFIG_DIRS):
        raise ValueError(
            "Only retired Trellis platform files were detected; choose one of "
            "claude-code, codex, cursor, pi, or dsh"
        )
    return "claude"


def get_cli_adapter_auto(project_root: Path) -> CLIAdapter:
    """Return the adapter detected from a project root."""
    return CLIAdapter(platform=detect_platform(project_root))
