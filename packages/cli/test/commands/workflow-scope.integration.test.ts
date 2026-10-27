/** Native workflow delivery through real init/update file paths for retained hosts. */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

vi.mock("figlet", () => ({ default: { textSync: vi.fn(() => "TRELLIS") } }));
vi.mock("inquirer", () => ({
  default: {
    prompt: vi.fn().mockResolvedValue({ proceed: true, action: "skip" }),
  },
}));
vi.mock("node:child_process", () => ({
  execSync: vi.fn().mockReturnValue("Python 3.11.12"),
}));

import { init, type InitOptions } from "../../src/commands/init.js";
import { update } from "../../src/commands/update.js";
import { VERSION } from "../../src/constants/version.js";
import { collectPlatformTemplates } from "../../src/configurators/index.js";
import { workflowMdTemplate } from "../../src/templates/trellis/index.js";
import { computeHash } from "../../src/utils/template-hash.js";
import { replacePythonCommandLiterals } from "../../src/configurators/shared.js";
import type { AITool } from "../../src/types/ai-tools.js";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

const hosts: {
  name: string;
  id: AITool;
  option: keyof InitOptions;
  entry: string;
  policy: string[];
}[] = [
  {
    name: "Claude Code",
    id: "claude-code",
    option: "claude",
    entry: ".claude/skills/trellis-check/SKILL.md",
    policy: ["Within the confirmed goal", "A changed public contract"],
  },
  {
    name: "Codex",
    id: "codex",
    option: "codex",
    entry: ".agents/skills/trellis-start/SKILL.md",
    policy: [
      "Answer consultation",
      "Status and artifact presence do not grant authority",
    ],
  },
  {
    name: "Cursor",
    id: "cursor",
    option: "cursor",
    entry: ".cursor/skills/trellis-check/SKILL.md",
    policy: ["Within the confirmed goal", "A changed public contract"],
  },
  {
    name: "Pi",
    id: "pi",
    option: "pi",
    entry: ".pi/prompts/trellis-start.md",
    policy: [
      "Answer consultation",
      "Status and artifact presence do not grant authority",
    ],
  },
  {
    name: "dsh",
    id: "dsh",
    option: "dsh",
    entry: ".dsh/skills/trellis-start/SKILL.md",
    policy: [
      "Answer consultation",
      "Status and artifact presence do not grant authority",
    ],
  },
];

