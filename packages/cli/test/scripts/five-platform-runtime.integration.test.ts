/** Retained host decisions in the shipped Python runtime, including shell identity. */
import { describe, expect, it } from "vitest";
import { execFileSync, spawnSync } from "node:child_process";
import path from "node:path";

const repoRoot = path.resolve(__dirname, "../../../..");
const scripts = path.join(
  repoRoot,
  "packages/cli/src/templates/trellis/scripts",
);

function hasPython(): boolean {
  try {
    execFileSync("python3", ["--version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

const describeFn = hasPython() ? describe : describe.skip;

describeFn("five-platform Python runtime", () => {
  it("keeps DSH identity precedence and Claude/Codex/Cursor shell identities", () => {
    const code = `
import os
from unittest.mock import patch
from common.active_task import resolve_context_key
cases = [
    ({'DSH_SESSION_ID': 'd1', 'CODEX_THREAD_ID': 'c1'}, None, 'dsh_d1'),
    ({'CLAUDE_CODE_SESSION_ID': 'a1'}, None, 'claude_a1'),
    ({'CODEX_THREAD_ID': 'c1'}, None, 'codex_c1'),
    ({'CURSOR_CONVERSATION_ID': 'v1'}, 'cursor', 'cursor_v1'),
]
for env, platform, expected in cases:
    with patch.dict(os.environ, env, clear=True):
        assert resolve_context_key(platform=platform) == expected
`;
    const run = spawnSync("python3", ["-c", code], {
      cwd: repoRoot,
      env: { ...process.env, PYTHONPATH: scripts },
      encoding: "utf-8",
    });
    expect(run.status, run.stderr).toBe(0);
  });

  it("creates JSONL context only for sub-agent hosts and preserves Codex inline", () => {
    const code = `
from pathlib import Path
from tempfile import TemporaryDirectory
from common.task_store import _has_subagent_platform
with TemporaryDirectory() as temp:
    root = Path(temp)
    (root / '.dsh').mkdir()
    (root / '.omp').mkdir()
    assert not _has_subagent_platform(root)
    (root / '.pi').mkdir()
    assert _has_subagent_platform(root)
    (root / '.pi').rmdir()
    (root / '.codex').mkdir()
    assert _has_subagent_platform(root)
    (root / '.trellis').mkdir()
    (root / '.trellis' / 'config.yaml').write_text('codex:\\n  dispatch_mode: inline\\n')
    assert not _has_subagent_platform(root)
`;
    const run = spawnSync("python3", ["-c", code], {
      cwd: repoRoot,
      env: { ...process.env, PYTHONPATH: scripts },
      encoding: "utf-8",
    });
    expect(run.status, run.stderr).toBe(0);
  });

  it("retains five CLIAdapter contracts and refuses retired hosts", () => {
    const code = `
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch
import os
from common.cli_adapter import get_cli_adapter, detect_platform
assert get_cli_adapter('claude-code').platform == 'claude'
assert get_cli_adapter('claude').build_resume_command('s') == ['claude', '--resume', 's']
assert get_cli_adapter('codex').build_run_command('implement', 'hello') == ['codex', 'exec', 'hello']
assert get_cli_adapter('cursor').get_trellis_command_path('continue') == '.cursor/commands/trellis-continue.md'
assert get_cli_adapter('cursor').get_non_interactive_env() == {'CLAUDE_NON_INTERACTIVE': '1'}
assert get_cli_adapter('pi').build_run_command('implement', 'hello') == ['pi', '-p', 'hello']
assert get_cli_adapter('dsh').get_trellis_command_path('start') == '.dsh/skills/trellis-start/SKILL.md'
assert not get_cli_adapter('dsh').supports_cli_agents
try:
    get_cli_adapter('omp')
except ValueError:
    pass
else:
    raise AssertionError('OMP must not be an active adapter')
with TemporaryDirectory() as temp:
    root = Path(temp)
    (root / '.dsh').mkdir()
    assert detect_platform(root) == 'dsh'
with TemporaryDirectory() as temp:
    root = Path(temp)
    (root / '.opencode').mkdir()
    try:
        detect_platform(root)
    except ValueError as exc:
        assert 'retired' in str(exc)
    else:
        raise AssertionError('retired-only configuration must not claim Claude')
    (root / '.codex').mkdir()
    assert detect_platform(root) == 'codex'
    with patch.dict(os.environ, {'TRELLIS_PLATFORM': 'omp'}):
        try:
            detect_platform(root)
        except ValueError as exc:
            assert 'Unsupported TRELLIS_PLATFORM' in str(exc)
        else:
            raise AssertionError('retired explicit host must not fall back to Codex')
`;
    const run = spawnSync("python3", ["-c", code], {
      cwd: repoRoot,
      env: { ...process.env, PYTHONPATH: scripts },
      encoding: "utf-8",
    });
    expect(run.status, run.stderr).toBe(0);
  });
});
