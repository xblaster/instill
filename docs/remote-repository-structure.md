# Remote Skill Repository Structure

This guide explains how to structure a GitHub repository for use with Instill as a remote skill source.

## Standard Structure

The recommended structure for an Instill skill repository:

```
your-instill-skills/
├── skills/
│   ├── typescript-best-practices.md
│   ├── react-patterns.md
│   ├── security-audit.md
│   ├── api-design.md
│   └── ... (more skills)
├── README.md
├── LICENSE
└── .gitignore
```

### Directory Layout Details

#### `skills/` Directory (Required)

All skill files must be in the `skills/` directory at the repository root.

- **Location**: `skills/`
- **File naming**: `skill-name.md`
- **Naming conventions**:
  - Use kebab-case (lowercase with hyphens)
  - No spaces in filenames
  - Use `.md` extension

**Valid names**:
- `typescript-best-practices.md` ✓
- `react-patterns.md` ✓
- `security-audit.md` ✓
- `api-design.md` ✓

**Invalid names**:
- `TypeScript Best Practices.md` ✗ (spaces, mixed case)
- `react_patterns.md` ✗ (underscore instead of hyphen)
- `security-audit.txt` ✗ (wrong extension)

#### `README.md` (Recommended)

Document your skill repository:

```markdown
# Your Organization Skills

A curated collection of coding standards and best practices.

## Available Skills

- `typescript-best-practices` - TypeScript coding standards
- `react-patterns` - React component patterns
- `security-audit` - Security review checklist

## Installation

Add this repository as a remote source in Instill:

\`\`\`bash
instill sources
# Select: Add a new source
# Enter: https://github.com/your-org/your-instill-skills
\`\`\`

## Usage

Load skills via Instill:

\`\`\`bash
instill init
\`\`\`

Then select which skills to apply to which AI tools.

## Contributing

See CONTRIBUTING.md for guidelines.
```

#### `LICENSE` (Recommended)

Include a license for your skills repository. Common choices:
- MIT
- Apache 2.0
- CC-BY-4.0 (for documentation)

#### `.gitignore` (Recommended)

```
# Instill cache (should not be committed)
.instill/.cache/

# Node modules (if any build tooling)
node_modules/

# OS files
.DS_Store
Thumbs.db

# Editor files
.vscode/
.idea/
*.swp
```

## Skill File Format

Each skill is a simple Markdown file with optional YAML frontmatter.

### Basic Skill File

```markdown
# TypeScript Best Practices

Use strict mode and type annotations for all code.

## Key Rules

1. Always use `strict` mode
2. Enable strict type checking in tsconfig.json
3. Avoid `any` types
4. Use interfaces for contracts

## Example

\`\`\`typescript
// ✓ Good
interface User {
  name: string;
  age: number;
}

function getUser(id: number): User {
  // implementation
}

// ✗ Bad
function getUser(id) {
  // missing types
}
\`\`\`
```

### Skill with Metadata

```markdown
---
title: TypeScript Best Practices
description: TypeScript coding standards and patterns
version: 1.0.0
tags: [typescript, standards, typing]
---

# TypeScript Best Practices

Use strict mode and type annotations for all code.

[... rest of content ...]
```

## Official Repository Example

The official Instill Skills repository follows this structure:

```
instill-skills/
├── skills/
│   ├── typescript-best-practices.md
│   │   ├── General TypeScript guidelines
│   │   ├── Type safety practices
│   │   └── Example patterns
│   ├── react-patterns.md
│   │   ├── Component design
│   │   ├── Hooks best practices
│   │   └── State management
│   ├── security-audit.md
│   │   ├── OWASP top 10 checklist
│   │   ├── Common vulnerabilities
│   │   └── Security review process
│   ├── api-design.md
│   │   ├── RESTful principles
│   │   ├── Error handling
│   │   └── Documentation standards
│   └── ... (more skills)
├── README.md
├── LICENSE (MIT)
└── .gitignore
```

**Repository**: https://github.com/xblaster/instill-skills

## Creating Your Own Repository

### Step 1: Create Repository Structure

```bash
mkdir your-instill-skills
cd your-instill-skills

# Create directory structure
mkdir skills
touch README.md LICENSE .gitignore
```

### Step 2: Add Skills

Create Markdown files in the `skills/` directory:

```bash
# Create first skill
cat > skills/typescript-best-practices.md << 'EOF'
# TypeScript Best Practices

[Your content here]
EOF

# Create second skill
cat > skills/security-guidelines.md << 'EOF'
# Security Guidelines

[Your content here]
EOF
```

### Step 3: Add Documentation

Update `README.md`:

```markdown
# Your Skills Repository

[Describe your skills and organization]

## Available Skills

- `typescript-best-practices` - TypeScript standards
- `security-guidelines` - Security best practices

## Usage

[Installation instructions]
```

