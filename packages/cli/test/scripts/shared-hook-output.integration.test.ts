/** Exercise the retained hosts' real Python hook payloads, not only their map entries. */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const TEMPLATE_SCRIPTS = path.resolve(
  __dirname,
  "../../src/templates/trellis/scripts",
);
const SHARED_HOOKS = path.resolve(
  __dirname,
  "../../src/templates/shared-hooks",
);

function hasPython(): boolean {
  try {
    execFileSync("python3", ["--version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function setupRepo(tmp: string): void {
  fs.mkdirSync(path.join(tmp, ".trellis", "scripts"), { recursive: true });
  fs.cpSync(TEMPLATE_SCRIPTS, path.join(tmp, ".trellis", "scripts"), {
    recursive: true,
  });
  fs.writeFileSync(
    path.join(tmp, ".trellis", "workflow.md"),
    [
      "# Workflow",
      "",
      "## Phase Index",
      "",
      "[workflow-state:no_task]",
      "No active task. Classify the turn before creating a Trellis task.",
      "[/workflow-state:no_task]",
      "",
      "## Phase 1: Plan",
      "",
    ].join("\n"),
  );
}

function runHook(
  tmp: string,
  script: string,
  platformEnvVar: string,
): { stdout: string; status: number | null } {
  const hostDir =
    platformEnvVar === "CODEX_PROJECT_DIR"
      ? ".codex"
      : platformEnvVar === "CURSOR_PROJECT_DIR"
        ? ".cursor"
        : ".claude";
  const hookDir = path.join(tmp, hostDir, "hooks");
  fs.mkdirSync(hookDir, { recursive: true });
  const hookPath = path.join(hookDir, script);
  fs.copyFileSync(path.join(SHARED_HOOKS, script), hookPath);
  const r = spawnSync("python3", [hookPath], {
    cwd: tmp,
    encoding: "utf-8",
    input: JSON.stringify({
      hook_event_name: "userPromptSubmit",
      cwd: tmp,
      session_id: "test-session",
      prompt: "hi",
    }),
    env: { ...process.env, [platformEnvVar]: tmp },
  });
  return { stdout: r.stdout, status: r.status };
}

const describeFn = hasPython() ? describe : describe.skip;

describeFn("retained shared-hook output", () => {
  let tmp: string;

  beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "trellis-shared-hook-"));
    setupRepo(tmp);
  });

  afterEach(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it.each([
    ["Claude Code", "CLAUDE_PROJECT_DIR"],
    ["Codex", "CODEX_PROJECT_DIR"],
  ])(
    "%s workflow-state hook emits the UserPromptSubmit envelope",
    (_, envVar) => {
      const { stdout, status } = runHook(
        tmp,
        "inject-workflow-state.py",
        envVar,
      );
      expect(status).toBe(0);
      const parsed = JSON.parse(stdout) as {
        hookSpecificOutput?: {
          hookEventName?: string;
          additionalContext?: string;
        };
      };
      expect(parsed.hookSpecificOutput?.hookEventName).toBe("UserPromptSubmit");
      expect(parsed.hookSpecificOutput?.additionalContext).toContain(
        "<workflow-state>",
      );
      if (envVar === "CODEX_PROJECT_DIR") {
        expect(parsed.hookSpecificOutput?.additionalContext).toContain(
          "<codex-mode>",
        );
      }
    },
  );

  it.each([
    ["Claude Code", "CLAUDE_PROJECT_DIR"],
    ["Cursor", "CURSOR_PROJECT_DIR"],
  ])("%s session-start hook emits context in both host fields", (_, envVar) => {
    const { stdout, status } = runHook(tmp, "session-start.py", envVar);
    expect(status).toBe(0);
    const parsed = JSON.parse(stdout) as {
      hookSpecificOutput?: { additionalContext?: string };
      additional_context?: string;
    };
    expect(parsed.hookSpecificOutput?.additionalContext).toContain(
      "<session-context>",
    );
    expect(parsed.additional_context).toBe(
      parsed.hookSpecificOutput?.additionalContext,
    );
  });
});
