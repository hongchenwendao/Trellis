# Development Workflow

---

## Core Principles

1. **Plan before code** — figure out what to do before you start
2. **Specs injected, not remembered** — guidelines are injected via hook/skill, not recalled from memory
3. **Record what matters** — keep requirements, material decisions, authorized scope, and the next step recoverable without logging ordinary technical choices
4. **Incremental development** — one task at a time
5. **Capture learnings** — after each task, review and write new knowledge back to spec

---

## Trellis System

### Developer Identity

On first use, initialize your identity:

```bash
python3 ./.trellis/scripts/init_developer.py <your-name>
```

Creates `.trellis/.developer` (gitignored) + `.trellis/workspace/<your-name>/`.

### Spec System

`.trellis/spec/` holds coding guidelines organized by package and layer.

- `.trellis/spec/<package>/<layer>/index.md` — entry point with **Pre-Development Checklist** + **Quality Check**. Actual guidelines live in the `.md` files it points to.
- `.trellis/spec/guides/index.md` — cross-package thinking guides.

```bash
python3 ./.trellis/scripts/get_context.py --mode packages   # list packages / layers
```

**When to update spec**: new pattern/convention found · bug-fix prevention to codify · new technical decision.

### Task System

Every task has its own directory under `.trellis/tasks/{MM-DD-name}/` holding `task.json`, `prd.md`, optional `design.md`, optional `implement.md`, optional `research/`, and context manifests (`implement.jsonl`, `check.jsonl`) for sub-agent-capable platforms.

```bash
# Task lifecycle
python3 ./.trellis/scripts/task.py create "<title>" [--slug <name>] [--parent <dir>]
python3 ./.trellis/scripts/task.py start <name>          # set active task (session-scoped when available)
python3 ./.trellis/scripts/task.py current --source      # show active task and source
python3 ./.trellis/scripts/task.py finish                # clear active task (triggers after_finish hooks)
python3 ./.trellis/scripts/task.py archive <name>        # move to archive/{year-month}/
python3 ./.trellis/scripts/task.py list [--mine] [--status <s>]
python3 ./.trellis/scripts/task.py list-archive

# Code-spec context (injected into implement/check agents via JSONL).
# `implement.jsonl` / `check.jsonl` are seeded on `task create` for sub-agent-capable
# platforms. Curate a role's spec + research entries before dispatching that role.
# If either seeded manifest is empty, `start --allow-empty-context` bypasses the
# start-time gate; it does not waive curation before that role is dispatched.
python3 ./.trellis/scripts/task.py add-context <name> <action> <file> <reason>
python3 ./.trellis/scripts/task.py list-context <name> [action]
python3 ./.trellis/scripts/task.py validate <name>

# Task metadata
python3 ./.trellis/scripts/task.py set-branch <name> <branch>
python3 ./.trellis/scripts/task.py set-base-branch <name> <branch>    # PR target
python3 ./.trellis/scripts/task.py set-scope <name> <scope>

# Hierarchy (parent/child)
python3 ./.trellis/scripts/task.py add-subtask <parent> <child>
python3 ./.trellis/scripts/task.py remove-subtask <parent> <child>

# PR creation
python3 ./.trellis/scripts/task.py create-pr [name] [--dry-run]
```

> Run `python3 ./.trellis/scripts/task.py --help` to see the authoritative, up-to-date list.

**Current-task mechanism**: `task.py create` creates the task directory and (when session identity is available) auto-sets the per-session active-task pointer so the planning breadcrumb fires immediately. `task.py start` writes the same pointer (idempotent if already set) and flips `task.json.status` from `planning` to `in_progress`. State is stored under `.trellis/.runtime/sessions/`. If no context key is available from hook input, `TRELLIS_CONTEXT_ID`, or a platform-native session environment variable, there is no active task and `task.py start` fails with a session identity hint. `task.py finish` deletes the current session file (status unchanged). `task.py archive <task>` writes `status=completed`, moves the directory to `archive/`, and deletes any runtime session files that still point at the archived task.

**Authority is separate from state**: task creation permits a record, plan confirmation settles the applicable design, and execution authorization permits implementation within its scope. Neither a file nor `in_progress` supplies a missing grant. Keep a short task note with the applicable plan, execution scope, prohibited operations, and next action; update it for material decision, scope, or authorization changes, not each local fix. Reconcile it with the latest user instructions and actual tool permissions on resumption.

### Workspace System

Records every AI session for cross-session tracking under `.trellis/workspace/<developer>/`.

- `journal-N.md` — session log. **Max 2000 lines per file**; a new `journal-(N+1).md` is auto-created when exceeded.
- `index.md` — personal index (total sessions, last active).

```bash
python3 ./.trellis/scripts/add_session.py --title "Title" --commit "hash" --summary "Summary"
```

### Context Script

```bash
python3 ./.trellis/scripts/get_context.py                            # full session runtime
python3 ./.trellis/scripts/get_context.py --mode packages            # available packages + spec layers
python3 ./.trellis/scripts/get_context.py --mode phase --step <X.Y>  # detailed guide for a workflow step
```

