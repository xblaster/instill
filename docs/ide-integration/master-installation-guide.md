# Master IDE Integration Installation Guide

This comprehensive guide provides installation instructions for skills, commands, and tasks across all supported IDEs. It serves as the central reference for IDE integration setup.

## Quick Reference Table

| IDE | Skills | Commands/Rules | Tasks | Documentation |
|-----|--------|----------------|-------|---|
| **Claude Code** | `.claude/skills/` | `.claude/commands/` | IDE system | [Guide](./claude-code-skills-installation.md) |
| **Gemini** | `.gemini/skills/` | - | - | [Guide](./gemini-skills-installation.md) |
| **Cursor** | `.cursor/skills/` | `.cursor/rules/` | IDE system | [Guide](./cursor-skills-installation.md) |
| **VS Code** | Extensions | `.vscode/tasks.json` | `.vscode/tasks.json` | [Guide](./vscode-tasks-installation.md) |
| **Antigravity** | `.agent/skills/` | GEMINI.md | IDE system | [Guide](./antigravity-skills-installation.md) |
| **Codex** | `.agents/skills/` | AGENTS.md | IDE system | [Guide](./codex-skills-installation.md) |
| **Cross-Platform** | `.agent/skills/` | - | - | [Guide](./cross-platform-skills-guide.md) |

## What Are Skills, Commands, and Tasks?

### Skills
**Reusable capabilities** that extend IDE functionality across projects.
- Installed once
- Available everywhere
- Persistent
- Examples: code formatters, linters, utilities

**Where to put them**:
- Claude Code: `.claude/skills/`
- Cursor: `.cursor/skills/`
- Cross-platform: `.agent/skills/`

**See**: [Understanding Skills, Commands, and Tasks](./skills-commands-tasks-guide.md)

### Commands
**Discrete executable actions** that perform specific project workflows.
- Project or IDE-level
- Formally defined
- Persistent
- Examples: deploy scripts, build commands

**Where to put them**:
- Claude Code: `.claude/commands/`
- Cursor: `.cursor/rules/` (project guidance)
- VS Code: `.vscode/tasks.json`

### Tasks
**Work items** that are tracked and managed in projects.
- Project-specific
- Tracked and scheduled
- Often ephemeral
- Examples: bug fixes, feature work

**Where to put them**:
- Claude Code: IDE task system
- Cursor: IDE task system
- VS Code: `.vscode/tasks.json`
- Codex: IDE task system

## Installation Guides by IDE

### Claude Code

**For Skills:**
1. Create `.claude/skills/my-skill/` directory
2. Add `SKILL.md` with metadata
3. Add optional `scripts/` and `references/` directories
4. Restart Claude Code

[Full Guide: Installing Skills in Claude Code](./claude-code-skills-installation.md)

**For Commands:**
1. Create `.claude/commands/my-command/` directory
2. Add `command.md` with command definition
3. Restart Claude Code

[Full Guide: Installing Commands in Claude Code](./claude-code-commands-installation.md)

### Gemini

**For Skills:**
1. Running `instill init` with the `gemini` target selected
2. Skills are automatically placed in `.gemini/skills/`

[Full Guide: Installing Skills in Gemini](./gemini-skills-installation.md)

### Cursor

**For Skills:**
1. Create `.cursor/skills/my-skill/` directory
2. Add `SKILL.md` with metadata
3. Add optional `scripts/` and `references/` directories
4. Restart Cursor

[Full Guide: Installing Skills in Cursor](./cursor-skills-installation.md)

**For Rules:**
1. Create `.cursor/rules/` directory
2. Add `.md` or `.mdc` files with project guidance
3. Rules are applied immediately

[Full Guide: Installing Rules in Cursor](./cursor-rules-installation.md)

### VS Code

**For Tasks:**
1. Create `.vscode/tasks.json`
2. Define tasks using JSON Schema 2.0.0
3. Use in Command Palette or terminal

[Full Guide: Installing Tasks in VS Code](./vscode-tasks-installation.md)

