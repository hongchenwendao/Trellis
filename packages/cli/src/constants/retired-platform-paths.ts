import fs from "node:fs";
import path from "node:path";

import { collectPlatformTemplates } from "../configurators/index.js";
import { getAllMigrations } from "../migrations/index.js";
import { AI_TOOLS, type AITool } from "../types/ai-tools.js";
import type { MigrationItem, TemplateHashes } from "../types/migration.js";

/**
 * Exact template-path inventory for the 17 retired installers at the fork
 * boundary. This is ownership compatibility data, not an active adapter.
 * Generated from the baseline collectPlatformTemplates() maps before removal.
 * Do not replace it with a broad directory prefix: older poisoned manifests
 * may contain user files such as .opencode/runtime-cache.db.
 */

const RETIRED_SKILL_SUFFIXES = [
  "trellis-before-dev/SKILL.md",
  "trellis-brainstorm/SKILL.md",
  "trellis-break-loop/SKILL.md",
  "trellis-channel/SKILL.md",
  "trellis-channel/references/command-reference.md",
  "trellis-channel/references/forum.md",
  "trellis-channel/references/progress-debugging.md",
  "trellis-channel/references/workers.md",
  "trellis-channel/references/workflows.md",
  "trellis-check/SKILL.md",
  "trellis-meta/SKILL.md",
  "trellis-meta/references/customize-local/add-project-local-conventions.md",
  "trellis-meta/references/customize-local/change-agents.md",
  "trellis-meta/references/customize-local/change-context-loading.md",
  "trellis-meta/references/customize-local/change-hooks.md",
  "trellis-meta/references/customize-local/change-skills-or-commands.md",
  "trellis-meta/references/customize-local/change-spec-structure.md",
  "trellis-meta/references/customize-local/change-task-lifecycle.md",
  "trellis-meta/references/customize-local/change-workflow.md",
  "trellis-meta/references/customize-local/overview.md",
  "trellis-meta/references/local-architecture/bundled-skills.md",
  "trellis-meta/references/local-architecture/context-injection.md",
  "trellis-meta/references/local-architecture/generated-files.md",
  "trellis-meta/references/local-architecture/multi-agent-channel.md",
  "trellis-meta/references/local-architecture/overview.md",
  "trellis-meta/references/local-architecture/spec-system.md",
  "trellis-meta/references/local-architecture/task-system.md",
  "trellis-meta/references/local-architecture/workflow.md",
  "trellis-meta/references/local-architecture/workspace-memory.md",
  "trellis-meta/references/platform-files/agents.md",
  "trellis-meta/references/platform-files/hooks-and-settings.md",
  "trellis-meta/references/platform-files/overview.md",
  "trellis-meta/references/platform-files/platform-map.md",
  "trellis-meta/references/platform-files/skills-and-commands.md",
  "trellis-session-insight/SKILL.md",
  "trellis-session-insight/references/cli-quick-reference.md",
  "trellis-session-insight/references/triggering-patterns.md",
  "trellis-spec-bootstrap/SKILL.md",
  "trellis-spec-bootstrap/references/mcp-setup.md",
  "trellis-spec-bootstrap/references/repository-analysis.md",
  "trellis-spec-bootstrap/references/spec-task-planning.md",
  "trellis-spec-bootstrap/references/spec-writing.md",
  "trellis-update-spec/SKILL.md",
] as const;

const RETIRED_SKILL_ROOTS = [
  ".agent/skills",
  ".agents/skills",
  ".codebuddy/skills",
  ".devin/skills",
  ".factory/skills",
  ".github/skills",
  ".grok/skills",
  ".kilocode/skills",
  ".kiro/skills",
  ".omp/skills",
  ".opencode/skills",
  ".qoder/skills",
  ".reasonix/skills",
  ".snow/skills",
  ".trae/skills",
  ".zcode/skills",
] as const;