---

<!--
  WORKFLOW-STATE BREADCRUMB CONTRACT (read this before editing the tag blocks below)

  The [workflow-state:STATUS] blocks embedded in the ## Phase Index section
  below are the SINGLE source of truth for the per-turn `<workflow-state>`
  breadcrumb that the Claude Code and Codex UserPromptSubmit hooks read.
  inject-workflow-state.py only parses them — there is no
  fallback dict baked into the scripts after v0.5.0-rc.0.

  STATUS charset: [A-Za-z0-9_-]+. When the hook can't find a tag, it
  degrades to a generic "Refer to workflow.md for current step." line —
  intentionally visible so users notice and fix a broken workflow.md.

  INVARIANT (test/regression.test.ts):
    Every workflow-walkthrough step marked `[required · once]` must have a
    matching enforcement line in its phase's [workflow-state:*] block. The
    breadcrumb is the only per-turn channel; if a mandatory step isn't
    mentioned there, the AI silently skips it (Phase 1 planning gate
    skip and Phase 3.4 commit skip both manifested via this gap).

  TAG ↔ PHASE scoping:
    [workflow-state:no_task]      → no active task; before Phase 1
    [workflow-state:task_error]   → active task record is unreadable; repair it before continuing
    [workflow-state:planning]     → all of Phase 1 (status='planning')
    [workflow-state:planning-inline] → Codex inline variant of Phase 1
    [workflow-state:in_progress]  → Phase 2 + Phase 3.2-3.4
                                    (status stays 'in_progress' from
                                    task.py start until task.py archive)
    [workflow-state:in_progress-inline] → Codex inline variant of Phase 2/3
    [workflow-state:completed]    → currently DEAD: cmd_archive flips
                                    status and moves the dir in the same
                                    call, so the resolver loses the
                                    pointer (block kept for a future
                                    explicit in_progress→completed
                                    transition)

  Editing checklist:
    - When you change a [workflow-state:STATUS] block, also check the
      matching phase's `[required · once]` walkthrough steps for sync
    - Run `moksha-trellis update` to offer the whole managed workflow to
      downstream projects; modified files retain the normal conflict protection
    - Full runtime contract:
      .trellis/spec/cli/backend/workflow-state-contract.md
-->

## Phase Index

```
Phase 1: Plan    → classify intent, record requirements and settle key decisions
Phase 2: Execute → implement after applicable plan confirmation and execution authorization
Phase 3: Finish  → verify, update spec, commit when separately authorized, and wrap up
```

### Request Triage

- Answer consultation, explanation, review, and read-only investigation directly, even during an active development task. Do not ask for task creation or dispatch implementation for these turns.
- For requested development, use an existing matching task or create a record when the user has requested/approved one. Ask for task creation only when consent is genuinely missing; it is distinct from plan confirmation and execution authorization.
- Investigate ordinary technical unknowns yourself. Discuss unresolved choices that change the goal, external behavior, interface, key design, acceptance, scope, or authority. A current request may explicitly confirm an existing plan and authorize execution together; a plan newly proposed by the AI still needs confirmation.

### Planning Artifacts

- `prd.md` — requirements, constraints, and acceptance criteria. Do not put technical design or execution checklists here.
- `design.md` — technical design for complex tasks: boundaries, contracts, data flow, tradeoffs, compatibility, rollout / rollback shape.
- `implement.md` — execution plan for complex tasks: ordered checklist, validation commands, review gates, and rollback points.
- `implement.jsonl` / `check.jsonl` — spec and research manifests for sub-agent context. They do not replace `implement.md`.
- Lightweight tasks may be PRD-only. Complex tasks must have `prd.md`, `design.md`, and `implement.md` before `task.py start`.

### Parent / Child Task Trees

Use a parent task when one user request contains several independently verifiable deliverables. The parent task owns the source requirement set, the task map, cross-child acceptance criteria, and final integration review; it normally should not be the implementation target unless it also has direct work.

Use child tasks for deliverables that can be planned, implemented, checked, and archived independently. Parent/child structure is not a dependency system: if one child must wait for another, write that ordering in the child `prd.md` / `implement.md` and keep each child's acceptance criteria testable.

Create new children with `task.py create "<title>" --slug <name> --parent <parent-dir>`. Link existing tasks with `task.py add-subtask <parent> <child>`, and unlink mistakes with `task.py remove-subtask <parent> <child>`.

<!-- Per-turn breadcrumb: shown when there is no active task (before Phase 1) -->

[workflow-state:no_task]
No active task. Classify the current request first. Answer consultation, explanation, and read-only analysis directly without asking to create a task.
For requested development, use an explicitly referenced existing task or establish task-creation consent before creating a record. Creation alone does not confirm a plan or authorize implementation.
[/workflow-state:no_task]

<!-- Per-turn breadcrumb: shown when the active task record cannot be read. -->

