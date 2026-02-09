# Cross-Platform Skills Installation Guide

The `.agent/skills/` directory is a universal standard supported across multiple AI IDEs and development tools. Using `.agent/skills/` allows you to create skills once and use them across multiple IDEs, teams, and projects.

## Why Cross-Platform Skills?

**Single source of truth**: Create a skill once, use it everywhere.

**Benefits**:
- ✓ Easier team collaboration (everyone uses same skills)
- ✓ Faster onboarding (skills work out-of-the-box)
- ✓ Reduced maintenance (one codebase per skill)
- ✓ Better sharing (skills are IDE-agnostic)

## Supported IDEs

| IDE | Support | Path | Notes |
|-----|---------|------|-------|
| **Antigravity** | ✓ Full | `.agent/skills/` | Recommended |
| **Cursor** | ✓ Full | `.agent/skills/` | Also supports `.cursor/skills/` |
| **Codex** | ✓ Full | `.agent/skills/` | Also supports `.agents/skills/` |
| **Claude Code** | ✓ Full | `.agent/skills/` | Also supports `.claude/skills/` |
| **Windsurf** | ✓ Full | `.agent/skills/` | Latest version |
| **OpenCode** | ✓ Full | `.agent/skills/` | Latest version |
| **VS Code** | ✗ Not supported | Use extensions | Different architecture |

## Universal Skill Package Structure

The `.agent/skills/` standard defines:

```
.agent/skills/my-skill/
├── SKILL.md            (required - metadata)
├── scripts/            (optional - executable files)
│   ├── setup.sh
│   ├── process.py
│   └── build.sh
└── references/         (optional - supporting docs)
    ├── template.md
    ├── examples.txt
    └── config.json
```

## Standard SKILL.md Format

All IDEs expect this metadata structure in `SKILL.md`:

```markdown
# Skill Name

**Name:** unique-skill-identifier
**Description:** Brief one-line description

## Overview

Detailed explanation of what the skill does.

## Installation

Steps to install or set up the skill.

## Usage

How to invoke and use the skill.

## Examples

Practical examples demonstrating the skill.

## Requirements

Any dependencies or prerequisites.
```

## Installation Steps

### Step 1: Create Directory Structure

```bash
# Create the universal skills directory
mkdir -p .agent/skills/my-skill/scripts
mkdir -p .agent/skills/my-skill/references
```

### Step 2: Create SKILL.md

Create `.agent/skills/my-skill/SKILL.md`:

```markdown
# My Cross-Platform Skill

**Name:** my-skill
**Description:** Provides X functionality across all IDEs

## Overview

This skill provides consistent functionality across Cursor, Codex, Antigravity, and Claude Code.

## Installation

This skill is automatically discovered in any IDE supporting `.agent/skills/`.

## Usage

Invoke this skill to:
- [Capability 1]
- [Capability 2]

## Examples

```
Example usage
```

## Compatibility

Works on:
- Antigravity ✓
- Cursor ✓
- Codex ✓
- Claude Code ✓
- Windsurf ✓
```

### Step 3: Add Implementation Files

Create scripts in `.agent/skills/my-skill/scripts/`:

```bash
# Create a useful script
cat > .agent/skills/my-skill/scripts/process.py << 'EOF'
#!/usr/bin/env python3
# Implementation here
EOF

chmod +x .agent/skills/my-skill/scripts/process.py
```

### Step 4: Add Documentation

Create references in `.agent/skills/my-skill/references/`:

```bash
# Create a template
cat > .agent/skills/my-skill/references/template.md << 'EOF'
# Template for using this skill
EOF
```

### Step 5: Test on Multiple IDEs

Test your skill in each supported IDE:

1. **Antigravity**: Restart Antigravity and verify skill appears
2. **Cursor**: Check `.cursor/skills/` (may need to symlink)
3. **Codex**: Verify in `.agents/skills/` hierarchy
4. **Claude Code**: Check `.claude/skills/` (may need to symlink)

### Step 6: Version Control

```bash
git add .agent/skills/
git commit -m "feat: add cross-platform skill: my-skill"
```

## Choosing Between Cross-Platform and IDE-Native Paths

### Use `.agent/skills/` When:

- ✓ Sharing skills across teams
- ✓ Working with multiple IDEs
- ✓ Creating tools for widespread use
- ✓ Building team-level infrastructure
- ✓ Prioritizing portability

### Use IDE-Native Paths When:

- ✗ IDE-specific features required
- ✗ Internal-only tools
- ✗ Customizing for specific IDE behavior
- ✗ Integrating with IDE-specific systems

**IDE-Native Paths**:
- Cursor: `.cursor/skills/` (uses Cursor-specific discovery)
- Codex: `.agents/skills/` (uses Codex discovery hierarchy)
- Claude Code: `.claude/skills/` (uses Claude Code discovery)
- Antigravity: `.agent/skills/` (also supports `~/.gemini/antigravity/skills/`)

## IDE-Specific Extensions

Some IDEs allow extending base skills with IDE-specific configuration:

### Cursor Extensions

Place IDE-specific config in Cursor's native location:

