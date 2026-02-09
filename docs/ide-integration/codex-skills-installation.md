# Installing Skills in Codex

Skills are reusable capabilities that extend Codex's functionality. Skills are stored in the `.agents/skills/` directory using a standardized skill package format that is compatible with the cross-platform `.agent/skills/` standard.

## Important: .agents/skills/ vs .agent/skills/

Codex supports both paths:

| Path | Purpose |
|------|---------|
| `.agents/skills/` | Codex-native, recommended for single-IDE usage |
| `.agent/skills/` | Cross-platform standard, recommended for team sharing |

This guide covers `.agents/skills/` for Codex-specific setup. For cross-platform compatibility, use `.agent/skills/`.

## Directory Structure

Codex discovers skills hierarchically from current directory upward to repository root:

```
project/
├── .agents/
│   └── skills/
│       ├── skill-name-1/
│       │   ├── SKILL.md
│       │   ├── scripts/
│       │   └── references/
│       └── skill-name-2/
│           ├── SKILL.md
│           └── scripts/
├── src/
│   └── .agents/
│       └── skills/     (scoped skills for src/)
│           └── ...
```

Codex searches for skills:
1. Current directory: `.agents/skills/`
2. Parent directories up to repository root
3. Repository root: `$REPO_ROOT/.agents/skills/`
4. Global: `~/.codex/skills/`

## Skill Package Structure

Each skill is a directory containing required and optional files:

```
.agents/skills/my-skill/
├── SKILL.md            (required)
├── scripts/            (optional)
│   ├── setup.sh
│   ├── process.py
│   └── README.md
└── references/         (optional)
    ├── template.md
    ├── examples.txt
    └── config.json
```

## Required SKILL.md Format

Each skill requires a `SKILL.md` file with metadata:

```markdown
# Skill Name

**Name:** unique-skill-identifier
**Description:** Brief description of what this skill does

## What This Skill Does

Detailed explanation of the skill's capabilities.

## Usage

How to invoke and use this skill.

## Examples

Practical examples demonstrating the skill.
```

## Installation Steps

### Step 1: Create the Skill Directory

```bash
mkdir -p .agents/skills/my-skill
```

### Step 2: Create SKILL.md

Create `.agents/skills/my-skill/SKILL.md`:

```markdown
# My Custom Skill

**Name:** my-skill
**Description:** This skill does X and Y

## What This Skill Does

This skill provides custom functionality for ...

## Usage

To use this skill:
- [Usage instruction 1]
- [Usage instruction 2]

## Examples

Practical examples:
```

### Step 3: Add Scripts (if needed)

Create `.agents/skills/my-skill/scripts/` for executable scripts:

```bash
mkdir -p .agents/skills/my-skill/scripts
```

Examples of useful scripts:
- `setup.sh` - Installation or initialization script
- `process.py` - Python processing logic
- `build.sh` - Build or compilation script

### Step 4: Add References (if needed)

Create `.agents/skills/my-skill/references/` for supporting documentation:

```bash
mkdir -p .agents/skills/my-skill/references
```

Examples:
- `template.md` - Documentation template
- `examples.txt` - Code examples
- `config.json` - Configuration schema

### Step 5: Commit to Version Control

```bash
git add .agents/skills/
git commit -m "feat: add Codex skills"
```

## Hierarchical Skill Discovery

Codex searches for skills starting from the current directory and moving up:

```
project/
├── .agents/skills/          (FOUND - highest priority)
├── src/
│   ├── .agents/skills/      (searched if in src/)
│   └── main.py
└── config/
    ├── .agents/skills/      (searched if in config/)
    └── settings.json
```

This allows:
- Project-level skills in `project/.agents/skills/`
- Subdirectory-scoped skills in `project/src/.agents/skills/`
- Team-level skills in `~/.codex/skills/`

## Global Skills Installation

To install a skill globally (available in all projects):

```bash
mkdir -p ~/.codex/skills/my-skill
# Copy SKILL.md and other files to ~/.codex/skills/my-skill/
```

## Skill Discovery Limits

Codex has configurable limits for skill discovery:

### Default Limits

- **Max bytes**: 32 KiB (32,768 bytes) for all discovered skills combined
- **Search stops**: When max bytes is reached or at repository root

### Configuring Limits

Edit `~/.codex/config.toml`:

```toml
[[skills.config]]
path = "/path/to/skill/SKILL.md"
enabled = false

[skill_discovery]
max_bytes = 65536  # 64 KiB max
search_depth = 10  # Max directories to search up
```

## Using Symlinks

You can use symlinks to share skills across multiple projects:

```bash
# Create skill once
mkdir -p ~/shared-skills/my-skill
# Create SKILL.md and scripts...

# Link in each project
ln -s ~/shared-skills/my-skill .agents/skills/my-skill
```

Codex follows symlink targets, allowing you to:
- Share skills across projects without duplication
- Maintain a central skill repository
- Keep project-specific and shared skills organized

## Validation

To verify your skill is installed correctly:

1. Check `.agents/skills/` directory exists
2. Verify SKILL.md file is present and properly formatted
3. Test skill discovery by running `codex list-skills`
4. Confirm the skill is available in the skill list

## Best Practices

1. **Clear naming**: Use kebab-case (e.g., `my-skill`, not `MySkill`)
2. **Document well**: Provide clear usage instructions and examples
3. **Test thoroughly**: Ensure skills work correctly
4. **Use symlinks**: Share common skills across projects
5. **Organize scripts**: Keep scripts well-documented and focused
6. **Version control**: Commit skills to git for team sharing
7. **Consider discovery limits**: Monitor skill discovery byte limits

## Example: Complete Codex Skill

```
.agents/skills/code-reviewer/
├── SKILL.md
└── scripts/
    ├── analyze-code.py
    └── report.sh
```

**SKILL.md:**
```markdown
# Code Reviewer

**Name:** code-reviewer
**Description:** Analyzes code for style, performance, and security issues

## What This Skill Does

This skill performs comprehensive code review across multiple dimensions.

## Usage

- Review current file: Use this skill on a code file
- Generate report: Produces a detailed review report
- Check performance: Identifies performance bottlenecks

## Examples

```bash
codex invoke code-reviewer analyze-code.py
```

## Review Dimensions

- Code style and formatting
- Performance optimization opportunities
- Security vulnerabilities
- Best practice violations
```

## Troubleshooting

### Skill Not Appearing

- **Check directory**: Ensure `.agents/skills/my-skill/` exists
- **Check SKILL.md**: File must exist and be properly formatted
- **Check path**: Verify skills are in the search path
- **Check limits**: Ensure you haven't exceeded max_bytes

### Skill Discovery Slow

- **Check byte limit**: May have exceeded max_bytes
- **Reduce skill count**: Consolidate or remove unused skills
- **Increase limit**: Modify `max_bytes` in `~/.codex/config.toml`

## Codex Agent Instructions

In addition to skills, Codex uses `AGENTS.md` files for agent-level guidance. See [Installing Agent Instructions in Codex](./codex-agents-installation.md).

## Next Steps

- [Installing Agent Instructions in Codex](./codex-agents-installation.md)
- [Cross-Platform Skills Guide](./cross-platform-skills-guide.md)
- [Codex Official Documentation](https://developers.openai.com/codex/skills)
