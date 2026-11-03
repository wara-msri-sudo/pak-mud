# waraflow: Agent Engineering Workflow (Baseline)

A project-agnostic workflow for AI coding agents. Combines agile delivery, clean code, clean architecture, human decision gates, and evidence-based verification.

**Route the request. Run the workflow. Verify the result. Keep the human in charge of decisions.**

---

## 1. How to use this baseline

1. Copy this file into any project (for example `docs/waraflow.md`) or load it as a skill.
2. Fill in the **Project adapter** (section 12) once per project: commands, stack, conventions.
3. Point your agent rules file (`CLAUDE.md`, `AGENTS.md`, etc.) at it with one line: "Follow `docs/waraflow.md` for all code changes."
4. Start tasks with the prompt in section 13.

Nothing in the stages below is tied to a language, framework, or repository. Project specifics live only in the adapter.

---

## 2. Principles

- **Contract before code.** Agree on what "done" means before building.
- **Smallest justified change.** Thin vertical slices, no drive-by refactors.
- **Humans decide, agents propose.** Architecture and risky choices are never made silently.
- **Evidence over claims.** No PASS without observed proof.
- **Never weaken checks.** Tests, lint rules and thresholds are not loosened to get a pass.
- **Mistakes become guardrails.** A repeated problem is a missing constraint. Encode it.
- **Docs are part of the change.** Architecture state and decisions ship with the code.

---

## 3. Workflow overview

```
0  Baseline check
1  Request contract            -> GATE: human approves contract
2  Playbook
3  Context and design          -> GATE: human decides options
4  Implement (TDD, clean code)    each step: drift check + checkpoint commit
5  Verify
     5A Real behavior
     5B Change review (B1-B7)
   Outcome: PASS | FAIL (fix, rerun, max 3 loops) | BLOCKED
   Self-audit
6  Reviewable handoff
7  Retrospective
```

Always-on gates (any stage):
- **Risky or irreversible action** -> ask first.
- **Scope grows beyond the contract** -> stop, propose a split, ask.
- **Never weaken** tests, lint rules, or thresholds without human approval.

---

## 4. Gate rules

A gate means the agent **stops and waits** for the human.

| Gate | When | Skippable? |
|---|---|---|
| Contract approval | After stage 1 | Yes for tiny tasks: state assumptions and continue |
| Design decision | Stage 3, any architecture decision or real ambiguity | No |
| Risky action | Any stage | No |
| Scope change | Any stage | No |
| Weakening a check | Any stage | No |

**Risky or irreversible actions** include: database migrations, deleting data or files, changing public APIs or contracts, adding dependencies, touching auth, payments or secrets, force-pushing, rewriting history, deploying.

If the human is unreachable, the agent does preparatory work, lists the open decisions, and stops. It never guesses.

---

## 5. Stages in detail

### Stage 0. Baseline check
Before any change, run the project's tests, lint, type check and build (commands from the adapter). Record the results.
- If the baseline is already red, report it. Do not blame the new change later and do not fix unrelated failures silently.

### Stage 1. Request contract (agile)
Write, in a few lines:
- **User story:** As a `<who>`, I want `<what>`, so that `<why>`. For bugs: expected vs actual behavior.
- **Acceptance criteria:** numbered, testable, Given / When / Then. Each must be observable.
- **Constraints:** what must not change (files, APIs, behaviors, styles).
- **Out of scope:** what will deliberately not be done.
- **Assumptions:** anything guessed.
- **Definition of Done:** default list below, extended per project.

Default Definition of Done:
- [ ] Every acceptance criterion passes with evidence
- [ ] Tests added or updated
- [ ] Code simplified (clean code pass)
- [ ] Security, performance, concurrency, resilience checked where applicable
- [ ] Architecture docs updated if the architecture changed
- [ ] Lint, type check and CI pass
- [ ] Handoff written

Check the story is **INVEST** (independent, negotiable, valuable, estimable, small, testable). If too big, split into vertical slices (each works end to end), do the first, and list the rest as next slices.

