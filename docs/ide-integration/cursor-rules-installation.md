# Installing Rules in Cursor

Rules are project-specific instructions and guidelines that guide Cursor's behavior. Rules are stored in the `.cursor/rules/` directory using Markdown or Markdown with Comments (.mdc) format.

## Directory Structure

Cursor discovers rules from the `.cursor/rules/` directory:

```
project/
├── .cursor/
│   ├── rules/
│   │   ├── code-style.mdc
│   │   ├── naming-conventions.md
│   │   ├── security/
│   │   │   └── authentication.md
│   │   └── performance/
│   │       └── optimization.md
│   └── skills/
```

Rules support nested directories for organization. Each subdirectory can have its own `.cursor/rules/` folder for scoped rules.

## Rule File Format

Rules use Markdown (.md) or Markdown with Comments (.mdc) format:

```markdown
# Rule Name

This rule describes specific guidance for [topic].

## Guidelines

- Guideline 1
- Guideline 2
- Guideline 3

## Examples

Example of following this rule:

```code
code example here
```

## Related Rules

- Related rule 1
- Related rule 2
```

## .mdc Format (Markdown with Comments)

The `.mdc` format allows special comment syntax:

```mdc
<!-- This is a comment -->
# Rule with Comments

This is the visible content.

<!-- Hidden comment: internal notes go here -->

## Implementation

Follow these steps:
1. Step 1 <!-- Comment about step 1 -->
2. Step 2 <!-- Comment about step 2 -->
```

## Installation Steps

### Step 1: Create Rules Directory

```bash
mkdir -p .cursor/rules
```

### Step 2: Create a Rule File

Create `.cursor/rules/my-rule.md`:

```markdown
# My Development Rule

This rule guides [aspect] of development in this project.

## Guidelines

- Guideline 1: Description
- Guideline 2: Description

## Examples

Good example:
```
[good code example]
```

Avoid:
```
[bad code example]
```
```

### Step 3: Organize Rules (Optional)

Create subdirectories for better organization:

```bash
mkdir -p .cursor/rules/security
mkdir -p .cursor/rules/performance
```

Then add rules to each subdirectory:

```bash
# Create .cursor/rules/security/auth.md
# Create .cursor/rules/performance/caching.md
```

### Step 4: Commit to Version Control

```bash
git add .cursor/rules/
git commit -m "feat: add project development rules"
```

## Nested Rules and Scoping

Cursor supports nested rule scoping:

```
project/
├── .cursor/rules/          (root rules)
│   ├── general.md
│   └── database/
│       ├── .cursor/rules/  (database-scoped rules)
│       │   └── schema.md
│       └── schema.sql
```

Each `.cursor/rules/` directory applies to its location and subdirectories.

## Rule Naming Conventions

Use clear, descriptive file names:

```
.cursor/rules/
├── code-style.mdc
├── naming-conventions.md
├── testing.md
├── security.md
├── database.md
├── api.md
└── deployment.md
```

## Validation

To verify rules are properly installed:

1. Check `.cursor/rules/` directory exists
2. Verify rule files are in .md or .mdc format
3. Test that Cursor recognizes the rules
4. Confirm rules apply to the correct scope

## Cursor Rules vs Skills

In Cursor, rules and skills serve different purposes:

| Feature | Rules | Skills |
|---------|-------|--------|
| **Location** | `.cursor/rules/` | `.cursor/skills/` |
| **Purpose** | Project-specific guidance | Reusable capabilities |
| **Format** | .md or .mdc files | Directory with SKILL.md |
| **Scope** | Project-specific | Global or project |
| **Use For** | Developer instructions, context | Code patterns, utilities |
| **Persistence** | Version-controlled | Discovered by IDE |

**See also**: [Installing Skills in Cursor](./cursor-skills-installation.md)

## Best Practices

1. **Organize by topic**: Group related rules in subdirectories
2. **Be specific**: Write clear, actionable guidance
3. **Include examples**: Show good and bad examples
4. **Version control**: Commit rules to git
5. **Document scope**: Clarify when each rule applies
6. **Keep updated**: Maintain rules as project evolves
7. **Use .mdc format**: For rules with internal notes

## Example Rule Files

### code-style.mdc

```mdc
# Code Style Guide

<!-- This rule applies to all code in the project -->

This project follows a consistent code style to improve readability and maintainability.

## Formatting

- Use 2-space indentation
- Maximum line length: 100 characters
- Use prettier for automatic formatting

<!-- Internal note: Configure prettier in .prettierrc -->

## Examples

Good:
```
const result = calculateValue(
  param1,
  param2
);
```

Avoid:
```
const result = calculateValue(param1, param2);
```
```

### security.md

```markdown
# Security Guidelines

This rule outlines security practices for this project.

## Authentication

- Always validate user input
- Use HTTPS for all communications
- Implement rate limiting on APIs

## Data Protection

- Encrypt sensitive data at rest
- Use secure password hashing (bcrypt, argon2)
- Never log passwords or tokens

## Examples

Secure:
```javascript
const hashedPassword = await bcrypt.hash(password, 10);
```

Avoid:
```javascript
const password = userInput; // Never store plaintext
```
```

## Common Issues

### Rules Not Applying

- **Check directory**: Ensure `.cursor/rules/` exists in project root
- **File format**: Use .md or .mdc extension
- **Syntax**: Ensure valid Markdown syntax
- **Restart**: Restart Cursor after adding rules

### Nested Rules Not Working

- **Check nesting**: Ensure subdirectories have `.cursor/rules/` if they need specific scoping
- **Path**: Use relative paths from rule location
- **Scope**: Remember that closer rules override parent rules

## Next Steps

- [Managing Rules in Cursor](../ide-concepts/cursor-rules-management.md)
- [Understanding Skills vs Rules](../ide-concepts/cursor-skills-vs-rules.md)
- [Cursor Official Documentation](https://cursor.com/docs/context/rules)