[workflow-state:task_error]
The active task record could not be read. Do not create or activate another task.
Inspect the task directory named above and repair its task.json. It must be a valid JSON object with a non-empty status.
Preserve existing task fields and artifacts. If the correct status cannot be determined safely, ask the user before reconstructing the record.
[/workflow-state:task_error]

### Phase 1: Plan
- 1.0 Create task `[required · once]` (only when a development record is needed and task-creation consent exists)
- 1.1 Requirement exploration `[required · repeatable]` (`prd.md`; complex tasks also need `design.md` + `implement.md`)
- 1.2 Research `[optional · repeatable]`
- 1.3 Configure context `[conditional · once per delegated role]` — prepare that role's manifest before dispatch (direct work skips)
- 1.4 Activate task `[required · once]` (after applicable plan confirmation and execution authorization; status → in_progress)
- 1.5 Completion criteria

<!-- Per-turn breadcrumb: shown throughout Phase 1 (status='planning') -->

[workflow-state:planning]
Classify the current turn first: answer read-only requests directly, even with this active task. For development, load `trellis-brainstorm` and resolve only material open decisions.
Lightweight: `prd.md` can be enough. Complex: finish `prd.md`, `design.md`, and `implement.md`. Before `task.py start`, confirm the applicable plan and execution grant; reuse grants already supplied in the request or task history.
Multi-deliverable scope: consider a parent task plus independently verifiable child tasks; dependencies must be written in child artifacts, not implied by tree position.
If delegation is planned, curate the dispatched role's spec/research manifest before dispatch; direct execution does not need either manifest.
[/workflow-state:planning]

<!-- Per-turn breadcrumb: shown throughout Phase 1 when codex.dispatch_mode=inline.
     Codex-only opt-in alternate to [workflow-state:planning]. The main agent
     edits code directly in Phase 2, so jsonl curation is skipped —
     the inline workflow loads `trellis-before-dev` instead of injecting JSONL
     into a sub-agent. -->

[workflow-state:planning-inline]
Classify the current turn first: answer read-only requests directly, even with this active task. For development, load `trellis-brainstorm` and resolve only material open decisions.
Lightweight: `prd.md` can be enough. Complex: finish `prd.md`, `design.md`, and `implement.md`. Before `task.py start`, confirm the applicable plan and execution grant; reuse grants already supplied in the request or task history.
Multi-deliverable scope: consider a parent task plus independently verifiable child tasks; dependencies must be written in child artifacts, not implied by tree position.
Inline mode: skip jsonl curation; Phase 2 reads artifacts/specs via `trellis-before-dev`.
[/workflow-state:planning-inline]

### Phase 2: Execute
- 2.1 Implement `[required · repeatable]`
- 2.2 Quality check `[required · repeatable]`
- 2.3 Rollback `[on demand]`

<!-- Per-turn breadcrumb: shown while status='in_progress'.
     Scope: all of Phase 2 + Phase 3.2-3.4 (status stays 'in_progress' from
     task.py start until task.py archive; only archive flips it). The body
     therefore must cover every required step from implementation through
     commit, including Phase 3.3 spec update and Phase 3.4 commit. -->

Sub-agent dispatch protocol applies to Claude Code, Cursor, Pi, and Codex sub-agent mode, including Codex native `SubagentStart` context injection with child-side pull fallback and `trellis-research`: every dispatch prompt starts with `Active task: <task path from task.py current>` before role-specific instructions.

[workflow-state:in_progress]
Tools: `trellis-implement` / `trellis-research` are sub-agent types only (Task/Agent tool, NOT Skill; there is no skill by these names). `trellis-update-spec` is a skill. `trellis-check` exists as both a skill and an agent; use the agent for an independent review when the task calls for one.
Classify this turn first: answer read-only requests directly. For execution, reconcile the confirmed plan, execution grant, latest instructions, and checkpoint; `in_progress` alone is not permission.
Within authorized scope choose one execution owner for each deliverable. A small clear task can stay with one executor through investigation, implementation, tests, and repair; delegate independently deliverable work when useful. Require an independent reviewer for a public-interface change, substantial cross-module change, important risk, or explicit user/project requirement, not merely a file count. Count review as independent only after a different executor actually reviews and returns findings; a plan to dispatch, a self-check, or a role label is not evidence. If no reviewer ran, report review as pending or unavailable. Finish with whole-deliverable acceptance and `trellis-update-spec`; lint or a worker report alone is insufficient. Commit task work only when needed and authorized (Phase 3.4). Use `/trellis:finish-work` when no task work remains uncommitted and archive/journal writes plus enabled auto-commits are authorized; no-code tasks need no work commit. Otherwise deliver the verified result and keep the task resumable. Continue through checks and local repair without renewed approval.
Sub-agent self-exemption: if already running as `trellis-implement` or `trellis-check`, do NOT dispatch another Trellis implement/check agent. Dispatch is main session only. Return substantial rework to the original executor; a reviewer may fix small assigned issues.
Dispatch prompt starts with `Active task: <task path from task.py current>`. Read context: jsonl entries -> `prd.md` -> `design.md if present` -> `implement.md if present`.
Reuse checks while candidate code, inputs, and premises are unchanged. After a change rerun affected checks; retain final integrated acceptance and project-required hooks/CI.
Resolve local technical issues within the agreed contract. If a key premise fails or wider authority is needed, pause only the affected work; report evidence, impact, attempts, and one recommended adjustment with its decisive tradeoff, not just a list of options. Continue independent work. Diagnose from new evidence, not a fixed retry count.
[/workflow-state:in_progress]