const EXTRA_RETIRED_SKILL_PATHS = [
  ".kimi-code/skills/trellis-check/SKILL.md",
  ".kimi-code/skills/trellis-continue/SKILL.md",
  ".kimi-code/skills/trellis-finish-work/SKILL.md",
  ".kimi-code/skills/trellis-implement/SKILL.md",
  ".kimi-code/skills/trellis-research/SKILL.md",
  ".kimi-code/skills/trellis-start/SKILL.md",
  ".kiro/skills/trellis-continue/SKILL.md",
  ".kiro/skills/trellis-finish-work/SKILL.md",
  ".reasonix/skills/trellis-continue/SKILL.md",
  ".reasonix/skills/trellis-finish-work/SKILL.md",
  ".reasonix/skills/trellis-implement/SKILL.md",
  ".reasonix/skills/trellis-start/SKILL.md",
  ".snow/skills/trellis-continue/SKILL.md",
  ".snow/skills/trellis-finish-work/SKILL.md",
] as const;

const OTHER_RETIRED_TEMPLATE_PATHS = [
  ".agent/workflows/continue.md",
  ".agent/workflows/finish-work.md",
  ".agent/workflows/start.md",
  ".codebuddy/agents/trellis-check.md",
  ".codebuddy/agents/trellis-implement.md",
  ".codebuddy/agents/trellis-research.md",
  ".codebuddy/commands/trellis/continue.md",
  ".codebuddy/commands/trellis/finish-work.md",
  ".codebuddy/hooks/inject-shell-session-context.py",
  ".codebuddy/hooks/inject-subagent-context.py",
  ".codebuddy/hooks/inject-workflow-state.py",
  ".codebuddy/hooks/session-start.py",
  ".codebuddy/settings.json",
  ".devin/workflows/trellis-continue.md",
  ".devin/workflows/trellis-finish-work.md",
  ".devin/workflows/trellis-start.md",
  ".factory/commands/trellis/continue.md",
  ".factory/commands/trellis/finish-work.md",
  ".factory/droids/trellis-check.md",
  ".factory/droids/trellis-implement.md",
  ".factory/droids/trellis-research.md",
  ".factory/hooks/inject-shell-session-context.py",
  ".factory/hooks/inject-subagent-context.py",
  ".factory/hooks/inject-workflow-state.py",
  ".factory/hooks/session-start.py",
  ".factory/settings.json",
  ".gemini/agents/trellis-check.md",
  ".gemini/agents/trellis-implement.md",
  ".gemini/agents/trellis-research.md",
  ".gemini/commands/trellis/continue.toml",
  ".gemini/commands/trellis/finish-work.toml",
  ".gemini/hooks/inject-shell-session-context.py",
  ".gemini/hooks/inject-workflow-state.py",
  ".gemini/hooks/session-start.py",
  ".gemini/settings.json",
  ".github/agents/trellis-check.agent.md",
  ".github/agents/trellis-implement.agent.md",
  ".github/agents/trellis-research.agent.md",
  ".github/copilot-instructions.md",
  ".github/copilot/hooks.json",
  ".github/copilot/hooks/inject-workflow-state.py",
  ".github/copilot/hooks/session-start.py",
  ".github/hooks/trellis.json",
  ".github/prompts/continue.prompt.md",
  ".github/prompts/finish-work.prompt.md",
  ".grok/agents/trellis-check.md",
  ".grok/agents/trellis-implement.md",
  ".grok/agents/trellis-research.md",
  ".grok/commands/trellis-continue.md",
  ".grok/commands/trellis-finish-work.md",
  ".grok/commands/trellis-start.md",
  ".kilocode/workflows/continue.md",
  ".kilocode/workflows/finish-work.md",
  ".kilocode/workflows/start.md",
  ".kimi-code/agents/trellis-check.md",
  ".kimi-code/agents/trellis-implement.md",
  ".kimi-code/agents/trellis-research.md",
  ".kiro/agents/trellis-check.json",
  ".kiro/agents/trellis-implement.json",
  ".kiro/agents/trellis-research.json",
  ".kiro/agents/trellis.json",
  ".kiro/hooks/inject-subagent-context.py",
  ".kiro/hooks/inject-workflow-state.py",
  ".kiro/hooks/session-start.py",
  ".kiro/hooks/trellis-workflow-state.kiro.hook",
  ".omp/agents/trellis-check.md",
  ".omp/agents/trellis-implement.md",
  ".omp/agents/trellis-research.md",
  ".omp/commands/trellis-continue.md",
  ".omp/commands/trellis-finish-work.md",
  ".omp/extensions/trellis/index.ts",
  ".opencode/agents/trellis-check.md",
  ".opencode/agents/trellis-implement.md",
  ".opencode/agents/trellis-research.md",
  ".opencode/commands/trellis/continue.md",
  ".opencode/commands/trellis/finish-work.md",
  ".opencode/commands/trellis/start.md",
  ".opencode/lib/context-visibility.js",
  ".opencode/lib/session-utils.js",
  ".opencode/lib/trellis-context.js",
  ".opencode/package.json",
  ".opencode/plugins/inject-subagent-context.js",
  ".opencode/plugins/inject-workflow-state.js",
  ".opencode/plugins/session-start.js",
  ".qoder/agents/trellis-check.md",
  ".qoder/agents/trellis-implement.md",
  ".qoder/agents/trellis-research.md",
  ".qoder/commands/trellis-continue.md",
  ".qoder/commands/trellis-finish-work.md",
  ".qoder/hooks/inject-shell-session-context.py",
  ".qoder/hooks/inject-workflow-state.py",
  ".qoder/hooks/session-start.py",
  ".qoder/settings.json",
  ".snow/SNOW.md",
  ".snow/agents/trellis-check.md",
  ".snow/agents/trellis-implement.md",
  ".snow/agents/trellis-research.md",
  ".snow/commands/trellis-continue.json",
  ".snow/commands/trellis-finish-work.json",
  ".snow/hooks/beforeSubAgentStart.json",
  ".snow/hooks/onSessionStart.json",
  ".snow/hooks/onUserMessage.json",
  ".snow/hooks/write-trellis-context.py",
  ".trae/agents/trellis-check.md",
  ".trae/agents/trellis-implement.md",
  ".trae/agents/trellis-research.md",
  ".trae/commands/trellis-continue.md",
  ".trae/commands/trellis-finish-work.md",
  ".trae/hooks.json",
  ".trae/hooks/inject-shell-session-context.py",
  ".trae/hooks/inject-workflow-state.py",
  ".trae/hooks/session-start.py",
  ".zcode/agents/trellis-check.md",
  ".zcode/agents/trellis-implement.md",
  ".zcode/agents/trellis-research.md",
  ".zcode/commands/trellis/continue.md",
  ".zcode/commands/trellis/finish-work.md",
  ".zcode/config.json",
  ".zcode/hooks/inject-shell-session-context.py",
  ".zcode/hooks/inject-subagent-context.py",
  ".zcode/hooks/inject-workflow-state.py",
  ".zcode/hooks/session-start.py",
] as const;

