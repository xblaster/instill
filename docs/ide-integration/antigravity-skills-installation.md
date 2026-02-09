# Installing Skills in Antigravity

Skills are reusable capabilities that extend Antigravity's functionality. Skills are stored in the `.agent/skills/` directory using a standardized skill package format.

## Important: .agent/skills/ is Cross-Platform Standard

The `.agent/skills/` directory is a universal standard supported across multiple AI IDEs:
- Antigravity
- Codex
- Cursor (also supports `.cursor/skills/`)
- Claude Code (also supports `.claude/skills/`)
- Windsurf
- OpenCode

This guide uses `.agent/skills/` for maximum portability and cross-IDE compatibility.

## Directory Structure

Antigravity discovers skills from:

1. **Project-level**: `.agent/skills/` (current project)
2. **Global-level**: `~/.gemini/antigravity/skills/` (all projects)

```
project/
├── .agent/
│   └── skills/
│       ├── skill-name-1/
│       │   ├── SKILL.md
│       │   ├── scripts/
│       │   └── references/
│       └── skill-name-2/
│           ├── SKILL.md
│           └── scripts/
```

## Skill Package Structure

Each skill is a directory containing required and optional files:

```
.agent/skills/my-skill/
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

## Progressive Disclosure Pattern

Antigravity uses "Progressive Disclosure" for efficient skill management:

1. **Initial Load**: Only skill name and description are loaded
2. **On Use**: Full SKILL.md content is loaded when the agent uses the skill
3. **Benefit**: Large skill sets have minimal memory overhead

This means:
- Keep SKILL.md headers concise
- Detailed instructions can be longer (loaded on-demand)
- Reduces token usage for unused skills

## Installation Steps

### Step 1: Create the Skill Directory

```bash
mkdir -p .agent/skills/my-skill
```

### Step 2: Create SKILL.md

Create `.agent/skills/my-skill/SKILL.md`:

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

Create `.agent/skills/my-skill/scripts/` for executable scripts:

```bash
mkdir -p .agent/skills/my-skill/scripts
```

Examples of useful scripts:
- `setup.sh` - Installation or initialization script
- `process.py` - Python processing logic
- `build.sh` - Build or compilation script

### Step 4: Add References (if needed)

Create `.agent/skills/my-skill/references/` for supporting documentation:

```bash
mkdir -p .agent/skills/my-skill/references
```

Examples:
- `template.md` - Documentation template
- `examples.txt` - Code examples
- `config.json` - Configuration schema

### Step 5: Restart Antigravity

Restart Antigravity for the skill to be discovered and available.

## Global Skills Installation

To install a skill globally (available across all projects):

```bash
mkdir -p ~/.gemini/antigravity/skills/my-skill
# Copy SKILL.md and other files to ~/.gemini/antigravity/skills/my-skill/
```

## Using Symlinks

You can use symlinks to share skills across multiple projects:

```bash
# Create skill once
mkdir -p ~/shared-skills/my-skill
# Create SKILL.md and scripts...

# Link in each project
ln -s ~/shared-skills/my-skill .agent/skills/my-skill
```

Antigravity follows symlink targets, allowing you to:
- Share skills across projects without duplication
- Maintain a central skill repository
- Keep project-specific and shared skills organized

## Validation

To verify your skill is installed correctly:

1. Restart Antigravity
2. Check that the skill appears in Antigravity's skill list
3. Test the skill functionality
4. Verify the skill persists across sessions

## Best Practices

1. **Clear naming**: Use kebab-case (e.g., `my-skill`, not `MySkill`)
2. **Concise metadata**: Keep SKILL.md headers brief for Progressive Disclosure
3. **Document well**: Provide clear usage instructions and examples
4. **Test thoroughly**: Ensure skills work correctly
5. **Use symlinks**: Share common skills across projects
6. **Organize scripts**: Keep scripts well-documented and focused
7. **Version control**: Commit skills to git for team sharing

## Progressive Disclosure Example

**Efficient SKILL.md:**

```markdown
# Data Parser

**Name:** data-parser
**Description:** Parses JSON, CSV, and YAML files

## What This Skill Does

This skill parses various data formats and converts them to structured output.

## Usage

- `parse <file>` - Parse the file and output result
- `parse <file> --format json` - Output as JSON

## Formats Supported

- JSON
- CSV
- YAML
- XML (optional)
```

The above SKILL.md loads quickly, and full details are only loaded when the skill is actually used.

## Common Issues

### Skill Not Appearing

- **Check directory**: Ensure `.agent/skills/my-skill/` exists
- **Check SKILL.md**: File must exist and be properly formatted
- **Metadata**: Ensure `**Name:**` and `**Description:**` are present
- **Restart Antigravity**: Skills are discovered on startup

### Symlinks Not Working

- **Check target**: Ensure symlink target exists
- **Path syntax**: Use absolute paths for cross-project symlinks
- **Permissions**: Ensure Antigravity can read the linked directory

### Global Skills Not Available

- **Check path**: Ensure `~/.gemini/antigravity/skills/` exists
- **Permissions**: Ensure permissions allow access
- **Home directory**: Verify home directory is correctly set

## Example: Complete Antigravity Skill

```
.agent/skills/api-client/
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

## What This Skill Does

This skill automatically generates API client code from OpenAPI specifications.

## Usage

1. Place OpenAPI spec at `api.yaml`
2. Use this skill
3. Generated client code appears in `src/api/client.ts`

## Examples

```bash
# Generate TypeScript client
agent skill api-client-generator --lang typescript --input api.yaml
```

## Supported Languages

- TypeScript
- Python
- Go
- Rust
```

## Cross-Platform Compatibility

Since `.agent/skills/` is supported by multiple IDEs, skills you create are portable:

| IDE | Support |
|-----|---------|
| Antigravity | ✓ Full support |
| Cursor | ✓ Full support |
| Codex | ✓ Full support |
| Claude Code | ✓ Full support |
| VS Code | ✗ Use extensions |

## Next Steps

- [Cross-Platform Skills Guide](./cross-platform-skills-guide.md)
- [Installing Skills in Codex](./codex-skills-installation.md)
- [Antigravity Official Documentation](https://antigravity.google/docs/skills)