```
.cursor/skills/my-skill/         (optional Cursor-specific)
.agent/skills/my-skill/          (cross-platform base)
```

### Codex Extensions

Use Codex's native discovery alongside cross-platform:

```
.agents/skills/my-skill/         (Codex-specific, found first)
.agent/skills/my-skill/          (fallback for other IDEs)
```

## Example Cross-Platform Skill

Here's a complete cross-platform skill that works across all IDEs:

```
.agent/skills/code-formatter/
├── SKILL.md
├── scripts/
│   ├── format.py
│   ├── format.sh
│   └── validate.py
└── references/
    ├── supported-languages.md
    ├── config-example.json
    └── troubleshooting.md
```

**SKILL.md:**
```markdown
# Code Formatter

**Name:** code-formatter
**Description:** Formats code in multiple languages consistently

## Overview

This skill formats code using industry-standard formatters for Python, JavaScript, Go, and Rust.

## Installation

No additional installation required. This skill works in all supporting IDEs.

## Usage

Invoke this skill to:
- Format Python code (black)
- Format JavaScript/TypeScript (prettier)
- Format Go code (gofmt)
- Format Rust code (rustfmt)

## Supported Languages

- Python (black)
- JavaScript/TypeScript (prettier)
- Go (gofmt)
- Rust (rustfmt)

## Compatibility

Works on: Cursor ✓ Codex ✓ Antigravity ✓ Claude Code ✓ Windsurf ✓

## Examples

```bash
# Format current file
skill code-formatter --file main.py

# Format directory
skill code-formatter --dir src/

# Check without formatting
skill code-formatter --check --file main.py
```
```

**scripts/format.py:**
```python
#!/usr/bin/env python3
"""Cross-platform code formatter."""

import sys
import subprocess

def format_python(file_path):
    """Format Python file with black."""
    subprocess.run(['black', file_path])

def format_javascript(file_path):
    """Format JavaScript with prettier."""
    subprocess.run(['prettier', '--write', file_path])

if __name__ == '__main__':
    file_path = sys.argv[1]
    if file_path.endswith('.py'):
        format_python(file_path)
    elif file_path.endswith(('.js', '.ts')):
        format_javascript(file_path)
```

## Team Integration

### Share Skills via Git

1. Create a `skills/` or `.agent/skills/` directory in your team's repository
2. Add skills there
3. Team members clone and use skills directly

```bash
# In team repository
mkdir -p .agent/skills
# Add your skills

# Team members
git clone <repo>
# Skills immediately available in any supporting IDE
```

### Share Skills via Package/Artifact Repository

1. Package skills as a tarball
2. Distribute via artifact repository (npm, pip, etc.)
3. Team members extract to `.agent/skills/`

```bash
# Create package
tar -czf my-skills.tar.gz .agent/skills/

# Team members install
mkdir -p .agent/skills
tar -xzf my-skills.tar.gz
```

### Use Symlinks for Shared Repository

```bash
# Create central skills repository
git clone <central-skills-repo> ~/team-skills

# In each project, link skills
ln -s ~/team-skills/.agent/skills .agent/skills
```

## Best Practices

1. **Follow the standard structure**: Always use `.agent/skills/skill-name/SKILL.md`
2. **Keep SKILL.md concise**: Essential information only
3. **Test cross-platform**: Verify skills work on multiple IDEs
4. **Document compatibility**: Note which IDEs are fully supported
5. **Use semantic versioning**: Tag releases for skills
6. **Include examples**: Show practical usage patterns
7. **License appropriately**: Include LICENSE file if distributing
8. **Keep dependencies light**: Minimize external dependencies

## Troubleshooting

### Skill Not Appearing in IDE

1. **Check path**: Ensure `.agent/skills/skill-name/` exists
2. **Check SKILL.md**: Required metadata must be present
3. **IDE-specific issues**: Some IDEs also check IDE-native paths
4. **Restart IDE**: Skills discovered on startup

### Skill Works in One IDE But Not Another

1. **Check IDE support**: Not all IDEs support cross-platform standard equally
2. **Use IDE-native path**: Fall back to IDE-specific directory if needed
3. **Check dependencies**: Ensure scripts work on target IDE's system

### Scripts Not Executing

1. **Check permissions**: Ensure scripts are executable (`chmod +x script.sh`)
2. **Check shebang**: Use correct shebang for scripts (`#!/usr/bin/env python3`)
3. **Check PATH**: Ensure required interpreters/tools are in PATH

## Summary

| Aspect | Recommendation |
|--------|-----------------|
| **Where to put skills** | `.agent/skills/` for maximum portability |
| **SKILL.md format** | Follow the standard metadata structure |
| **Team sharing** | Git-based distribution with symlinks |
| **IDE-specific needs** | Document and handle gracefully |
| **Testing** | Verify on multiple IDEs before distribution |

## See Also

- [Installing Skills in Cursor](./cursor-skills-installation.md)
- [Installing Skills in Codex](./codex-skills-installation.md)
- [Installing Skills in Antigravity](./antigravity-skills-installation.md)
- [Skills vs Commands vs Tasks](./skills-commands-tasks-guide.md)