<!-- Per-turn breadcrumb: shown while status='in_progress' when
     codex.dispatch_mode=inline. Codex-only opt-in alternate to
     [workflow-state:in_progress]. The main session edits code directly
     instead of dispatching sub-agents. -->

[workflow-state:in_progress-inline]
Classify this turn first: answer read-only requests directly. For execution, reconcile the confirmed plan, execution grant, latest instructions, and checkpoint; `in_progress` alone is not permission.
Within authorized scope use `trellis-before-dev` -> investigate/edit -> relevant tests and `trellis-check` skill -> repair -> final whole-deliverable acceptance -> `trellis-update-spec`. Reuse checks while candidate code, inputs, and premises are unchanged; rerun affected checks after a change. Keep project-required hooks/CI. Commit task work only when needed and authorized (Phase 3.4). Use `/trellis:finish-work` when no task work remains uncommitted and archive/journal writes plus enabled auto-commits are authorized; no-code tasks need no work commit. Otherwise deliver the verified result and keep the task resumable. Continue through checks and local repair without renewed approval. If an independent reviewer is warranted but unavailable in inline mode, disclose that coverage limit.
Do not dispatch implement/check sub-agents in inline mode.
Read context: `prd.md` -> `design.md if present` -> `implement.md if present`, plus relevant spec/research loaded by skills.
Resolve local technical issues within the agreed contract. If a key premise fails or wider authority is needed, pause only the affected work; report evidence, impact, attempts, and one recommended adjustment with its decisive tradeoff, not just a list of options. Continue independent work. Diagnose from new evidence, not a fixed retry count.
[/workflow-state:in_progress-inline]

### Phase 3: Finish
- 3.2 Debug retrospective `[on demand]`
- 3.3 Spec update `[required · once]`
- 3.4 Commit changes `[conditional · once]` (separate user authorization required)
- 3.5 Wrap-up `[conditional · once]` (separate archive/journal authorization required)

> Note: step 3.1 was folded into 2.2 (last-iteration full-scope check) and 3.4 (commit preamble). Numbering kept stable to avoid breaking external references.

<!-- Per-turn breadcrumb: shown while status='completed'.
     Currently DEAD in normal flow: cmd_archive writes status='completed' in
     the same call that moves the task dir to archive/, so the active-task
     resolver loses the pointer and the hook never fires on archived tasks.
     Block preserved for a future status-transition redesign (e.g. an
     explicit in_progress→completed command). Edit through the same spec
     channel as the live blocks. -->

[workflow-state:completed]
Check whether separately authorized commit and wrap-up steps remain. Do not infer permission from completed status.
[/workflow-state:completed]

### Rules

1. Classify the current intent first; answer read-only turns directly. For development, reconcile the applicable plan, grant, latest restrictions, and checkpoint before choosing a phase step
2. Run steps in order inside each Phase; `[required]` steps can't be skipped
3. If execution falsifies a key premise, pause affected work and give one recommended adjustment with its decisive tradeoff, not just options. Continue independent work; after confirmation, update the original task's superseded decision and affected steps, then resume there
4. Steps tagged `[once]` are skipped when actually complete; artifact presence alone does not prove authorization
5. Missing `design.md` / `implement.md` is valid for lightweight tasks and incomplete planning for complex tasks. Reuse valid checks unless their inputs or premises changed.

### Active Task Routing

When a user request matches one of these intents inside an active task, route first, then load the detailed phase step if needed.

[Claude Code, Cursor, codex-sub-agent, Pi]

- Read-only request -> answer directly, without changing task phase.
- Planning or unclear requirements -> `trellis-brainstorm`.
- `in_progress` implementation/check -> choose a single executor or delegate an independent deliverable with `trellis-implement`; dispatch `trellis-check` only when independent review is warranted.
- Repeated debugging -> `trellis-break-loop`; spec updates -> `trellis-update-spec`.

[/Claude Code, Cursor, codex-sub-agent, Pi]

[codex-inline, DeepSeek Harness]

- Read-only request -> answer directly, without changing task phase.
- Planning or unclear requirements -> `trellis-brainstorm`.
- Before editing -> `trellis-before-dev`; after editing -> `trellis-check`.
- Repeated debugging -> `trellis-break-loop`; spec updates -> `trellis-update-spec`.

[/codex-inline, DeepSeek Harness]

### Guardrails

