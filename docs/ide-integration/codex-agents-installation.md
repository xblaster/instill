# Installing Agent Instructions in Codex

Agent instructions in Codex are project-level guidance files that direct Codex agent behavior. They are stored as `AGENTS.md` files and discovered hierarchically from the repository root.

## Important: AGENTS.md is For Agent Guidance

`AGENTS.md` is specifically for providing instructions and guidance to Codex agents:

- **Skills** (`.agents/skills/`): Reusable capabilities and tools
- **Agent Instructions** (`AGENTS.md`): Guidance on how agents should work

For skills documentation, see [Installing Skills in Codex](./codex-skills-installation.md).

## Discovery Order and Precedence

Codex discovers agent instructions in this order (highest to lowest priority):

1. **AGENTS.override.md** - Highest priority override (home directory)
2. `~/.codex/AGENTS.override.md` - Global override for all projects
3. `$GIT_ROOT/AGENTS.override.md` - Repository root override
4. `$GIT_ROOT/AGENTS.md` - Repository root standard
5. `.git/` parent traverse - Search parent directories
6. Fallback files - Configured in `~/.codex/config.toml`

## Directory Structure

Agent instruction files can be placed at multiple levels:

```
project/
├── AGENTS.md                  (repository root)
├── AGENTS.override.md         (optional override)
├── src/
│   ├── AGENTS.md              (directory-level instructions)
│   └── main.py
├── tests/
│   └── AGENTS.md              (test-specific instructions)
├── .git/
└── ~/.codex/AGENTS.md         (global instructions)
└── ~/.codex/AGENTS.override.md (global override)
```

## AGENTS.md Format

AGENTS.md files use Markdown format with structured sections:

```markdown
# Project Agent Instructions

This document provides guidance for Codex agents working on this project.

## Code Style

- Use consistent indentation (2 spaces for JavaScript, 4 for Python)
- Follow the team's naming conventions
- Keep functions small and focused

## Testing Requirements

- Write tests for all new features
- Maintain at least 80% code coverage
- Include both unit and integration tests

## Version Control Practices

- Write clear, descriptive commit messages
- Follow conventional commit format: type(scope): description
- Reference issues in commit messages when applicable

## Dependencies

- Approve all new dependencies through the team
- Keep dependencies up-to-date
- Document any unusual dependency choices

## Security

- Never commit secrets or credentials
- Use environment variables for configuration
- Follow OWASP top 10 guidelines
```

## Installation Steps

### Step 1: Create AGENTS.md at Project Root

```bash
# At your project root directory
touch AGENTS.md
```

### Step 2: Add Agent Guidance

Edit `AGENTS.md`:

```markdown
# My Project Agent Instructions

This document guides Codex agents working on [Project Name].

## Overview

[Brief description of the project and its goals]

## Code Standards

### Language Style

- [Language-specific style guidelines]
- [Formatting requirements]

### Best Practices

- [Project-specific best practices]
- [Common patterns to follow]

## Development Process

### Before Implementing

- Check existing implementation for similar features
- Review relevant documentation
- Consider performance implications

### During Implementation

- Write clear, self-documenting code
- Add comments for complex logic
- Include examples where helpful

### After Implementation

- Write tests for new functionality
- Update documentation
- Run full test suite before committing

## Testing

- Test framework: [Name and version]
- Coverage requirement: [%]
- Test command: `[command]`

## Version Control

### Commit Messages

Follow this format: `type(scope): description`

Types: feat, fix, docs, style, refactor, test, chore

Example: `feat(auth): add OAuth2 support`

### Branch Naming

- Feature branches: `feature/description`
- Bug fixes: `bugfix/description`
- Documentation: `docs/description`

## Dependencies

- Production dependencies: [Guidelines]
- Development dependencies: [Guidelines]
- Prohibited dependencies: [List any]

## Environment Setup

Required tools:
- [Tool 1] v[version]
- [Tool 2] v[version]

Installation:
```
[Setup commands]
```

## Deployment

- Staging: [Staging process]
- Production: [Production process]
- Rollback: [Rollback procedure]

## Questions and Issues

Contact [Team/Person] for questions about:
- [Domain 1]
- [Domain 2]
```

### Step 3: Directory-Level Instructions (Optional)

Create directory-specific instructions for subdirectories:

```bash
# Create instructions for src/ directory
touch src/AGENTS.md
```

Edit `src/AGENTS.md`:

