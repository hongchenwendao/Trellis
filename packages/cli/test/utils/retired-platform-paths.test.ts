import { describe, expect, it } from "vitest";

import {
  RETIRED_TEMPLATE_PATHS,
  getRetiredOwnedManifestKeys,
  isRetiredExclusivePath,
  migrationTargetsSupportedPlatforms,
} from "../../src/constants/retired-platform-paths.js";

describe("retired platform ownership", () => {
  it("recognizes exact old Trellis assets without claiming arbitrary native files", () => {
    expect(RETIRED_TEMPLATE_PATHS.size).toBe(824);
    expect(RETIRED_TEMPLATE_PATHS.has(".opencode/package.json")).toBe(true);
    expect(RETIRED_TEMPLATE_PATHS.has(".omp/extensions/trellis/index.ts")).toBe(
      true,
    );
    expect(RETIRED_TEMPLATE_PATHS.has(".opencode/runtime-cache.db")).toBe(
      false,
    );
    expect(isRetiredExclusivePath(".github/copilot/hooks.json")).toBe(true);
    expect(isRetiredExclusivePath(".github/workflows/ci.yml")).toBe(false);
  });

  it("preserves retired hashes but leaves shared paths to an active writer", () => {
    const hashes = {
      ".opencode/package.json": "old-open-code-hash",
      ".opencode/runtime-cache.db": "poisoned-user-hash",
      ".agents/skills/trellis-meta/SKILL.md": "shared-hash",
    };
    expect(getRetiredOwnedManifestKeys(hashes, ["claude-code"])).toEqual([
      ".opencode/package.json",
      ".agents/skills/trellis-meta/SKILL.md",
    ]);
    expect(getRetiredOwnedManifestKeys(hashes, ["codex"])).toEqual([
      ".opencode/package.json",
    ]);
  });

  it("keeps both endpoints of retained migrations and rejects retired targets", () => {
    const active = new Set(["claude-code", "pi"] as const);
    expect(
      migrationTargetsSupportedPlatforms(
        { type: "rename-dir", from: ".pi/skills", to: ".agents/skills" },
        active,
      ),
    ).toBe(true);
    expect(
      migrationTargetsSupportedPlatforms(
        {
          type: "rename-dir",
          from: ".windsurf/workflows",
          to: ".devin/workflows",
        },
        active,
      ),
    ).toBe(false);
    expect(
      migrationTargetsSupportedPlatforms(
        {
          type: "safe-file-delete",
          from: ".opencode/commands/trellis/start.md",
        },
        active,
      ),
    ).toBe(false);
    expect(
      migrationTargetsSupportedPlatforms(
        {
          type: "rename",
          from: ".agents/skills/old",
          to: ".agents/skills/new",
        },
        new Set(["claude-code"] as const),
      ),
    ).toBe(false);
  });
});
