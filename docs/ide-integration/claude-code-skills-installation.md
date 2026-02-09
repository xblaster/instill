# Installing Skills in Claude Code

Skills are reusable capabilities that extend Claude Code's functionality. Skills are stored in the `.claude/skills/` directory and persist across Claude Code sessions.

## Directory Structure

Claude Code discovers skills from the `.claude/skills/` directory:

```
.claude/
├── skills/
│   ├── skill-name-1/
│   │   ├── SKILL.md
│   │   ├── scripts/
│   │   └── references/
│   └── skill-name-2/
│       ├── SKILL.md
│       └── scripts/
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

Practical examples of using the skill.
```

## Installation Steps

### Step 1: Create the Skill Directory

```bash
mkdir -p .claude/skills/my-skill
```

### Step 2: Create SKILL.md

Create `.claude/skills/my-skill/SKILL.md`:

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
```

### Step 3: (Optional) Add Scripts

Create `.claude/skills/my-skill/scripts/` if your skill needs executable scripts:

```
.claude/skills/my-skill/scripts/
├── setup.sh
├── process.py
└── README.md
```

### Step 4: (Optional) Add References

Create `.claude/skills/my-skill/references/` for supporting documentation:

```
.claude/skills/my-skill/references/
├── template.md
├── examples.txt
└── configuration.json
```

### Step 5: Restart Claude Code

Restart Claude Code for the skill to be discovered and available.

## Validation

To verify your skill is installed correctly:

1. Restart Claude Code
2. Check that the skill is available in the skills list
3. Test the skill functionality
4. Verify the skill persists across sessions

## Common Issues

### Skill Not Appearing

- **Check the directory**: Ensure `.claude/skills/my-skill/` exists
- **Check SKILL.md**: The file must exist and be properly formatted
- **Metadata**: Ensure `**Name:**` and `**Description:**` are present
- **Restart Claude Code**: Skills are discovered on startup

### Skill Conflicts

- Use unique skill names to avoid conflicts
- Each skill operates independently
- Skills in `.claude/skills/` can coexist without interference

## Best Practices

1. **Use clear naming**: Use kebab-case for skill directory names (e.g., `my-skill`, not `MySkill`)
2. **Document well**: Write clear descriptions and usage instructions
3. **Test thoroughly**: Ensure your skill works correctly before sharing
4. **Version control**: Commit skills to version control for team sharing
5. **Keep SKILL.md simple**: Focus on the essential metadata and usage information

## Example: Complete Skill

Here's a complete working skill example:

```
.claude/skills/code-formatter/
├── SKILL.md
└── scripts/
    └── format-code.sh
```

**SKILL.md:**
```markdown
# Code Formatter

**Name:** code-formatter
**Description:** Formats code in multiple languages

## What This Skill Does

This skill automatically formats code using industry-standard formatters.

## Usage

Invoke this skill to format any code file in your project.

## Supported Formats

- Python (black)
- JavaScript (prettier)
- Rust (rustfmt)
- Go (gofmt)
```

## Distinguishing Skills from Commands

- **Skills**: Reusable capabilities available across projects, installed once
- **Commands**: Discrete executable actions specific to project workflows
- **See also**: [Installing Commands in Claude Code](./claude-code-commands-installation.md)
