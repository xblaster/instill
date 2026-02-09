# Installing Commands in Claude Code

Commands are discrete executable actions that extend Claude Code's capabilities. Commands are stored in the `.claude/commands/` directory and persist across Claude Code sessions.

## Directory Structure

Claude Code discovers commands from the `.claude/commands/` directory:

```
.claude/
├── commands/
│   ├── command-name-1/
│   │   └── command.md
│   └── command-name-2/
│       └── command.md
```

## Command File Format

Each command requires a command definition file:

```markdown
# Command Name

**Name:** unique-command-identifier
**Description:** Brief description of what this command does
**Type:** shell | script | custom

## What This Command Does

Detailed explanation of the command's functionality.

## Execution

How the command executes and what it does.

## Examples

Practical examples of using the command.
```

## Installation Steps

### Step 1: Create the Command Directory

```bash
mkdir -p .claude/commands/my-command
```

### Step 2: Create Command Definition

Create `.claude/commands/my-command/command.md`:

```markdown
# My Custom Command

**Name:** my-command
**Description:** This command executes action X
**Type:** shell

## What This Command Does

This command performs a specific task in the workflow.

## Execution

When invoked, this command:
1. [Action 1]
2. [Action 2]
3. [Result]

## Examples

Usage example:
```
claude my-command --option value
```
```

### Step 3: Restart Claude Code

Restart Claude Code for the command to be discovered and available.

## Validation

To verify your command is installed correctly:

1. Restart Claude Code
2. Check that the command is available in the commands list
3. Test the command execution
4. Verify the command persists across sessions

## Common Issues

### Command Not Appearing

- **Check the directory**: Ensure `.claude/commands/my-command/` exists
- **Check definition file**: The file must exist and be properly formatted
- **Metadata**: Ensure `**Name:**`, `**Description:**`, and `**Type:**` are present
- **Restart Claude Code**: Commands are discovered on startup

### Command Conflicts

- Use unique command names to avoid conflicts
- Each command operates independently
- Commands in `.claude/commands/` can coexist without interference

## Best Practices

1. **Use clear naming**: Use kebab-case for command names (e.g., `my-command`, not `MyCommand`)
2. **Document execution**: Clearly explain what the command does
3. **Provide examples**: Show users how to invoke the command
4. **Test thoroughly**: Ensure your command works before sharing
5. **Version control**: Commit commands to version control for team sharing

## Example: Complete Command

Here's a complete working command example:

```
.claude/commands/build-project/
└── command.md
```

**command.md:**
```markdown
# Build Project

**Name:** build-project
**Description:** Builds the project and runs tests
**Type:** shell

## What This Command Does

This command compiles the project and runs the test suite.

## Execution

When invoked:
1. Compiles all source files
2. Runs unit tests
3. Generates a build report

## Examples

```
claude build-project
claude build-project --skip-tests
```
```

## Distinguishing Commands from Skills

- **Skills**: Reusable capabilities available across projects, installed once
- **Commands**: Discrete executable actions specific to workflows
- **See also**: [Installing Skills in Claude Code](./claude-code-skills-installation.md)

## Further Reading

- [Claude Code Documentation](https://claude.com/claude-code)
- [Skills vs Commands](../ide-concepts/skills-vs-commands.md)