**GATE:** human approves the contract (skippable for tiny tasks).

### Stage 2. Playbook
Pick exactly one and say which:

| Type | Playbook |
|---|---|
| Bug fix | Reproduce first with a failing test or captured output. Find the root cause, not the symptom. Fix. Rerun the same reproduction. |
| Feature | Build the thinnest vertical slice that meets the criteria. Defer the rest. |
| Refactor | Pin current behavior with tests first. Change structure only. Tests pass before and after. |
| Performance | Take a baseline measurement. Change one thing. Measure again under the same conditions. |

### Stage 3. Context and design (clean architecture)
1. **Trace behavior (how):** follow the code path from entry point to symptom or insertion point.
2. **Find intent (why):** git history, comments, tests, docs, existing decisions.
3. **Read** `architecture.md` and the decision index. Follow accepted decisions.
4. **Define boundaries** using the clean architecture rules (section 8).
5. **Decide or ask:** apply the decision gate (section 6).

Optional delegation for large tasks: split independent work across parallel agents; compare alternative designs with separate agents and present them as options.

**GATE:** human decides any architecture decision. Agent does not write code that depends on an open decision.

### Stage 4. Implement (clean code, small steps)
Red / green / refactor, one acceptance criterion at a time:
1. **Red:** write or update a test for one criterion. See it fail for the right reason.
2. **Green:** write the simplest code that passes.
3. **Refactor:** apply clean code rules (section 7) while tests stay green.
4. **Drift check:** compare the diff to the contract. Anything not tied to a criterion is removed or flagged.
5. **Checkpoint commit:** small, working, clearly described.

No unrelated refactors, no new dependencies unless required (and dependencies are a risky action, so ask).

### Stage 5. Verify
Run Part A, then Part B, then decide the outcome. Verification checks the real application, not only unit tests.

#### Part A. Real behavior
1. **LAUNCH:** start the app with the project's real startup command. Wait for readiness.
2. **DOCTOR:** check health and required access (database, env vars, secrets, ports, credentials, tools). If something required is missing, stop: BLOCKED.
3. **DRIVE:** exercise the changed behavior through the real surface (UI, CLI or API), following the actual user journey.
4. **EVIDENCE:** capture outputs and artifacts (command output, responses, logs, screenshots, profiles). Save to files, note the paths.
5. **CLEANUP:** stop processes you started, delete temporary data you created.

Match the proof to the change:

| Change touches | Proof required |
|---|---|
| UI | Completed user journey, before and after screenshots |
| CLI | Command run and exit status |
| API | Request and response, status codes, error cases |
| Storage | Read-back of the stored value |
| Performance | Comparable before and after measurements |

#### Part B. Change review
Run after Part A. Rerun tests after any edit made here. Checks that do not apply must be marked **n/a with a reason**, never silently skipped.

**B1. Simplify (clean code).** Behavior must not change.
- Rename anything that hides intent. Split functions doing more than one thing.
- Remove duplication, dead code, commented-out code, unused imports.
- Replace magic values with named constants. Make error handling explicit.
- Check architecture: no inner layer depends on an outer one.
- Run formatter, linter, type checker. Rerun all tests. If behavior changed, revert that edit.

**B2. Security.**
- Input validation and output encoding (injection, XSS, path traversal, unsafe deserialization).
- Authentication and authorization on every new or changed entry point. No IDOR or privilege escalation.
- No secrets in code, logs, fixtures or error messages. No sensitive data logged.
- New or updated dependencies are necessary, maintained, and pass the audit tool.
- Safe defaults: least privilege, fail closed, no debug flags left on.

**B3. Requirements and architecture.**
- Traceability table: each acceptance criterion, its evidence (path or command), PASS or FAIL.
- Constraints and out-of-scope respected. Remove behavior nobody asked for.
- If the change made an architecture decision: a decision note exists with the human's recorded approval, and `architecture.md` is current. Otherwise FAIL.
- Dependency rule holds in the code, not only on paper.