- Task creation, plan confirmation, and execution authorization are distinct; `task.py start` records state but grants no permission. Reuse an applicable recorded grant rather than requesting it at each phase or session boundary.
- Local fixes within confirmed goal, external behavior, interface, key design, acceptance, and authorized scope need no new approval. Material changes need a decision before the affected work continues.
- PRD-only is valid for lightweight tasks; complex tasks need `design.md` + `implement.md`.
- Planning must be persisted to task artifacts; checks must run before reporting completion.

### Loading Step Detail

At each step, run this to fetch detailed guidance:

```bash
python3 ./.trellis/scripts/get_context.py --mode phase --step <step>
# e.g. python3 ./.trellis/scripts/get_context.py --mode phase --step 1.1
```

---

## Phase 1: Plan

Goal: answer read-only requests directly; for development, establish the task record, applicable plan, and execution authority without confusing those facts.

#### 1.0 Create task `[required · once]`

Create the task directory only when the user has requested or consented to a persistent development task. The command sets status to `planning`, writes `task.json`, creates a default `prd.md`, and auto-targets the new task when session identity is available:

```bash
python3 ./.trellis/scripts/task.py create "<task title>" --slug <name>
```

`--slug` is the human-readable name only. Do **not** include the `MM-DD-` date prefix; `task.py create` adds that prefix automatically.

For task trees, create the parent task first and then create each child with `--parent <parent-dir>`. Do not start the parent just because children exist; start the child that owns the next independently verifiable deliverable.

After this command succeeds, the per-turn breadcrumb auto-switches to `[workflow-state:planning]`. This state does not supersede a read-only user request or authorize implementation.

Run only `create` here. `start` flips status to `in_progress`; use it in step 1.4 after the applicable plan and execution grant are established, which may already be present in the current request.

Skip when `python3 ./.trellis/scripts/task.py current --source` already points to a task.

#### 1.1 Requirement exploration `[required · repeatable]`

Load the `trellis-brainstorm` skill and explore requirements interactively with the user per the skill's guidance.

The brainstorm skill will guide you to:
- Ask one question at a time
- Prefer researching over asking the user
- Prefer offering options over open-ended questions
- Update `prd.md` immediately after each user answer
- Split large scopes into a parent task plus child tasks when the deliverables can be verified independently
- Keep `prd.md` focused on requirements and acceptance criteria
- For complex tasks, produce `design.md` and `implement.md` before implementation starts

When considering a parent/child split:
- Use a parent task when one request contains several independently verifiable deliverables.
- Parent tasks own source requirements, child-task mapping, cross-child acceptance criteria, and final integration review.
- Child tasks own actual deliverables that can be planned, implemented, checked, and archived independently.
- Parent/child structure is not a dependency system. If child B depends on child A, write that ordering in child B's `prd.md` / `implement.md`.
- Start the child task that owns the next deliverable. Do not start the parent unless the parent itself has direct implementation work.

Return to this step when material requirements change. Update only the affected section and explicitly supersede the old decision; local technical fixes need no decision entry.

#### 1.2 Research `[optional · repeatable]`

Research can happen at any time during requirement exploration. It isn't limited to local code — you can use any available tool (MCP servers, skills, web search, etc.) to look up external information, including third-party library docs, industry practices, API references, etc.

[Claude Code, Cursor, codex-sub-agent, Pi]

Spawn the research sub-agent:

- **Agent type**: `trellis-research`
- **Task description**: Research <specific question>
- **Key requirement**: Research output MUST be persisted to `{TASK_DIR}/research/`

[/Claude Code, Cursor, codex-sub-agent, Pi]

[codex-inline, DeepSeek Harness]

Do the research in the main session directly and write findings into `{TASK_DIR}/research/`. `codex-inline` is the explicit mode that keeps work in the main session.

[/codex-inline, DeepSeek Harness]

**Research artifact conventions**:
- One file per research topic (e.g. `research/auth-library-comparison.md`)
- Record third-party library usage examples, API references, version constraints in files
- Note relevant spec file paths you discovered for later reference

Brainstorm and research can interleave freely — pause to research a technical question, then return to talk with the user.

**Key principle**: Persist research needed for implementation or handoff. A standalone read-only answer does not require a task or research file.

#### 1.3 Configure context `[required · once]`

[Claude Code, Cursor, codex-sub-agent, Pi]

If a role will be delegated, curate that role's manifest before dispatch so the agent gets the right spec/research context. `task create` seeds empty files on sub-agent-capable hosts; empty files do not require an agent relay.

**Location**: `{TASK_DIR}/implement.jsonl` and `{TASK_DIR}/check.jsonl` (already exist).

**Format**: one JSON object per line — `{"file": "<path>", "reason": "<why>"}`. Paths are repo-root relative.

**What to put in**:
- **Spec files** — `.trellis/spec/<package>/<layer>/index.md` and any specific guideline files (`error-handling.md`, `conventions.md`, etc.) relevant to this task
- **Research files** — `{TASK_DIR}/research/*.md` that the sub-agent will need to consult