describe("native workflow delivery and safe adoption", () => {
  let tmp: string;
  const file = (relative: string) => path.join(tmp, relative);
  const read = (relative: string) => fs.readFileSync(file(relative), "utf-8");
  const write = (relative: string, content: string) => {
    fs.mkdirSync(path.dirname(file(relative)), { recursive: true });
    fs.writeFileSync(file(relative), content);
  };
  const hashPath = () => file(".trellis/.template-hashes.json");
  const hashes = () =>
    JSON.parse(fs.readFileSync(hashPath(), "utf-8")) as {
      __version: number;
      hashes: Record<string, string>;
    };
  const saveHashes = (value: ReturnType<typeof hashes>) =>
    fs.writeFileSync(hashPath(), JSON.stringify(value, null, 2));
  const oldVersion = () => write(".trellis/.version", "0.5.10");

  beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "trellis-workflow-scope-"));
    vi.spyOn(process, "cwd").mockReturnValue(tmp);
    vi.spyOn(console, "log").mockImplementation(noop);
    vi.spyOn(console, "error").mockImplementation(noop);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ version: VERSION }),
      }),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it.each(hosts)(
    "#1 $name init installs a loadable native entry and update adopts pristine old files",
    async ({ id, option, entry, policy }) => {
      await init({ yes: true, [option]: true });
      const collected = collectPlatformTemplates(id);
      expect(collected?.get(entry)).toBe(read(entry));
      expect(read(".trellis/workflow.md")).toBe(
        replacePythonCommandLiterals(workflowMdTemplate),
      );
      for (const rule of policy) expect(read(entry)).toContain(rule);
      if (id === "dsh") {
        const sharedSkill = ".agents/skills/trellis-check/SKILL.md";
        expect(read(sharedSkill)).toBe(collected?.get(sharedSkill));
        expect(read(entry)).toContain("trellis");
        expect(read(sharedSkill)).toContain("trellis");
      }

      const oldWorkflow =
        "# Earlier workflow\n\n## Phase Index\n\n[workflow-state:no_task]\nEarlier no-task rule\n[/workflow-state:no_task]\n";
      const oldEntry = "# Earlier Trellis entry\n";
      write(".trellis/workflow.md", oldWorkflow);
      write(entry, oldEntry);
      const tracked = hashes();
      tracked.hashes[".trellis/workflow.md"] = computeHash(oldWorkflow);
      tracked.hashes[entry] = computeHash(oldEntry);
      saveHashes(tracked);
      oldVersion();

      await update({ skipAll: true });
      expect(read(".trellis/workflow.md")).toBe(
        replacePythonCommandLiterals(workflowMdTemplate),
      );
      expect(read(entry)).toBe(collected?.get(entry));
      for (const rule of policy) expect(read(entry)).toContain(rule);
      expect(hashes().hashes[entry]).toBe(computeHash(read(entry)));
      if (id === "dsh") {
        const nextStepEntry = ".dsh/skills/trellis-continue/SKILL.md";
        expect(read(entry)).toContain("get_context.py --mode phase");
        expect(read(nextStepEntry)).toContain(
          "get_context.py --mode phase --step <X.X> --platform dsh",
        );
        const { spawnSync } =
          await vi.importActual<typeof import("node:child_process")>(
            "node:child_process",
          );
        const runPhase = (...args: string[]) => {
          const result = spawnSync(
            "python3",
            [
              file(".trellis/scripts/get_context.py"),
              "--mode",
              "phase",
              ...args,
              "--platform",
              "dsh",
            ],
            {
              cwd: tmp,
              encoding: "utf-8",
            },
          );
          expect(result.status, result.stderr).toBe(0);
          return result.stdout;
        };
        const overview = runPhase();
        expect(overview).toContain(
          "Answer consultation, explanation, review, and read-only investigation directly",
        );
        expect(overview).toContain(
          "Task creation, plan confirmation, and execution authorization are distinct",
        );
        expect(overview).toContain("Before editing -> `trellis-before-dev`");
        expect(overview).not.toContain(
          "dispatch `trellis-implement` / `trellis-check`",
        );
        const authorizationStep = runPhase("--step", "1.4");
        expect(authorizationStep).toContain(
          "After the applicable plan is confirmed and implementation is authorized",
        );
        expect(authorizationStep).toContain(
          "does not create or expand permission",
        );
        const executionStep = runPhase("--step", "2.1");
        expect(executionStep).toContain("Load the `trellis-before-dev` skill");
        expect(executionStep).not.toContain("Spawn the implement sub-agent");
      }

      const adopted = read(entry);
      await update({ skipAll: true });
      expect(read(entry)).toBe(adopted);
      expect(fs.existsSync(file(`${entry}.new`))).toBe(false);
    },
  );

  it.each(hosts)(
    "#2 $name preserves modified and untracked entry files with .new and skip",
    async ({ option, entry, policy }) => {
      await init({ yes: true, [option]: true });
      const custom = `${read(entry)}\n<!-- user customization -->\n`;
      write(entry, custom);
      oldVersion();
      await update({ createNew: true });
      expect(read(entry)).toBe(custom);
      expect(read(`${entry}.new`)).not.toContain("user customization");
      const upgraded = read(`${entry}.new`);
      for (const rule of policy) expect(upgraded).toContain(rule);

      // An absent baseline is also user-managed, even if its bytes resemble a template.
      const tracked = hashes();
      tracked.hashes = Object.fromEntries(
        Object.entries(tracked.hashes).filter(([key]) => key !== entry),
      );
      saveHashes(tracked);
      fs.rmSync(file(`${entry}.new`));
      oldVersion();
      await update({ skipAll: true });
      expect(read(entry)).toBe(custom);
      expect(fs.existsSync(file(`${entry}.new`))).toBe(false);

      // A deliberate merge is installed by the user, then still protected by ordinary update.
      const merged = `${upgraded}\n<!-- user customization -->\n`;
      write(entry, merged);
      oldVersion();
      await update({ skipAll: true });
      expect(read(entry)).toBe(merged);
      for (const rule of policy) expect(read(entry)).toContain(rule);
    },
  );

  it("#3 explicit non-native workflow remains selected across ordinary update", async () => {
    const customWorkflow =
      "# Chosen workflow\n\n[workflow-state:no_task]\nKeep the chosen variant\n[/workflow-state:no_task]\n";
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: string | URL) => {
        const url = String(input);
        if (url.endsWith("/index.json"))
          return new Response(
            JSON.stringify({
              version: 1,
              templates: [
                {
                  id: "chosen",
                  type: "workflow",
                  name: "Chosen",
                  path: "workflows/chosen/workflow.md",
                },
              ],
            }),
            { status: 200 },
          );
        if (url.endsWith("/workflows/chosen/workflow.md"))
          return new Response(customWorkflow, { status: 200 });
        return new Response(JSON.stringify({ version: VERSION }), {
          status: 200,
        });
      }),
    );
    await init({ yes: true, claude: true, workflow: "chosen" });
    expect(read(".trellis/workflow.md")).toBe(customWorkflow);
    expect(hashes().hashes[".trellis/workflow.md"]).toBeUndefined();
    oldVersion();
    await update({ createNew: true });
    expect(read(".trellis/workflow.md")).toBe(customWorkflow);
    expect(read(".trellis/workflow.md.new")).toBe(
      replacePythonCommandLiterals(workflowMdTemplate),
    );
    expect(hashes().hashes[".trellis/workflow.md"]).toBeUndefined();
  });

  it("#4 user-merges a native workflow conflict and a second update preserves the merge", async () => {
    await init({ yes: true, claude: true });
    const relative = ".trellis/workflow.md";
    const oldWorkflow =
      "# Earlier workflow\n\n[workflow-state:no_task]\nEarlier rule\n[/workflow-state:no_task]\n";
    const localAddition = "\n<!-- Keep this team's custom note. -->\n";
    write(relative, oldWorkflow + localAddition);
    const tracked = hashes();
    tracked.hashes[relative] = computeHash(oldWorkflow);
    saveHashes(tracked);
    oldVersion();

    await update({ createNew: true });
    expect(read(relative)).toBe(oldWorkflow + localAddition);
    const upgraded = read(`${relative}.new`);
    expect(upgraded).toContain("Answer consultation");
    const merged = upgraded.replace(
      "[/workflow-state:no_task]",
      `${localAddition.trim()}\n[/workflow-state:no_task]`,
    );
    write(relative, merged);
    oldVersion();
    await update({ skipAll: true });
    expect(read(relative)).toBe(merged);
    const { spawnSync } =
      await vi.importActual<typeof import("node:child_process")>(
        "node:child_process",
      );
    const hook = spawnSync(
      "python3",
      [file(".claude/hooks/inject-workflow-state.py")],
      {
        cwd: tmp,
        encoding: "utf-8",
        input: JSON.stringify({
          cwd: tmp,
          session_id: "merged-fixture",
          prompt: "Explain this",
        }),
        env: { ...process.env, CLAUDE_PROJECT_DIR: tmp },
      },
    );
    expect(hook.status, hook.stderr).toBe(0);
    const context = (
      JSON.parse(hook.stdout) as {
        hookSpecificOutput: { additionalContext: string };
      }
    ).hookSpecificOutput.additionalContext;
    expect(context).toContain("Answer consultation");
    expect(context).toContain("Keep this team's custom note.");
  });
});