```markdown
# Source Code Agent Instructions

This document provides specific guidance for Codex agents working in the `src/` directory.

## Module Organization

- [Module-specific guidelines]
- [Module dependencies]

## API Contracts

- [API design guidelines]
- [Response format requirements]

## Performance Requirements

- [Performance targets]
- [Optimization strategies]
```

### Step 4: Create Global Instructions (Optional)

Create global instructions in your home directory:

```bash
mkdir -p ~/.codex
touch ~/.codex/AGENTS.md
```

Edit `~/.codex/AGENTS.md`:

```markdown
# Global Agent Instructions

This document provides guidance for all Codex projects.

## Universal Standards

- [Standards that apply to all projects]
- [Company guidelines]

## Best Practices

- [Best practices for all projects]
- [Common patterns]
```

### Step 5: Create Overrides (Optional)

Create override files to take precedence:

```bash
# Global override
touch ~/.codex/AGENTS.override.md

# Project override
touch AGENTS.override.md
```

Override files follow the same Markdown format and completely replace (not merge) with standard AGENTS.md.

### Step 6: Commit to Version Control

```bash
git add AGENTS.md
git commit -m "docs: add agent instructions for the project"
```

## Hierarchical Instruction Merging

Instructions are merged from root down, with closer instructions overriding earlier ones:

```
1. ~/.codex/AGENTS.override.md     (highest priority)
2. $GIT_ROOT/AGENTS.override.md
3. $GIT_ROOT/AGENTS.md
4. $GIT_ROOT/src/AGENTS.md         (if in src/)
5. $GIT_ROOT/tests/AGENTS.md       (if in tests/)
   ... (continues down directory tree)
```

Example:

```
Global:
  ~/.codex/AGENTS.md provides base standards

Repository:
  /project/AGENTS.md adds project-specific guidance

Directory:
  /project/src/AGENTS.md adds src-specific details
```

When the agent operates on a file in `project/src/`, all three documents are combined, with closer documents taking precedence.

## Configuration

### Custom Fallback Filenames

Edit `~/.codex/config.toml`:

```toml
[project_doc]
# Search for these files if AGENTS.md not found
fallback_filenames = ["TEAM_GUIDE.md", ".agents.md", "CONTRIBUTING.md"]

# Maximum bytes to load for all agent instructions combined
max_bytes = 65536  # 64 KiB
```

### Configuring Search Depth

```toml
[agent_discovery]
max_search_depth = 10  # Maximum directories to search up
```

## Environment Variable Override

Override configuration via environment variable:

```bash
export CODEX_HOME=$(pwd)/.codex
codex exec "your command here"
```

This temporarily sets Codex home to the current directory's `.codex/` folder.

## Validation

To verify agent instructions are properly installed:

1. Check files exist: `AGENTS.md`, `~/.codex/AGENTS.md`
2. Verify Markdown syntax is valid
3. Test with: `codex list-agents` to see if instructions are loaded
4. Verify file content is applied to agent behavior

## Best Practices

1. **Be specific**: Provide clear, actionable guidance
2. **Include examples**: Show good and bad patterns
3. **Keep updated**: Maintain instructions as practices evolve
4. **Use hierarchical structure**: Global for company standards, project for specific guidance
5. **Test thoroughly**: Verify agents follow your instructions
6. **Version control**: Commit AGENTS.md to git
7. **Document scope**: Clarify which guidelines apply where

## Common Issues

### Instructions Not Applied

- **Check file location**: Ensure `AGENTS.md` is at project root
- **Check syntax**: Verify valid Markdown format
- **Restart Codex**: Codex reads instructions on startup
- **Check priority**: Override files may be taking precedence

### Multiple Instructions Conflicting

- **Check merging order**: Review hierarchical merging order
- **Use overrides**: Place override files strategically to take precedence
- **Document precedence**: Clarify which instructions apply in each context

### Instructions Not Updating

- **Check cache**: Codex may cache instructions
- **Restart Codex**: Force reload of instructions
- **Check byte limits**: May have exceeded max_bytes

## Distinguishing from Skills

| Feature | Agent Instructions | Skills |
|---------|-------------------|--------|
| **File** | AGENTS.md | SKILL.md in skill directories |
| **Purpose** | Agent guidance | Reusable capabilities |
| **Format** | Markdown narrative | Metadata + scripts |
| **Discovery** | Hierarchical merge | Direct directory scan |
| **Use For** | Project guidelines | Code patterns, utilities |

## Next Steps

- [Installing Skills in Codex](./codex-skills-installation.md)
- [Codex Official Documentation](https://developers.openai.com/codex/guides/agents-md/)
- [Understanding Agent Instructions](../ide-concepts/codex-agent-instructions.md)