**What NOT to put in**:
- Code files (`src/**`, `packages/**/*.ts`, etc.) — those are read by the sub-agent during implementation, not pre-registered here
- Files you're about to modify — same reason

**Choose only the roles actually dispatched**:
- `implement.jsonl` → specs + research the implement sub-agent needs to write code correctly
- `check.jsonl` → specs for the check sub-agent (quality guidelines, check conventions, same research if needed)

These manifests do not replace `implement.md`. `implement.md` is the human-readable execution plan for a complex task; jsonl files only list context files to inject or load.

**How to discover relevant specs**:

```bash
python3 ./.trellis/scripts/get_context.py --mode packages
```

Lists every package + its spec layers with paths. Pick the entries that match this task's domain.

**How to append entries**:

Either edit the jsonl file directly in your editor, or use:

```bash
python3 ./.trellis/scripts/task.py add-context "$TASK_DIR" implement "<path>" "<reason>"
python3 ./.trellis/scripts/task.py add-context "$TASK_DIR" check "<path>" "<reason>"
```

If an older task still has a seed `_example` line, remove it when adding real entries; consumers skip it.

Before dispatching a role, its manifest must contain at least one real `{"file": "...", "reason": "..."}` entry. An empty file or legacy seed row cannot supply delegated context. Do not prepare a reviewer manifest merely because the host supports sub-agents.

For direct execution, skip this step and load applicable specs through `trellis-before-dev`. If either seeded manifest is empty, start the task with `--allow-empty-context`; this existing flag affects the start-time guard, not the requirement to curate context before a later dispatch.

[/Claude Code, Cursor, codex-sub-agent, Pi]

[codex-inline, DeepSeek Harness]

Skip this step. Context is loaded directly by the `trellis-before-dev` skill in Phase 2.

[/codex-inline, DeepSeek Harness]

#### 1.4 Activate task `[required · once]`

After the applicable plan is confirmed and implementation is authorized for its scope, flip the task status to `in_progress`:

```bash
python3 ./.trellis/scripts/task.py start <task-dir>
```

For lightweight tasks, `prd.md` can be enough. For complex tasks, `prd.md`, `design.md`, and `implement.md` must exist and be reviewed before start. If either seeded manifest is empty, add `--allow-empty-context` even when the other role is ready. Curate each selected role's manifest before its dispatch; task activation does not require context for a role that will not run.

After this command succeeds, the breadcrumb auto-switches to `[workflow-state:in_progress]`. The command records progress; it does not create or expand permission. Keep a brief note of the plan, scope, prohibited operations, and next step for later resumption.

If `task.py start` errors with a session-identity message (no context key from hook input, `TRELLIS_CONTEXT_ID`, or platform-native session env), follow the hint in the error to set up session identity, then retry.

#### 1.5 Completion criteria

| Condition | Required |
|------|:---:|
| `prd.md` exists | ✅ |
| Applicable plan confirmed and execution authorized | ✅ |
| `task.py start` has been run (status = in_progress) | ✅ |
| `research/` has artifacts (complex tasks) | recommended |
| `design.md` exists (complex tasks) | ✅ |
| `implement.md` exists (complex tasks) | ✅ |

[Claude Code, Cursor, codex-sub-agent, Pi]

| Each role selected for immediate dispatch has a curated manifest (seed row does not count); start uses `--allow-empty-context` if either seeded manifest is empty | conditional |

[/Claude Code, Cursor, codex-sub-agent, Pi]

---

## Phase 2: Execute

Goal: deliver the confirmed and authorized scope through implementation, checks, and local repair.

#### 2.1 Implement `[required · repeatable]`

[Claude Code, Cursor, codex-sub-agent, Pi]

When implementation is an independently deliverable delegated assignment, spawn the implement sub-agent. For a small, clear task, the main session may be the executor: load `trellis-before-dev`, implement, test, repair, and hand the result into the same Phase 2.2 acceptance path. Preserve any explicit user/project ownership rule.

For delegated work:

- **Agent type**: `trellis-implement`
- **Task description**: Own the assigned deliverable from investigation through implementation, relevant tests, repair, and evidence handoff; consult `{TASK_DIR}/research/`
- **Dispatch prompt guard**: The prompt MUST start with `Active task: <task path>`, then tell the spawned agent it is already the `trellis-implement` sub-agent and must implement directly, not spawn another `trellis-implement` / `trellis-check`.

Curate `implement.jsonl` before dispatch. The platform hook/plugin then:
- Reads `implement.jsonl` and injects referenced spec/research files into the agent prompt
- Injects `prd.md`, `design.md` if present, and `implement.md` if present
- For Codex, `SubagentStart` supplies native context injection; the agent profile keeps child-side loading as the fallback

[/Claude Code, Cursor, codex-sub-agent, Pi]

[codex-inline, DeepSeek Harness]