**B4. Testing.**
- Each acceptance criterion maps to at least one test.
- Bug fixes have a test that fails before the fix and passes after (show both runs).
- Edge cases and error paths are covered, not only the happy path.
- Tests are deterministic and independent. None skipped, disabled or flaky.
- Full relevant suite, lint and type checks pass. Report commands and results.

**B5. Performance.**
- Compare to the baseline under the same conditions (data size, load, hardware).
- Look for N+1 access, unbounded loops or result sets, missing pagination, wasted work on hot paths.
- Indexes, caching and timeouts exist where needed.
- Record before and after numbers. A regression above the agreed budget is a FAIL.

**B6. Concurrency.**
- List the shared state touched (variables, caches, rows, files).
- Look for races, check-then-act gaps, lost updates, deadlock risk.
- Operations that may be retried or run twice are idempotent.
- Use locks, transactions, atomic operations or versioning where needed.
- Add a parallel test and run it several times.

**B7. Resilience.**
- Test dependency failures: timeouts, errors, slow responses, partial outages.
- Calls to other services have timeouts, bounded retries with backoff, and fallbacks or circuit breakers where sensible.
- Failures degrade gracefully, never corrupt data, and give the user a clear error.
- Interrupted operations (crash, restart, half-finished write) recover to a consistent state.
- Logs and metrics are enough to diagnose the failure.

#### Outcome
- **PASS:** Part A evidence and every applicable Part B check are proven. State which and where the evidence lives.
- **FAIL:** name the defect with evidence. Return to stage 4, fix, rerun the whole verification. **Maximum 3 loops.** After that, stop and report what was tried instead of thrashing.
- **BLOCKED:** name exactly which access or tool is missing. Never fake a pass.

#### Self-audit (before handoff)
Re-read the original request and the contract. Tick each item. Anything not done goes into `unverified_checks`.

### Stage 6. Reviewable handoff
End with this block, filled in honestly:

```
tested_commit:        <commit hash that was verified>
story_and_criteria:   <story + each acceptance criterion, PASS/FAIL>
definition_of_done:   <checklist with status>
diff:                 <summary or patch>
commands_results:     <what was run and key output>
evidence_paths:       <logs, screenshots, profiles>
simplification:       <what was cleaned up in B1>
security_findings:    <found/fixed, or none and what was checked>
performance:          <before/after numbers, or n/a with reason>
concurrency:          <shared state reviewed, parallel test result, or n/a>
resilience:           <failure cases tested, or n/a>
architecture_changes: <decision note paths + doc sections updated, or none>
unverified_checks:    <what still needs verification>
remaining_risks:      <known gaps>
next_slices:          <deferred stories and follow-ups>
```

Rules:
- `tested_commit` is the exact verified commit. If code changes afterward, verify again and update it.
- Every PASS points to evidence.
- Gaps are never hidden. Unchecked items go in `unverified_checks`, weak spots in `remaining_risks`.
- Follow the project's own review and merge rules for submission (PR description, ticket, commit message).

### Stage 7. Retrospective
Runs after every handoff as a short check, and always when a mistake, rework or correction has happened more than once.

Questions:
1. What worked and should be kept?
2. What went wrong or took longer than it should have?
3. What single change would prevent it next time?

**Guardrail ladder** (use the highest rung that fits):
1. **Architecture:** restructure so the mistake is impossible.
2. **Types, lint, CI:** add a check that blocks it.
3. **Tests:** add a regression test that catches it.
4. **Rules:** a short, specific, checkable line in the rules file, only for what cannot be enforced mechanically.

Move repetitive mechanical work into scripts.

Output:
```
mistake:        <one sentence>
fix:            <what changed now>
guardrail:      <rung + what was added + where>
why_this_rung:  <one line>
next_slice:     <next story to pick up>
```

Also prune: mark outdated decisions as superseded, delete obsolete rules, keep `architecture.md` current.

---

## 6. Decision gate: how the agent asks

