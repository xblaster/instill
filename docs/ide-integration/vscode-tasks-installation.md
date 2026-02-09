# Installing Tasks in VS Code

Tasks in VS Code provide task automation and execution capabilities. Unlike other IDEs, VS Code uses `.vscode/tasks.json` for defining and managing tasks (it does not have a native "skills" system).

## Important: VS Code Has No Native Skills System

VS Code does not support a native "skills" system like Cursor or Antigravity. Instead, VS Code uses:

- **Tasks** (`.vscode/tasks.json`): For automation and execution
- **Extensions**: For reusable capabilities across projects
- **Settings**: For configuration management

This guide covers **tasks**. For extending VS Code with reusable capabilities, see [Extending VS Code with Extensions](#extending-vs-code-with-extensions).

## Directory Structure

VS Code tasks are defined in the workspace configuration:

```
project/
├── .vscode/
│   ├── tasks.json       (workspace tasks)
│   ├── launch.json      (debug configurations)
│   └── settings.json    (workspace settings)
├── .code-workspace      (multi-root workspace)
└── src/
```

## Task Definition Format

Tasks follow JSON Schema version 2.0.0:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "task-name",
      "type": "shell",
      "command": "echo 'Hello World'",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "panel": "new"
      }
    }
  ]
}
```

## Installation Steps

### Step 1: Create .vscode Directory

```bash
mkdir -p .vscode
```

### Step 2: Create tasks.json

Create `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "build",
      "type": "shell",
      "command": "npm",
      "args": ["run", "build"],
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    }
  ]
}
```

### Step 3: Verify Installation

1. Open the project in VS Code
2. Open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P)
3. Type "Tasks: Run Task"
4. Select your task from the list

### Step 4: Commit to Version Control

```bash
git add .vscode/tasks.json
git commit -m "feat: add VS Code task definitions"
```

## Task Types

### Shell Type

Execute shell commands:

```json
{
  "label": "run-tests",
  "type": "shell",
  "command": "npm",
  "args": ["test"],
  "windows": {
    "command": "npm.cmd"
  }
}
```

### Process Type

Execute external programs:

```json
{
  "label": "build",
  "type": "process",
  "command": "/usr/bin/python",
  "args": ["build.py"]
}
```

## Task Variables

VS Code provides special variables for task definitions:

```json
{
  "label": "echo-file",
  "type": "shell",
  "command": "echo",
  "args": ["${file}"]
}
```

### Common Variables

| Variable | Description |
|----------|-------------|
| `${workspaceFolder}` | Root folder of opened workspace |
| `${workspaceFolderBasename}` | Workspace folder name only |
| `${file}` | Current opened file |
| `${fileBasename}` | Current file name only |
| `${fileDirname}` | Current file directory |
| `${fileExtname}` | Current file extension |
| `${relativeFile}` | File relative to workspace |
| `${selectedText}` | Selected text in editor |
| `${cwd}` | Current working directory |

### Multi-Root Workspace Variables

For multi-root workspaces:

```json
{
  "label": "build-specific-folder",
  "type": "shell",
  "command": "make",
  "cwd": "${workspaceFolder:backend}"
}
```

## Task Groups

Group related tasks:

```json
{
  "label": "build",
  "type": "shell",
  "command": "npm",
  "args": ["run", "build"],
  "group": {
    "kind": "build",
    "isDefault": true
  }
}
```

### Group Kinds

- `build`: Build tasks
- `test`: Test tasks
- `clean`: Clean tasks
- Custom groups: Any string

## Example Complete tasks.json

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "npm: install",
      "type": "shell",
      "command": "npm",
      "args": ["install"],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "npm: build",
      "type": "shell",
      "command": "npm",
      "args": ["run", "build"],
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "presentation": {
        "reveal": "always",
        "panel": "shared"
      }
    },
    {
      "label": "npm: test",
      "type": "shell",
      "command": "npm",
      "args": ["test"],
      "group": {
        "kind": "test",
        "isDefault": true
      }
    },
    {
      "label": "npm: lint",
      "type": "shell",
      "command": "npm",
      "args": ["run", "lint"]
    }
  ]
}
```

## Workspace Scope

Tasks defined in `.vscode/tasks.json` are workspace-specific:

- Apply only to the current workspace
- Automatically available to all VS Code instances working with that workspace
- Not available in other workspaces

## Multi-Root Workspace Tasks

For multi-root workspaces, define tasks in `.code-workspace`:

```json
{
  "folders": [
    { "path": "frontend" },
    { "path": "backend" }
  ],
  "settings": {
    "files.exclude": {}
  },
  "tasks": [
    {
      "label": "build-frontend",
      "type": "shell",
      "command": "npm",
      "args": ["run", "build"],
      "cwd": "${workspaceFolder:frontend}"
    },
    {
      "label": "build-backend",
      "type": "shell",
      "command": "npm",
      "args": ["run", "build"],
      "cwd": "${workspaceFolder:backend}"
    }
  ]
}
```

## Extending VS Code with Extensions

Since VS Code lacks a native skills system, use extensions for reusable capabilities:

### Finding Extensions

1. Open VS Code Extension Marketplace
2. Search for functionality you need
3. Install extensions that provide the capability

### Creating Custom Extensions

For custom capabilities, create a VS Code extension:

1. Use the Extension Generator: `npm install -g yo generator-code`
2. Create your extension: `yo code`
3. Implement functionality in TypeScript
4. Publish to the marketplace

## Validation

To verify tasks are properly installed:

1. Check `.vscode/tasks.json` exists
2. Verify JSON syntax is valid
3. Open the Command Palette and run "Tasks: Run Task"
4. Select a task from the list to test

## Common Issues

### Task Not Appearing

- **Check syntax**: Validate JSON formatting in tasks.json
- **Check label**: Ensure each task has a unique `label`
- **Reload VS Code**: Restart VS Code after editing tasks.json

### Task Fails to Execute

- **Check command**: Ensure the command exists and is in PATH
- **Check args**: Verify arguments are correctly formatted
- **Check cwd**: Ensure current working directory is correct
- **Cross-platform**: Use appropriate commands for Windows vs Unix

### Variables Not Expanding

- **Check syntax**: Use correct variable syntax: `${variableName}`
- **Available context**: Some variables only available in certain contexts
- **Scope**: Multi-root variables only work with proper folder setup

## Best Practices

1. **Use meaningful labels**: Clear names for easy identification
2. **Document tasks**: Add comments explaining complex tasks
3. **Group logically**: Use `group` property for related tasks
4. **Set defaults**: Mark common build/test tasks as default
5. **Handle cross-platform**: Use platform-specific configs
6. **Version control**: Commit `.vscode/tasks.json` to git
7. **Use variables**: Leverage variables for flexibility

## Next Steps

- [VS Code Tasks Documentation](https://code.visualstudio.com/docs/editor/tasks)
- [VS Code Extensions](https://marketplace.visualstudio.com/)
- [Understanding VS Code vs Skills-Based IDEs](../ide-concepts/vscode-skills-comparison.md)