**Note**: VS Code uses extensions for reusable capabilities, not skills.

### Antigravity

**For Skills:**
1. Create `.agent/skills/my-skill/` directory
2. Add `SKILL.md` with metadata
3. Add optional `scripts/` and `references/` directories
4. Restart Antigravity

[Full Guide: Installing Skills in Antigravity](./antigravity-skills-installation.md)

### Codex

**For Skills:**
1. Create `.agents/skills/my-skill/` directory
2. Add `SKILL.md` with metadata
3. Add optional `scripts/` and `references/` directories

[Full Guide: Installing Skills in Codex](./codex-skills-installation.md)

**For Agent Instructions:**
1. Create `AGENTS.md` at project root
2. Add agent guidance and project standards
3. Instructions discovered hierarchically

[Full Guide: Installing Agent Instructions in Codex](./codex-agents-installation.md)

### Cross-Platform (Recommended)

**For Maximum Portability:**
1. Use `.agent/skills/` standard directory
2. Skills work across Cursor, Codex, Antigravity, Claude Code, Windsurf
3. Follow universal `SKILL.md` metadata format

[Full Guide: Cross-Platform Skills Installation](./cross-platform-skills-guide.md)

## The SKILL.md Standard Format

All IDEs expect this metadata structure in `SKILL.md`:

```markdown
# Skill Name

**Name:** unique-skill-identifier
**Description:** One-line description of the skill

## Overview

Detailed explanation of the skill's purpose and capabilities.

## Installation

Setup steps (if any).

## Usage

How to invoke and use this skill.

## Examples

Practical code examples.

## Requirements

Any dependencies or prerequisites.
```

## Version-Specific Differences

### Cursor 2.4+ (January 2026)

- ✓ Full support for agent skills with multi-location discovery
- ✓ Rules system (.cursor/rules/) fully implemented
- ✓ Deprecates legacy .cursorrules format
- ⚠ SSH mode may have skill discovery issues

### VS Code (2026)

- ✓ Task system stable and well-documented
- ✓ Multi-root workspace support
- ✓ Extensive extension ecosystem
- ✗ No native skills system

### Codex (2026)