export const RETIRED_TEMPLATE_PATHS: ReadonlySet<string> = new Set([
  ...RETIRED_SKILL_ROOTS.flatMap((root) =>
    RETIRED_SKILL_SUFFIXES.map((suffix) => `${root}/${suffix}`),
  ),
  ...EXTRA_RETIRED_SKILL_PATHS,
  ...OTHER_RETIRED_TEMPLATE_PATHS,
]);

/** Roots reserved for retired installers, including names used by older manifests. */
const RETIRED_EXCLUSIVE_ROOTS = [
  ".opencode",
  ".kilocode",
  ".kiro",
  ".gemini",
  ".agent/workflows",
  ".agent/skills",
  ".devin",
  ".windsurf",
  ".qoder",
  ".codebuddy",
  ".github/agents",
  ".github/copilot",
  ".github/copilot-instructions.md",
  ".github/hooks",
  ".github/prompts",
  ".github/skills",
  ".factory",
  ".reasonix",
  ".zcode",
  ".trae",
  ".omp",
  ".grok",
  ".kimi-code",
  ".snow",
  ".iflow",
] as const;

function isUnder(relativePath: string, root: string): boolean {
  return relativePath === root || relativePath.startsWith(`${root}/`);
}

export function isRetiredExclusivePath(relativePath: string): boolean {
  return RETIRED_EXCLUSIVE_ROOTS.some((root) => isUnder(relativePath, root));
}