**Must ask** for:
- Any architecture decision: new layer, module, boundary, framework, database, queue or external service; changed dependency direction, data model or public API contract.
- Any exception to a clean architecture rule.
- Any real ambiguity where reasonable options lead to different designs.
- Any conflict with an accepted decision.

**May decide alone:**
- Anything already settled by conventions, `architecture.md` or an accepted decision. Say so.
- Small local choices inside one function (names, private helpers).

**Format** (one question per decision, batch open ones up front):

```
Decision: <what needs deciding>
Context:  <why it matters, 1-2 lines>

Option A: <name>
  Pros: ...
  Cons: ...
Option B: <name>
  Pros: ...
  Cons: ...
Option C: <name>   (include "do nothing / keep as is" when relevant)
  Pros: ...
  Cons: ...

Recommendation: <option + one-line reason>
```

Rules:
- At least two real options with honest pros and cons. No strawmen.
- A recommendation is allowed but is never the decision.
- Do not write code that depends on an open decision. Independent work may continue.
- Record the human's answer in a decision note and update `architecture.md`.

---

## 7. Clean code rules

Follow the project's existing conventions first. These fill the gaps.

- **Naming:** names reveal intent and use domain vocabulary. Avoid abbreviations and generic names (`data`, `info`, `util`).
- **Functions:** do one thing at one level of abstraction. Few parameters (aim for 3 or fewer). No hidden side effects. Prefer early returns over deep nesting. Avoid boolean flag parameters.
- **Structure:** single responsibility per module. Remove duplication, but abstract only when the pattern is real (rule of three). No dead code. Named constants instead of magic values.
- **Errors:** explicit exceptions or result types. Never swallow errors. Add context. Fail fast on invalid input. Avoid passing null where an empty value or option type works.
- **Comments:** code explains what, comments explain why. Delete comments that restate the code.
- **Tests:** clean code too. Readable, one concept per test, arrange / act / assert, descriptive names.
- **Boy Scout rule:** leave code a little cleaner than found, within the task scope.

---

## 8. Clean architecture rules

**Layers (inside to outside):**
1. Entities: enterprise-wide business rules.
2. Use cases: application-specific logic that orchestrates entities.
3. Interface adapters: controllers, presenters, gateways, repositories.
4. Frameworks and drivers: web framework, database, UI, external services.

**Rules:**
- **Dependency rule:** source dependencies point inward only. Inner layers know nothing about outer ones.
- Business logic is independent of frameworks, databases, UI and delivery mechanism, and is testable without them.
- Cross boundaries through interfaces (ports) owned by the inner layer, implemented as adapters outside.
- Pass simple data across boundaries, not framework or ORM objects.
- Depend on abstractions. Inject dependencies at the edge.
- Group by feature or domain first, technical type second.
- Delay decisions about frameworks, databases and vendors. Keep them replaceable.

**Design checks:**
- Can the core logic run in a test with no network, database or UI?
- Does any import point outward? If yes, introduce a port.
- Is a new abstraction justified by a real second use or boundary, not speculation?
- Would swapping the database or web framework touch only the outer layer?

Prefer the simplest structure that satisfies these rules for the size of the problem. Do not impose layers on a small script.

---

## 9. Architecture documentation (must stay current)

Whenever an architecture decision is made, the agent documents it **in the same commit or PR as the code**.

**Files:**
- `docs/architecture.md`: current state. Layers, modules, boundaries, key dependencies, data flow. Short, always matches the code.
- `docs/decisions/NNNN-title.md`: one page per decision. Never edit an old one; add a new one that supersedes it.
- `docs/decisions/README.md`: index, one line per decision.

**Decision note template:**
```markdown
# NNNN. <Title>

- Status: proposed | accepted | superseded by NNNN
- Date: YYYY-MM-DD
- Decided by: <human name>

## Context
<why this decision is needed>

## Options considered
- Option A: pros / cons
- Option B: pros / cons

## Decision
<what was chosen and why>

## Consequences
<what gets easier, what gets harder, follow-ups>
```

