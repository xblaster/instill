# Understanding Skills, Commands, and Tasks

This guide clarifies the semantic differences between skills, commands, and tasks in Claude Code and other IDEs.

## Conceptual Model

| Concept | Scope | Persistence | Usage | When to Use |
|---------|-------|-------------|-------|------------|
| **Skill** | Reusable capability | Persistent, cross-project | Available anywhere | Utility functionality, code patterns |
| **Command** | Discrete action | Persistent, project-level | Invoked manually | Specific workflows, automation |
| **Task** | Work item | Project-specific | Tracked and scheduled | Development workflows, CI/CD |

## Skills

**Definition**: Reusable capabilities that extend IDE functionality and are available across projects.

**Characteristics**:
- Installed once per IDE
- Available across all projects
- Persistent across IDE sessions
- General-purpose or multi-project utility
- Examples: code formatters, linters, deployment scripts

**Location**: `.claude/skills/`

**Use When**: You need functionality that applies to multiple projects or is generally useful.

### Skill Lifecycle

```
Create → Install → Discover → Use → Persist
  ↓        ↓          ↓        ↓       ↓
1. SKILL.md    2. Restart    3. IDE    4. Invoke   5. Next
   created         loads       lists     skill      session
```

## Commands

**Definition**: Discrete executable actions that perform specific tasks in a project workflow.

**Characteristics**:
- Installed at project or IDE level
- Defined execution behavior
- Persistent across sessions
- Single-purpose or workflow-specific
- Examples: build commands, deploy scripts, test runners

**Location**: `.claude/commands/`

**Use When**: You need to run specific actions or workflows that are important enough to formalize.

### Command Lifecycle

```
Create → Install → Discover → Execute → Persist
  ↓        ↓          ↓         ↓        ↓
1. Cmd    2. Restart    3. IDE    4. Invoke   5. Next
   file       loads       lists     command    session
```

## Tasks

**Definition**: Work items or discrete units of work that are tracked and managed in a project.

**Characteristics**:
- Project-specific
- Tracked and scheduled
- Typically ephemeral or time-limited
- Often part of larger workflows
- Examples: code review items, bug fixes, feature work

**Location**: Managed by IDE task system (varies by IDE)

**Use When**: You need to track and manage work items, schedule tasks, or manage project workflows.

### Task Lifecycle

```
Create → Assign → Track → Complete → Archive
  ↓        ↓        ↓         ↓          ↓
1. Define  2. User  3. IDE    4. Mark    5. Store
   task   assigned  tracks   done       history
```

## Decision Tree

Use this decision tree to choose the right concept:

```
Is this functionality or capability?
├─ YES → Is it reusable across projects?
│  ├─ YES → Use a SKILL
│  └─ NO → Is it an executable action?
│     ├─ YES → Use a COMMAND
│     └─ NO → Use a TASK
│
└─ NO → Is it a discrete action?
   ├─ YES → Is it important enough to formalize?
   │  ├─ YES → Use a COMMAND
   │  └─ NO → Use a TASK
   │
   └─ NO → Is it work to be tracked?
      └─ YES → Use a TASK
```

## Claude Code Examples

### Example 1: Code Formatter

**Question**: Where do I put a code formatter?

**Analysis**:
- Is it functionality? YES
- Reusable across projects? YES
- Answer: **Use a SKILL**

**Implementation**: `.claude/skills/code-formatter/`

### Example 2: Deploy to Production

**Question**: Where do I put a deploy-to-production action?

**Analysis**:
- Is it functionality? YES
- Reusable across projects? Possibly, but workflow-specific
- Is it a discrete action? YES
- Important enough to formalize? YES
- Answer: **Use a COMMAND**

**Implementation**: `.claude/commands/deploy-production/`

### Example 3: Fix Bug #123

**Question**: Where do I track a bug fix?

**Analysis**:
- Is it functionality? NO
- Is it a discrete action? Maybe, but it's primarily work
- Is it work to be tracked? YES
- Answer: **Use a TASK**

**Implementation**: Project task system

## Best Practices

1. **Start with the question**: What are you actually building?
   - Functionality → Skills or Commands
   - Work to track → Tasks

2. **Consider reusability**: Will this be used in multiple contexts?
   - Yes → Skill
   - No → Command or Task

3. **Consider scope**: Is this single-project or multi-project?
   - Multi-project → Skill
   - Single-project → Command or Task

4. **Consider formality**: Does this need to be tracked or managed?
   - Yes → Command or Task
   - No → Skill

## IDE-Specific Implementations

| IDE | Skills | Commands | Tasks |
|-----|--------|----------|-------|
| Claude Code | `.claude/skills/` | `.claude/commands/` | IDE task system |
| Cursor | `.cursor/skills/` | Rules (`.cursor/rules/`) | IDE task system |
| VS Code | Extensions | `.vscode/tasks.json` | `.vscode/tasks.json` |
| Antigravity | `.agent/skills/` | (Custom) | IDE task system |
| Codex | `.agents/skills/` | AGENTS.md | IDE task system |

## Summary

- **Skills**: Reusable capabilities (use `.claude/skills/`)
- **Commands**: Discrete actions (use `.claude/commands/`)
- **Tasks**: Work items to track (use IDE task system)

Choose the right concept based on your use case, and follow the IDE-specific installation guides for implementation.

## See Also

- [Installing Skills in Claude Code](./claude-code-skills-installation.md)
- [Installing Commands in Claude Code](./claude-code-commands-installation.md)
- [Installing Tasks in VS Code](./vscode-tasks-installation.md)