function isTrellisNamespaced(relativePath: string): boolean {
  return relativePath
    .split("/")
    .some((part) => part === "trellis" || part.startsWith("trellis-"));
}

const HISTORICAL_RETIRED_PATHS: ReadonlySet<string> = new Set(
  getAllMigrations()
    .flatMap((item) => [item.from, item.to].filter((p): p is string => !!p))
    .filter((p) => isRetiredExclusivePath(p) || isUnder(p, ".agents/skills")),
);

/**
 * Old projects may predate the v2 ownership receipt. A platform's native
 * directory or generic settings file is not installation evidence; only
 * exact, Trellis-namespaced bundled paths qualify.
 */
export function hasRetiredInstallationMarker(cwd: string): boolean {
  const candidates = new Set([
    ...RETIRED_TEMPLATE_PATHS,
    ...HISTORICAL_RETIRED_PATHS,
  ]);
  for (const relativePath of candidates) {
    if (
      isRetiredExclusivePath(relativePath) &&
      isTrellisNamespaced(relativePath) &&
      fs.existsSync(path.join(cwd, relativePath))
    ) {
      return true;
    }
  }
  return false;
}

/** Recognize retained Trellis files in pre-receipt projects, not native dirs. */
export function getRetainedInstallationsWithoutHashes(
  cwd: string,
): Set<AITool> {
  const installed = new Set<AITool>();
  for (const id of Object.keys(AI_TOOLS) as AITool[]) {
    const configDir = AI_TOOLS[id].configDir;
    for (const relativePath of collectPlatformTemplates(id)?.keys() ?? []) {
      if (
        isUnder(relativePath, configDir) &&
        isTrellisNamespaced(relativePath) &&
        fs.existsSync(path.join(cwd, relativePath))
      ) {
        installed.add(id);
        break;
      }
    }
  }
  return installed;
}

function activeTemplatePaths(platforms: readonly AITool[]): Set<string> {
  const paths = new Set<string>();
  for (const id of platforms) {
    for (const path of collectPlatformTemplates(id)?.keys() ?? []) {
      paths.add(path);
    }
  }
  return paths;
}

/**
 * Return only known old Trellis assets; a poisoned manifest entry under the
 * same native platform directory must still be pruned by the usual self-heal.
 * Shared skills belong to a retired installer only when no retained adapter
 * currently claims the same path and an exclusive retired asset is present.
 */
export function getRetiredOwnedManifestKeys(
  hashes: TemplateHashes,
  platforms: readonly AITool[],
): string[] {
  const active = activeTemplatePaths(platforms);
  const keys = Object.keys(hashes);
  const isKnown = (key: string): boolean =>
    RETIRED_TEMPLATE_PATHS.has(key) || HISTORICAL_RETIRED_PATHS.has(key);
  const exclusive = keys.filter(
    (key) => isRetiredExclusivePath(key) && isKnown(key),
  );
  if (exclusive.length === 0) return [];
  const shared = keys.filter(
    (key) => isUnder(key, ".agents/skills") && isKnown(key) && !active.has(key),
  );
  return [...exclusive, ...shared];
}

/** Keep historical migrations for retained/shared paths, without touching retired adapters. */
export function migrationTargetsSupportedPlatforms(
  item: MigrationItem,
  platforms: ReadonlySet<AITool>,
): boolean {
  const hasSharedWriter = ["codex", "pi", "dsh"].some((id) =>
    platforms.has(id as AITool),
  );
  return [item.from, item.to].every(
    (path) =>
      !path ||
      (!isRetiredExclusivePath(path) &&
        (hasSharedWriter || !isUnder(path, ".agents/skills"))),
  );
}
