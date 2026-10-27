---
name: trellis-before-dev
description: "Discovers and injects project-specific coding guidelines from .trellis/spec/ before implementation begins. Reads spec indexes, pre-development checklists, and shared thinking guides for the target package. Use when starting a new coding task, before writing any code, switching to a different package, or needing to refresh project conventions and standards."
---

Establish the relevant development guidelines before writing code. Use complete, current task/spec content already supplied to this agent; a hook marker alone does not prove completeness. Read only missing, truncated, index-only, or changed parts. After compaction or a new session, recover the affected information. These steps are coverage requirements, not an instruction to reread intact content.

Execute these steps:

1. **Establish current task artifacts** (read only parts not already complete and current):
   - `prd.md` for requirements and acceptance criteria
   - `design.md` if present for technical design
   - `implement.md` if present for execution order and validation plan

2. **Discover packages and their spec layers** if the affected package/spec map is not already current:
   ```bash
   python3 ./.trellis/scripts/get_context.py --mode packages
   ```

3. **Identify which specs apply** to your task based on:
   - Which package you're modifying (e.g., `cli/`, `docs-site/`)
   - What type of work (backend, frontend, unit-test, docs, etc.)
   - Any spec/research paths referenced by the task artifacts

4. **Use the spec index** for each relevant module (read it if not already complete and current):
   ```bash
   cat .trellis/spec/<package>/<layer>/index.md
   ```
   Follow the **"Pre-Development Checklist"** section in the index.

5. **Use the specific guideline files** listed in the Pre-Development Checklist that are relevant to your task. The index is NOT the goal — it points to the actual guidelines (e.g., `error-handling.md`, `conventions.md`, `mock-strategies.md`). Read missing or incomplete guidelines; do not skip a required rule merely because its index was supplied.

6. **Use relevant shared guides**, reading them if not already complete and current:
   ```bash
   cat .trellis/spec/guides/index.md
   ```

7. **For a non-trivial task, state the change boundary before writing code.** Non-trivial means it touches more than one file, crosses a layer, changes a public interface, or edits code you did not just write. Write down:
   - the smallest behavior gap between what happens now and what should happen
   - where that behavior actually lives (not where it is easiest to intercept)
   - which files you expect to change, and why each one is necessary
   - what you are explicitly not doing in this task
   - if a local refactor is needed, how you will show it did not change behavior

   A small, well-scoped change does not need this — do it directly.

   If the real scope turns out to be clearly larger than this, say so and why before continuing. Do not widen the change on your own.

8. Understand the coding standards and patterns you need to follow, then proceed with your development plan.

This step is **mandatory** before writing any code.
