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
const PACKAGED_WORKFLOW = path.resolve(
  __dirname,
  "../../src/templates/trellis/workflow.md",
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

  it.each([
    ["Claude Code", "CLAUDE_PROJECT_DIR", "claude"],
    ["Codex", "CODEX_PROJECT_DIR", "codex"],
    ["Cursor", "CURSOR_PROJECT_DIR", "cursor"],
  ])(
    "%s loads packaged workflow policy for no-task, planning, execution, and task error",
    (_, envVar, platform) => {
      fs.copyFileSync(
        PACKAGED_WORKFLOW,
        path.join(tmp, ".trellis", "workflow.md"),
      );
      const payload = () => {
        const result = runHook(tmp, "inject-workflow-state.py", envVar);
        expect(result.status).toBe(0);
        return (
          JSON.parse(result.stdout) as {
            hookSpecificOutput: { additionalContext: string };
          }
        ).hookSpecificOutput.additionalContext;
      };
      const sessionFile = path.join(
        tmp,
        ".trellis",
        ".runtime",
        "sessions",
        `${platform}_test-session.json`,
      );
      const taskDir = path.join(tmp, ".trellis", "tasks", "scope-fixture");
      const noTask = payload();
      expect(noTask).toContain("Answer consultation");
      expect(noTask).toContain("read-only");
      fs.mkdirSync(path.dirname(sessionFile), { recursive: true });
      fs.mkdirSync(taskDir, { recursive: true });
      fs.writeFileSync(
        sessionFile,
        JSON.stringify({ current_task: ".trellis/tasks/scope-fixture" }),
      );
      fs.writeFileSync(
        path.join(taskDir, "task.json"),
        JSON.stringify({ id: "scope-fixture", status: "planning" }),
      );
      const planning = payload();
      expect(planning).toContain("scope-fixture");
      expect(planning).toContain("execution grant");
      fs.writeFileSync(
        path.join(taskDir, "task.json"),
        JSON.stringify({ id: "scope-fixture", status: "in_progress" }),
      );
      const executing = payload();
      expect(executing).toContain("scope-fixture");
      expect(executing).toContain("in_progress");
      expect(executing).toContain("authorized scope");
      fs.writeFileSync(path.join(taskDir, "task.json"), "{}");
      const broken = payload();
      expect(broken).toContain("task_error");
      expect(broken).toContain("task.json");
    },
  );

  it("Codex inline mode loads the packaged inline branch instead of sub-agent instructions", () => {
    fs.copyFileSync(
      PACKAGED_WORKFLOW,
      path.join(tmp, ".trellis", "workflow.md"),
    );
    fs.writeFileSync(
      path.join(tmp, ".trellis", "config.yaml"),
      "codex:\n  dispatch_mode: inline\n",
    );
    const taskDir = path.join(tmp, ".trellis", "tasks", "inline-fixture");
    fs.mkdirSync(taskDir, { recursive: true });
    fs.mkdirSync(path.join(tmp, ".trellis", ".runtime", "sessions"), {
      recursive: true,
    });
    fs.writeFileSync(
      path.join(
        tmp,
        ".trellis",
        ".runtime",
        "sessions",
        "codex_test-session.json",
      ),
      JSON.stringify({ current_task: ".trellis/tasks/inline-fixture" }),
    );
    fs.writeFileSync(
      path.join(taskDir, "task.json"),
      JSON.stringify({ id: "inline-fixture", status: "in_progress" }),
    );
    const result = runHook(
      tmp,
      "inject-workflow-state.py",
      "CODEX_PROJECT_DIR",
    );
    expect(result.status).toBe(0);
    const context = (
      JSON.parse(result.stdout) as {
        hookSpecificOutput: { additionalContext: string };
      }
    ).hookSpecificOutput.additionalContext;
    expect(context).toContain("<codex-mode>inline:");
    expect(context).toContain("trellis-before-dev");
    expect(context).toContain("Do not dispatch implement/check sub-agents");
  });

  it("a user-merged workflow block is the effective per-turn prompt", () => {
    const packaged = fs.readFileSync(PACKAGED_WORKFLOW, "utf-8");
    const merged = packaged.replace(
      "[/workflow-state:no_task]",
      "Team-specific read-only rule.\n[/workflow-state:no_task]",
    );
    fs.writeFileSync(path.join(tmp, ".trellis", "workflow.md"), merged);
    const result = runHook(
      tmp,
      "inject-workflow-state.py",
      "CLAUDE_PROJECT_DIR",
    );
    expect(result.status).toBe(0);
    const context = (
      JSON.parse(result.stdout) as {
        hookSpecificOutput: { additionalContext: string };
      }
    ).hookSpecificOutput.additionalContext;
    expect(context).toContain("Answer consultation");
    expect(context).toContain("Team-specific read-only rule.");
  });
});