### Step 4: Initialize Git and Push

```bash
# Initialize repository
git init
git add .
git commit -m "Initial commit: Add skills repository"

# Add remote and push
git remote add origin https://github.com/your-org/your-instill-skills.git
git branch -M main
git push -u origin main
```

### Step 5: Use in Instill

```bash
# Add your repository as a source
instill sources
# Select: Add a new source
# Enter: https://github.com/your-org/your-instill-skills

# Use your skills
instill init
```

## Repository Guidelines

### Best Practices

1. **Descriptive Skill Names**
   - Use clear, specific names
   - Examples: `react-hooks-patterns`, `api-error-handling`, `ci-cd-pipeline`

2. **Comprehensive Content**
   - Include examples and code snippets
   - Explain the "why" not just the "what"
   - Provide links to resources

3. **Consistent Formatting**
   - Use consistent Markdown structure
   - Follow the same format across all skills

4. **Keep Repository Clean**
   - Only include skill files in `skills/`
   - Don't commit `.instill/.cache/`
   - Maintain good `.gitignore`

5. **Document Maintenance**
   - Keep README up-to-date
   - Version your skills (optional)
   - Document changes in git history

### Skill Content Checklist

For each skill file, include:

- [ ] Clear title/heading
- [ ] Brief description
- [ ] Key principles or rules
- [ ] Code examples (if applicable)
- [ ] Common patterns
- [ ] Links to resources
- [ ] Exceptions or edge cases

## Multi-Project Repository

For organizations managing multiple skill sets:

```
your-org-skills/
├── skills/
│   ├── shared/
│   │   ├── typescript-standards.md
│   │   └── security-checklist.md
│   ├── frontend/
│   │   ├── react-patterns.md
│   │   └── web-performance.md
│   ├── backend/
│   │   ├── api-design.md
│   │   └── database-patterns.md
│   └── devops/
│       ├── deployment-checklist.md
│       └── monitoring-guide.md
├── README.md
└── LICENSE
```

**Note**: Instill treats all skills in the `skills/` directory the same way. You can use subdirectories for organization, but they don't affect how skills are discovered.

## Version Control

### Tracking Changes

Use meaningful commit messages for skill updates:

```bash
# Good messages
git commit -m "docs: update typescript-best-practices with new patterns"
git commit -m "docs: add async/await guidelines to api-design"
git commit -m "docs: clarify security checklist items"

# Less helpful
git commit -m "update"
git commit -m "fix"
```

### Releasing Versions

Optionally use git tags for versions:

```bash
# Tag a stable version
git tag -a v1.0.0 -m "Version 1.0.0: Initial release"
git push origin v1.0.0
```

## Sharing and Distribution

### Make Repository Public

1. GitHub Settings → Repository visibility
2. Set to "Public" for community use
3. Add `LICENSE` file

### Share with Team

Update `.instill/state.json`:

```json
{
  "sources": [
    {
      "url": "https://github.com/your-org/your-instill-skills",
      "type": "github",
      "name": "org-skills"
    }
  ]
}
```

### Share Configuration

Distribute `state.json` sample to team:

```bash
# Share with team (via documentation)
cat .instill/state.json
```

Team members can add the source:

```bash
instill sources
# Add: https://github.com/your-org/your-instill-skills
```

## Troubleshooting

### Skills Not Found

**Problem**: Added repository but skills not discovered

**Solution**:
1. Verify `/skills/` directory exists
2. Ensure files have `.md` extension
3. Check file names use kebab-case

### Fetch Failures

**Problem**: "Repository not found or not accessible"

**Solution**:
1. Verify repository is public
2. Check URL is correct: `https://github.com/org/repo`
3. Test repository access in browser
4. Verify no authentication required

### Skills Not in List

**Problem**: Skills exist in repository but don't appear in `instill init`

**Solution**:
1. Clear cache: `instill cache-clear`
2. Try again: `instill init`
3. Verify skill files in `/skills/` directory
4. Check file naming (lowercase, hyphens, `.md` extension)

## Advanced Patterns

### Monorepo with Multiple Skill Libraries

```
monorepo/
├── packages/
│   ├── instill-skills-official/skills/
│   ├── instill-skills-enterprise/skills/
│   └── instill-skills-team-a/skills/
└── ...
```

Each package can be pushed as separate repository.

### Dynamic Skill Generation

Use scripts to generate skills from other sources:

```bash
# Example: Generate skills from documentation
npm run generate-skills
# → Outputs to skills/
```

## Compatibility

**Current Instill Version**: 1.2.0+

**Supported Repository Types**: GitHub only

**Future Support**: GitLab, Gitea, etc. (planned)

---

Last Updated: 2024-02-14
Instill Version: 1.2.0+
