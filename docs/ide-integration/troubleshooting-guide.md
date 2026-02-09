# IDE Integration Troubleshooting Guide

This guide provides solutions for common problems when installing and using skills, commands, and tasks in different IDEs.

## Quick Troubleshooting Index

| Problem | IDEs Affected | Solution |
|---------|---------------|----------|
| Skill not appearing | All | [Check Directory Structure](#skill-not-appearing) |
| Task not appearing | All | [Check Configuration](#task-not-appearing) |
| Installation fails | All | [Check Permissions](#installation-fails) |
| Performance issues | All | [Check Resource Usage](#performance-issues) |
| Symlinks not working | Cursor, Codex, Antigravity | [Check Symlink Setup](#symlinks-not-working) |
| Discovery conflicts | Codex, Antigravity | [Check Discovery Order](#discovery-conflicts) |

## Skill Not Appearing

### Claude Code

**Symptoms**: Skill doesn't appear in skill list after adding to `.claude/skills/`

**Checklist**:
1. Verify directory exists: `.claude/skills/my-skill/`
2. Check `SKILL.md` exists with proper metadata
3. Ensure `**Name:**` and `**Description:**` are present
4. Check file permissions (readable by Claude Code)
5. Restart Claude Code

**Solution**:
```bash
# Verify directory structure
ls -la .claude/skills/my-skill/
ls -la .claude/skills/my-skill/SKILL.md

# Check file permissions
chmod 644 .claude/skills/my-skill/SKILL.md

# Restart Claude Code
```

### Cursor

**Symptoms**: Skill in `.cursor/skills/` not discovered

**Checklist**:
1. Verify directory exists: `.cursor/skills/my-skill/`
2. Check `SKILL.md` exists and is properly formatted
3. Check for symlink issues (resolve if needed)
4. Ensure permissions are correct
5. Try global location: `~/.cursor/skills/my-skill/`
6. Restart Cursor

**Solution**:
```bash
# Check directory
ls -la .cursor/skills/my-skill/

# If using symlink, verify target exists
if [ -L ".cursor/skills/my-skill" ]; then
  realpath .cursor/skills/my-skill
fi

# Restart Cursor
```

### Codex

**Symptoms**: Skill in `.agents/skills/` not found

**Checklist**:
1. Verify in search path (current dir up to repo root)
2. Check if exceeded `max_bytes` discovery limit
3. Verify `SKILL.md` syntax and metadata
4. Check `~/.codex/config.toml` for search configuration
5. Ensure not blocked by `.codex/skills/.system/`

**Solution**:
```bash
# Check if in search path
pwd  # current directory
git rev-parse --show-toplevel  # repo root

# Check for byte limit issues
find .agents/skills -name "SKILL.md" -exec wc -c {} \;

# Edit config if needed
cat ~/.codex/config.toml

# Re-initialize Codex discovery
codex reinit
```

### Antigravity

**Symptoms**: Skill in `.agent/skills/` not appearing

**Checklist**:
1. Verify directory: `.agent/skills/my-skill/`
2. Check `SKILL.md` metadata format
3. Check global location: `~/.gemini/antigravity/skills/my-skill/`
4. Verify symlink target exists (if using symlinks)
5. Check file permissions
6. Restart Antigravity

**Solution**:
```bash
# Verify structure
ls -la .agent/skills/my-skill/SKILL.md

# Check global skills
ls -la ~/.gemini/antigravity/skills/

# Verify symlinks
for link in .agent/skills/*; do
  if [ -L "$link" ]; then
    echo "Symlink: $link -> $(readlink $link)"
  fi
done
```

## Task Not Appearing

### VS Code

**Symptoms**: Task not in task palette after adding to `.vscode/tasks.json`

**Checklist**:
1. Verify `.vscode/tasks.json` has valid JSON syntax
2. Ensure each task has unique `label` field
3. Check `type` is `"shell"` or `"process"`
4. Verify `command` exists on system
5. Check file permissions
6. Restart VS Code
7. Try "Tasks: Reload Tasks" command

**Solution**:
```bash
# Validate JSON syntax
cat .vscode/tasks.json | jq . > /dev/null && echo "Valid JSON" || echo "Invalid JSON"

# Check if command exists
which npm  # for npm tasks
which python  # for Python tasks

# Restart VS Code from command line
code --kill
code .
```

### Claude Code / Cursor

**Symptoms**: Task not appearing in task system

**Solution**: Check IDE-specific task management system. Tasks are IDE-provided, not file-based like VS Code.

## Installation Fails

### Directory Creation Fails

**Symptoms**: Permission denied when creating skill directory

**Solution**:
```bash
# Check permissions on parent directory
ls -la .claude/
ls -la .cursor/

# Create with proper permissions
mkdir -p .claude/skills/my-skill
chmod 755 .claude/skills/my-skill

# Set file permissions
chmod 644 .claude/skills/my-skill/SKILL.md
```

### File Write Fails

**Symptoms**: Cannot write `SKILL.md` file

**Solution**:
```bash
# Check disk space
df -h

# Check file permissions
touch test-file
rm test-file

# Verify IDE has write access
ls -la .claude/
```

### Symlink Creation Fails

**Symptoms**: Cannot create symlink for skills

**Solution**:
```bash
# On Windows, symlinks may require admin
# Create with appropriate flag
ln -s /path/to/source target  # Unix
mklink /D target \path\to\source  # Windows (requires admin)

# On Windows without admin, use junction
mklink /J target \path\to\source
```

## Performance Issues

### Slow IDE Startup

**Symptoms**: IDE takes longer to start after adding skills

**Solution** (Codex):
```bash
# Check total skill size
du -sh .agents/skills/

# Check byte limit in config
cat ~/.codex/config.toml | grep max_bytes

# Increase limit or remove unused skills
# Edit ~/.codex/config.toml:
# [skill_discovery]
# max_bytes = 131072  # 128 KiB instead of 32 KiB
```

**Solution** (Antigravity):
Uses Progressive Disclosure, so startup should be fast. If slow:
```bash
# Check for large SKILL.md files
find .agent/skills -name "SKILL.md" -exec wc -l {} \;

# Consider splitting large skills
```

### Script Execution Slow

**Symptoms**: Skills with scripts execute slowly

**Solution**:
```bash
# Check script permissions
ls -la .agent/skills/my-skill/scripts/

# Make scripts executable
chmod +x .agent/skills/my-skill/scripts/*.sh
chmod +x .agent/skills/my-skill/scripts/*.py

# Profile script execution
time .agent/skills/my-skill/scripts/my-script.sh

# Optimize script
# - Remove unnecessary operations
# - Cache results if possible
# - Use built-in commands instead of external programs
```

## Symlinks Not Working

### Symlink Target Not Found

**Symptoms**: Symlink exists but target not found

**Solution**:
```bash
# Verify target exists
ls -la ~/shared-skills/my-skill/

# Use absolute paths
ln -s ~/shared-skills/my-skill .cursor/skills/my-skill

# Check symlink
ls -L .cursor/skills/my-skill  # should show target
readlink -f .cursor/skills/my-skill  # show full path
```

### Symlink Permission Denied

**Symptoms**: Cannot create or access symlink

**Solution**:
```bash
# Check permissions on parent
ls -la .cursor/
ls -la ~/shared-skills/

# Ensure read permissions on target
chmod -R 755 ~/shared-skills/my-skill

# Try with sudo if needed (not recommended)
sudo ln -s ~/shared-skills/my-skill .cursor/skills/my-skill
```

### Windows Symlink Issues

**Symptoms**: Symlinks not working on Windows

**Solution**:
```bash
# Windows requires admin or Developer Mode
# Use junction instead of symlink
mklink /J .cursor\skills\my-skill ..\shared-skills\my-skill

# Or use mklink with /D for directory
mklink /D .cursor\skills\my-skill ..\shared-skills\my-skill

# Verify junction
dir .cursor\skills\my-skill
```

## Discovery Conflicts

### Multiple Skill Versions Found

**Symptoms**: IDE finds multiple versions of same skill

**Solution** (Codex):
```bash
# Check all locations
ls -la .agents/skills/my-skill/
ls -la ~/.codex/skills/my-skill/

# Delete duplicate
rm -rf ~/.codex/skills/my-skill/

# Or disable in config
# ~/.codex/config.toml:
# [[skills.config]]
# path = "~/.codex/skills/my-skill/SKILL.md"
# enabled = false
```

### Hierarchical Discovery Confusion

**Symptoms**: Wrong version of skill being used

**Solution** (Codex):
```bash
# Understand discovery order
cd project/src
# Codex will search:
# 1. src/.agents/skills/
# 2. project/.agents/skills/
# 3. ~/.codex/skills/

# Verify which file is being used
codex show-skill-source my-skill
```

## Configuration Issues

### Environment Variables Not Working

**Symptoms**: Task uses environment variable that doesn't expand

**Solution** (VS Code):
```bash
# Use correct syntax in tasks.json
"command": "${env:MYVAR}"  // For env variable
"cwd": "${workspaceFolder}"  // For workspace

# Test variable exists
echo $MYVAR  # Unix
echo %MYVAR%  # Windows

# Set for task execution
"env": {
  "MYVAR": "value"
}
```

### Cross-Platform Path Issues

**Symptoms**: Script fails on different OS (Windows vs Unix)

**Solution**:
```bash
# Use forward slashes in JSON
"cwd": "${workspaceFolder}/src"  // Works on all OS

# Or platform-specific
"windows": {
  "command": "cmd",
  "args": ["/c", "script.cmd"]
},
"linux": {
  "command": "/bin/bash",
  "args": ["-c", "script.sh"]
}
```

## Validation and Debugging

### Validate All Installations

```bash
# Check all skill directories exist
find .claude/skills -name "SKILL.md"
find .cursor/skills -name "SKILL.md"
find .agents/skills -name "SKILL.md"
find .agent/skills -name "SKILL.md"

# Validate JSON files
jq . .vscode/tasks.json > /dev/null && echo "Valid"

# Check file permissions
ls -la .claude/skills/*/SKILL.md
```

### Enable Debug Logging

**Codex**:
```bash
# Set debug environment variable
export CODEX_DEBUG=1
codex exec "command"
```

**Cursor**:
```bash
# Check Cursor logs
tail -f ~/Library/Logs/Cursor  # macOS
tail -f ~/.config/Cursor/logs  # Linux
```

**VS Code**:
```bash
# Check VS Code logs
tail -f ~/.config/Code/logs  # Linux
tail -f ~/Library/Logs/Code  # macOS
```

## Getting Help

### When to Escalate

1. **Verified all steps** in troubleshooting guide
2. **Checked official documentation** for your IDE
3. **Created minimal reproducible example**
4. **Collected debug logs** if available

### Reporting Issues

When reporting a problem, include:

1. **IDE and version**: e.g., "Cursor 0.35.1"
2. **Directory structure**: Output of `find .agent/skills -type f`
3. **Error message**: Exact error text
4. **Steps to reproduce**: Minimal steps that trigger issue
5. **Debug logs**: From IDE or console
6. **System info**: OS, Python version, Node version, etc.

### Useful Commands

```bash
# IDE versions
cursor --version
codex --version
code --version

# Path debugging
which python
which npm
echo $PATH

# File system
find .agent/skills -type f
ls -la .claude/
stat .claude/skills/my-skill/SKILL.md

# JSON validation
cat file.json | jq .

# Markdown validation
cat SKILL.md  # visual inspection
```

## Common Solutions Summary

| Issue | First Try | If That Fails |
|-------|-----------|---------------|
| Skill not appearing | Restart IDE | Check directory structure |
| Task not appearing | Restart IDE | Validate JSON/config syntax |
| Installation fails | Check permissions | Try absolute paths |
| Symlinks broken | Verify target exists | Use absolute path to target |
| Slow startup | Check skill count | Reduce size or increase limits |
| Script fails | Check permissions | Verify shebang and syntax |

---

**Need More Help?**

- [Master Installation Guide](./master-installation-guide.md)
- [IDE-Specific Guides](./master-installation-guide.md#installation-guides-by-ide)
- Official IDE Documentation links in guides
