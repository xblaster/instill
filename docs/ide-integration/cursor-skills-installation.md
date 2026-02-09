# Installing Skills in Cursor

Skills are reusable capabilities that extend Cursor's functionality. Skills are stored in the `.cursor/skills/` directory and persist across Cursor sessions.

## Directory Structure

Cursor discovers skills from multiple locations in priority order:

1. **Project-level**: `.cursor/skills/` (current project)
2. **Global-level**: `~/.cursor/skills/` (all projects)

Cursor supports symlinked skill folders, allowing you to share skills across projects.

## Skill Package Structure

Each skill is a directory containing required and optional files:

```
.cursor/skills/
└── skill-name/
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

## Overview

Detailed explanation of the skill's capabilities.

## Installation

Steps to install or activate this skill.

## Usage

How to invoke and use this skill.

## Examples

Practical examples demonstrating the skill.
```

## Installation Steps

### Step 1: Create the Skill Directory

```bash
mkdir -p .cursor/skills/my-skill
```

### Step 2: Create SKILL.md

Create `.cursor/skills/my-skill/SKILL.md`:

```markdown
# My Custom Skill

**Name:** my-skill
**Description:** This skill does X and Y

## Overview

This skill provides custom functionality for ...

## Installation

This skill is automatically discovered from the .cursor/skills/ directory.

## Usage

To use this skill:
- [Usage instruction 1]
- [Usage instruction 2]

## Examples

Example usage:
```

### Step 3: Add Scripts (if needed)

Create `.cursor/skills/my-skill/scripts/` for executable scripts:

```bash
mkdir -p .cursor/skills/my-skill/scripts
```

Examples of useful scripts:
- `setup.sh` - Installation or initialization script
- `process.py` - Python processing logic
- `build.sh` - Build or compilation script

### Step 4: Add References (if needed)

Create `.cursor/skills/my-skill/references/` for supporting documentation:

```bash
mkdir -p .cursor/skills/my-skill/references
```

Examples:
- `template.md` - Documentation template
- `examples.txt` - Code examples
- `config.json` - Configuration schema

### Step 5: Restart Cursor

Restart Cursor for the skill to be discovered and available.

## Global Skills Installation

To install a skill globally (available across all projects):

```bash
mkdir -p ~/.cursor/skills/my-skill
# Copy SKILL.md and other files to ~/.cursor/skills/my-skill/
```

## Using Symlinks

You can use symlinks to share a skill across multiple projects:

```bash
# Create skill once
mkdir -p ~/shared-skills/my-skill
# Create SKILL.md and scripts...

# Link in each project
ln -s ~/shared-skills/my-skill .cursor/skills/my-skill
```

## Validation

To verify your skill is installed correctly:

1. Restart Cursor
2. Check that the skill appears in Cursor's skill list
3. Test the skill functionality
4. Verify the skill persists across sessions

## Cursor Skills vs Rules

In Cursor, there are two mechanisms for extending functionality:

| Feature | Skills | Rules |
|---------|--------|-------|
| **Location** | `.cursor/skills/` | `.cursor/rules/` |
| **Purpose** | Reusable capabilities | Project-specific instructions |
| **Format** | Directory with SKILL.md | .mdc or .md files |
| **Scope** | Global or project | Project-level |
| **Use For** | Code patterns, utilities | Developer instructions, context |

**See also**: [Installing Rules in Cursor](./cursor-rules-installation.md)

## Best Practices

1. **Clear naming**: Use kebab-case (e.g., `my-skill`, not `MySkill`)
2. **Document well**: Write clear descriptions and usage instructions
3. **Test thoroughly**: Ensure skills work before sharing
4. **Version control**: Commit to git for team sharing
5. **Use Progressive Disclosure**: Include only essential info in SKILL.md, detailed docs in references/
6. **Organize scripts**: Keep scripts organized and well-documented

## Common Issues

### Skill Not Appearing

- **Check directory**: Ensure `.cursor/skills/my-skill/` exists
- **Check SKILL.md**: File must exist and be properly formatted
- **Metadata**: Ensure `**Name:**` and `**Description:**` are present
- **Restart Cursor**: Skills are discovered on startup

### Accessing Global Skills

- **Check path**: Ensure `~/.cursor/skills/` exists
- **Permissions**: Ensure permissions allow access
- **Path separator**: Use `/` on Unix-like systems, `\` on Windows

## Example: Complete Cursor Skill

```
.cursor/skills/api-client/
├── SKILL.md
└── scripts/
    ├── generate-client.py
    └── test-client.sh
```

**SKILL.md:**
```markdown
# API Client Generator

**Name:** api-client-generator
**Description:** Generates type-safe API clients from OpenAPI specs

## Overview

This skill automatically generates API client code from OpenAPI specifications.

## Usage

1. Place OpenAPI spec at `api.yaml`
2. Invoke the api-client-generator skill
3. Generated client code appears in `src/api/client.ts`

## Examples

```bash
cursor invoke api-client-generator --lang typescript
```
```

## Next Steps

- [Installing Rules in Cursor](./cursor-rules-installation.md)
- [Understanding Skills vs Rules](../ide-concepts/cursor-skills-vs-rules.md)
- [Cursor Official Documentation](https://cursor.com/docs/context/skills)