**Rules:**
- Status moves from proposed to accepted only after the change passes verification and the human has approved.
- A decision made in chat is recorded as a note. It is not left in the conversation.
- A change that makes an architecture decision without a note and human approval fails check B3.

---

## 10. Organizing project knowledge (scales to thousands of tickets)

Keep always-loaded context small. Load detail only when needed.

| Layer | Content | Loaded |
|---|---|---|
| Rules file (`CLAUDE.md` / `AGENTS.md`) | Stack, run/test/lint commands, about 10 universal rules, pointers to docs. Under about 100 lines. No ticket history. | Always |
| This workflow | The process in this file | When doing code changes |
| `docs/` by topic | Architecture, glossary, API conventions, testing guide | When relevant |
| Folder-level rules | Rules for one module (for example `src/payments/CLAUDE.md`) | When working in that folder |
| Decision notes | Why the architecture is the way it is | When designing |

Principles:
- **Tickets are not knowledge.** Keep them in the tracker. Handoffs live in PR descriptions.
- Extract only durable lessons: decisions to decision notes, repeated mistakes to guardrails in code, module rules to the nearest folder rules file.
- Enforce rules in code (types, lint, tests, CI) before writing them in prose.
- Keep a `docs/README.md` index and a short domain glossary.
- Retrospective prunes: obsolete rules are deleted, not accumulated.

---

## 11. Optional extras (add when the need shows up)

- **Progress log:** a short running list (done, doing, next) that survives context resets in long tasks.
- **Independent verifier:** a separate agent that did not write the code runs stage 5, for high-risk changes.
- **Plan approval for large tasks:** present the slice plan and get approval before stage 3.

---

## 12. Project adapter (fill in per project)

Copy this section into each project and fill it in. The workflow reads from here.

```markdown
# Project adapter

## Stack
- Language / framework:
- Datastore:
- Hosting / deploy:

## Commands
- Install:
- Run (start the real app):
- Readiness check (port / URL / log line):
- Test (unit):
- Test (integration / e2e):
- Lint:
- Type check:
- Build:
- Dependency audit:
- Performance / profiling:

## Verification surface
- How to drive the app (UI / CLI / API, tools, test accounts):
- Required access (env vars, secrets location, services):

## Conventions
- Naming / folder structure:
- Branch and commit style:
- PR / review / merge rules:

## Extra Definition of Done items
-

## Performance budgets
-

## Risky areas (always ask first)
- (for example: payments, auth, migrations, public API)

## Docs locations
- Architecture: docs/architecture.md
- Decisions: docs/decisions/
- Glossary:
```

---

## 13. Prompts

**Standard task**
```
Follow docs/waraflow.md.
Task: <describe the change>
Write the story and Given/When/Then acceptance criteria first and wait for my approval.
Ask me to decide any architecture option, with pros and cons.
Verify in the real app and return the handoff.
```

**Tiny task** (contract gate skipped)
```
Follow docs/waraflow.md.
Small fix: <describe>
State your assumptions, then implement with a test, verify, and return the handoff.
```

**Resume after a context reset**
```
Follow docs/waraflow.md. Read docs/architecture.md and docs/decisions/README.md.
Continue the task: <describe>. Current stage: <stage>. Progress log: <paste or path>.
```

**Retrospective only**
```
Follow docs/waraflow.md stage 7 for the last task.
The same mistake happened: <describe>. Propose a guardrail using the ladder.
```

---

## 14. Quick checklist

- [ ] Baseline run and recorded
- [ ] Contract approved
- [ ] Playbook chosen
- [ ] Architecture decisions asked, answered, documented
- [ ] Built with red / green / refactor, small commits
- [ ] Real behavior verified with evidence
- [ ] B1-B7 done or marked n/a with reason
- [ ] Outcome PASS, with no checks weakened
- [ ] Self-audit done
- [ ] Handoff complete
- [ ] Retrospective: guardrail added, docs pruned