1. Load the `trellis-before-dev` skill to read project guidelines
2. Read `{TASK_DIR}/prd.md`, then `design.md` if present, then `implement.md` if present
3. Consult materials under `{TASK_DIR}/research/`
4. Implement the code per reviewed artifacts
5. Run relevant tests and checks, repair failures, and report evidence

[/codex-inline, DeepSeek Harness]

#### 2.2 Quality check `[required · repeatable]`

[Claude Code, Cursor, codex-sub-agent, Pi]

Check the whole requested deliverable against task artifacts and relevant specs. Arrange an independent reviewer for a public-interface change, substantial cross-module change, important risk, or explicit user/project requirement. Judge actual contract and integration consequences, not the number of files. A simple bounded task may be checked and repaired by its executor without a separate agent. Independent review is complete only when a different executor has actually returned findings; if dispatch did not occur or no result arrived, report it as pending or unavailable, never as a completed review.

When independent review is warranted, curate `check.jsonl` and spawn the check sub-agent:

- **Agent type**: `trellis-check`
- **Task description**: Review omissions, design drift, and integration risk against specs and task artifacts; fix small assigned issues, but return substantial rework to the execution owner
- **Dispatch prompt guard**: The prompt MUST start with `Active task: <task path>`, then tell the spawned agent it is already the `trellis-check` sub-agent and must review/fix directly, not spawn another `trellis-check` / `trellis-implement`.

The check agent's job:
- Review code changes against specs
- Review code changes against `prd.md`, `design.md` if present, and `implement.md` if present
- Fix small issues within its assigned write scope; report substantial rework to the original executor
- Reuse still-valid check results and run the checks affected by any fix

[/Claude Code, Cursor, codex-sub-agent, Pi]

[codex-inline, DeepSeek Harness]

Load the `trellis-check` skill and verify the code per its guidance:
- Spec compliance
- lint / type-check / tests
- Cross-layer consistency (when changes span layers)

If issues are found, use new evidence to diagnose and fix within the confirmed contract, then re-check affected behavior. Report an unchanged impasse, widening impact, or a needed material decision instead of repeating the same attempt. If the task warrants independent review but this host or explicit inline mode cannot provide it, state that coverage limit; do not label the inline self-check independent.

[/codex-inline, DeepSeek Harness]

**Evidence and final pass**: A check remains valid for the same candidate code, inputs, and premises; do not rerun it for reassurance. After a change, rerun affected checks. The last 2.2 must still assess the entire deliverable, not just the latest chunk: list affected packages with `get_context.py --mode packages`, read their spec Quality Check sections, verify key behavior and integration, and run project-mandated hook/CI checks at their required point. Neither a lint pass nor an agent's report alone establishes acceptance.

#### 2.3 Rollback `[on demand]`

- A local defect within the agreed contract → repair the affected code and rerun affected checks.
- A confirmed key premise fails or public contract must change → pause affected work; report evidence, impact, attempts, and one recommended adjustment with the decisive tradeoff instead of merely listing options. Continue independent work. After user confirmation, update the original task's superseded decision and affected plan/checklist, then resume at that step.
- New evidence supplies a useful diagnostic lead → investigate it. Repeated unchanged failure, no lead, or expanding impact → report the impasse and next decision/dependency.

---

## Phase 3: Finish

Goal: ensure code quality, capture lessons, record the work.

#### 3.2 Debug retrospective `[on demand]`

If this task involved repeated debugging (the same issue was fixed multiple times), load the `trellis-break-loop` skill to:
- Classify the root cause
- Explain why earlier fixes failed
- Propose prevention

The goal is to capture debugging lessons so the same class of issue doesn't recur.

#### 3.3 Spec update `[required · once]`

Load the `trellis-update-spec` skill and review whether this task produced new knowledge worth recording:
- Newly discovered patterns or conventions
- Pitfalls you hit
- New technical decisions

Update the docs under `.trellis/spec/` accordingly. Even if the conclusion is "nothing to update", walk through the judgment.

#### 3.4 Commit changes `[conditional · once]`

**Spec-sync preamble**: before drafting commits, ask: did this task fix a bug or surface non-obvious knowledge that should land in `.trellis/spec/` so future-you (or future-AI) doesn't repeat the mistake? If yes, return to Phase 3.3 first — spec writes belong in the same task's commit batch, not as a forgotten follow-up.

Run this step only when the user separately authorizes committing. Implementation authorization alone does not authorize commit, push, publish, archive, or other external/destructive operations. When authorized, produce work commits before bookkeeping (archive + journal), never interleaved.

**Step-by-step**:

1. **Inspect dirty state**:
   ```bash
   git status --porcelain
   ```
   Snapshot every dirty path. If the working tree is clean, skip to 3.5.

2. **Learn commit style** from recent history (so drafted messages blend in):
   ```bash
   git log --oneline -5
   ```
   Note the prefix convention (`feat:` / `fix:` / `chore:` / `docs:` ...), language (中文/English), and length style.