- ✓ Advanced hierarchical skill discovery
- ✓ Configurable search limits and paths
- ✓ Agent instructions (AGENTS.md) system
- ✓ Built-in skills in `.codex/skills/.system/` (don't modify)

### Antigravity (2026)

- ✓ Progressive Disclosure pattern for efficient skill loading
- ✓ Symlink support for cross-project skill sharing
- ⚠ Potential conflicts between global context files
- ✓ `.agent/skills/` standard support

### Claude Code (Latest)

- ✓ Skills (.claude/skills/) with auto-discovery
- ✓ Commands (.claude/commands/) system
- ✓ Full IDE integration

## Common Installation Issues and Solutions

### Skill Not Appearing in IDE

| IDE | Check |
|-----|-------|
| Claude Code | `.claude/skills/skill-name/SKILL.md` exists |
| Cursor | `.cursor/skills/skill-name/SKILL.md` exists |
| Codex | `.agents/skills/skill-name/SKILL.md` in search path |
| Antigravity | `.agent/skills/skill-name/SKILL.md` exists |

**Solution**: Verify directory structure and metadata, then restart IDE.

### Task Not Appearing in Palette (VS Code)

1. Verify `.vscode/tasks.json` has valid JSON syntax
2. Check that each task has a unique `label`
3. Ensure `type` is `shell` or `process`
4. Restart VS Code

### Agent Instructions Not Applied (Codex)

1. Verify `AGENTS.md` or `AGENTS.override.md` at project root
2. Check for maximum byte limit exceeded
3. Verify Markdown syntax is valid
4. Restart Codex

## Best Practices Across All IDEs

1. **Use clear naming**: kebab-case for skills/commands (e.g., `my-skill`)
2. **Document thoroughly**: Clear descriptions and examples
3. **Test widely**: Verify on target IDEs before distribution
4. **Version control**: Commit all configurations to git
5. **Consider portability**: Use `.agent/skills/` for cross-IDE compatibility
6. **Keep it simple**: Start with basic functionality, add features incrementally
7. **Provide examples**: Show practical usage patterns
8. **Handle errors**: Plan for failure cases and provide helpful messages

## Troubleshooting Decision Tree

```
Are you installing skills?
├─ Claude Code?
│  ├─ Check: .claude/skills/name/SKILL.md exists
│  └─ Solution: [Claude Code Guide](./claude-code-skills-installation.md)
│
├─ Cursor?
│  ├─ Check: .cursor/skills/name/SKILL.md exists
│  └─ Solution: [Cursor Guide](./cursor-skills-installation.md)
│
├─ Codex?
│  ├─ Check: .agents/skills/name/SKILL.md in search path
│  └─ Solution: [Codex Guide](./codex-skills-installation.md)
│
└─ Antigravity?
   ├─ Check: .agent/skills/name/SKILL.md exists
   └─ Solution: [Antigravity Guide](./antigravity-skills-installation.md)

Are you installing rules/commands?
├─ Cursor rules?
│  ├─ Check: .cursor/rules/*.md or .mdc exists
│  └─ Solution: [Cursor Rules Guide](./cursor-rules-installation.md)
│
├─ Claude Code commands?
│  ├─ Check: .claude/commands/name/command.md exists
│  └─ Solution: [Claude Code Commands Guide](./claude-code-commands-installation.md)
│
└─ Codex AGENTS.md?
   ├─ Check: AGENTS.md at project root or ~/.codex/
   └─ Solution: [Codex Agents Guide](./codex-agents-installation.md)

Are you installing tasks?
├─ VS Code?
│  ├─ Check: .vscode/tasks.json with valid schema 2.0.0
│  └─ Solution: [VS Code Tasks Guide](./vscode-tasks-installation.md)
│
└─ Other IDEs?
   └─ Use built-in task system (varies by IDE)
```

## Summary Table: Technology Comparison

| Feature | Claude Code | Cursor | VS Code | Codex | Antigravity |
|---------|---|---|---|---|---|
| Skills System | ✓ | ✓ | ✗ | ✓ | ✓ |
| Reusable Capabilities | ✓ | ✓ | Extensions | ✓ | ✓ |
| Tasks Support | ✓ | ✓ | ✓ | ✓ | ✓ |
| Cross-Platform Standard | `.claude/` | `.cursor/` | - | `.agents/` | `.agent/` |
| Recommended for Teams | `.agent/` | `.agent/` | - | `.agent/` | `.agent/` |

## Next Steps

1. **Choose your IDE**: [Installation Guide by IDE](#installation-guides-by-ide)
2. **Understand concepts**: [Skills vs Commands vs Tasks](./skills-commands-tasks-guide.md)
3. **Go cross-platform**: [Cross-Platform Skills Guide](./cross-platform-skills-guide.md)
4. **Share with team**: [Team Integration](./cross-platform-skills-guide.md#team-integration)

## Related Documentation

- [Skills vs Commands vs Tasks](./skills-commands-tasks-guide.md)
- [Cursor Skills vs Rules](./cursor-rules-installation.md#cursor-rules-vs-skills)
- [Codex Agent Instructions](./codex-agents-installation.md)
- [Cross-Platform Best Practices](./cross-platform-skills-guide.md#best-practices)

## Getting Help

For IDE-specific issues:
- **Claude Code**: See [Claude Code Guides](./claude-code-skills-installation.md)
- **Cursor**: See [Cursor Documentation](https://cursor.com/docs/)
- **VS Code**: See [VS Code Documentation](https://code.visualstudio.com/docs/)
- **Codex**: See [Codex Documentation](https://developers.openai.com/codex/)
- **Antigravity**: See [Antigravity Documentation](https://antigravity.google/docs/)

---

**Last Updated**: 2026-02-09
**Version**: 1.0
**Scope**: Comprehensive IDE integration guide for skills, commands, and tasks installation