3. **Classify dirty files into two groups**:
   - **AI-edited this session** — files you wrote/edited via Edit/Write/Bash tool calls in this session. You know what changed and why.
   - **Unrecognized** — dirty files you did NOT touch this session (could be the user's manual edits, leftover WIP from a previous session, or unrelated work). Do NOT silently include these.

4. **Draft a commit plan**. Group AI-edited files into logical commits (1 commit per coherent change unit, not 1 commit per file). Each entry: `<commit message>` + file list. List unrecognized files separately at the bottom.

5. **Present the plan once, ask for one-shot confirmation**. Format:
   ```
   Proposed commits (in order):
     1. <message>
        - <file>
        - <file>
     2. <message>
        - <file>

   Unrecognized dirty files (NOT in any commit — confirm include/exclude):
     - <file>
     - <file>

   Reply 'ok' / '行' to execute. Reply with edits, or '我自己来' / 'manual' to abort.
   ```

6. **On confirmation**: run `git add <files>` + `git commit -m "<msg>"` for each batch in order. Do not amend. Do not push.

7. **On rejection** (user replies "不行" / "我自己来" / "manual" / any pushback on the plan): stop. Do not attempt a second plan. Deliver the uncommitted result and keep the task available. If the user later commits by hand, verify those commits and obtain separate archive/journal authorization before step 3.5.

**Rules**:
- No `git commit --amend` anywhere — three-stage three-commit flow (work commits → archive commit → journal commit).
- Never push to remote in this step.
- If the user wants different message wording but accepts the file grouping, edit the message and re-confirm once — but if they reject the grouping, exit to manual mode without entering wrap-up.
- The batched plan is one prompt; do not prompt per commit.

#### 3.5 Wrap-up `[conditional · once]`

Run or offer `/trellis:finish-work` when the current task's work is committed or there is none to commit, and task archiving, session-journal writes, and any enabled automatic commits are authorized. A no-code task needs no artificial work commit. Otherwise deliver the verified result, identify the remaining authorized next action, and leave the original task available for continuation.

---

## Customizing Trellis (for forks)

This section is for developers who want to modify the Trellis workflow itself. All customization is done by editing this file; the scripts are parsers only.

### Changing what a step means

Edit the corresponding step's walkthrough body in the Phase 1 / 2 / 3 sections above. Critical invariants:
- No active task must triage first; read-only turns receive direct answers, and development task creation needs actual consent.
- Planning must distinguish lightweight PRD-only tasks from complex tasks that require `prd.md`, `design.md`, and `implement.md` before start.
- Every execution path must keep Phase 3.4's separate commit-authorization boundary reachable before `/trellis:finish-work`.

All tag blocks live in the `## Phase Index` section above, immediately after each phase summary:

| Scope | Corresponding tag |
|---|---|
| No active task (before Phase 1) | `[workflow-state:no_task]` (after the Phase Index ASCII art) |
| Active task record unreadable | `[workflow-state:task_error]` (repair the existing task before continuing) |
| All of Phase 1 (task created → ready for implementation) | `[workflow-state:planning]` (after Phase 1 summary) |
| Codex inline Phase 1 | `[workflow-state:planning-inline]` |
| Phase 2 + Phase 3.2–3.4 (implementation + check + wrap-up) | `[workflow-state:in_progress]` (after Phase 2 summary) |
| Codex inline Phase 2 + Phase 3.2–3.4 | `[workflow-state:in_progress-inline]` |
| After Phase 3.5 (archived) | `[workflow-state:completed]` (after Phase 3 summary; **currently DEAD**) |

### Changing the per-turn prompt text

Directly edit the body of the corresponding `[workflow-state:STATUS]` block. After editing, run `moksha-trellis update` (if you're a template maintainer) or restart your AI session (if you're customizing your own project) — no script changes required.

### Adding a custom status

Add a new block:

```
[workflow-state:my-status]
your per-turn prompt text
[/workflow-state:my-status]
```

Constraints:
- STATUS charset: `[A-Za-z0-9_-]+` (underscores and hyphens allowed, e.g. `in-review`, `blocked-by-team`)
- A lifecycle hook must write `task.json.status` to your custom value, otherwise the tag is never read
- Lifecycle hooks live in `task.json.hooks.after_*` and bind to one of `after_create / after_start / after_finish / after_archive`

### Adding a lifecycle hook

Add a `hooks` field to your `task.json`:

```json
{
  "hooks": {
    "after_finish": [
      "your-script-or-command-here"
    ]
  }
}
```

Supported events: `after_create / after_start / after_finish / after_archive`. Note that `after_finish` ≠ a status change (it only clears the active-task pointer); use `after_archive` for "task is done" notifications.

### Full contract

For the workflow state machine's runtime contract, the locations of all status writers, pseudo-statuses (`no_task` / `stale_<source_type>`), the hook reachability matrix, and other deep details, see:

- `.trellis/spec/cli/backend/workflow-state-contract.md` — runtime contract + writer table + test invariants
- `.trellis/scripts/inject-workflow-state.py` — actual parser (reads workflow.md only, no embedded text)
