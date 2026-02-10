# `.instill/state.json` Configuration Examples

This document provides example configurations for `.instill/state.json` with various remote source setups.

## Minimal Configuration (Local Only)

```json
{
  "last_updated": "2024-02-14T12:00:00Z",
  "installed_skills": ["typescript-guru"],
  "active_targets": ["claude-code"],
  "sources": []
}
```

- No remote sources configured
- Only local skills in `.instill/library/` are available

## Single Official Repository

```json
{
  "last_updated": "2024-02-14T12:00:00Z",
  "installed_skills": ["typescript-best-practices", "react-patterns"],
  "active_targets": ["claude-code"],
  "sources": [
    {
      "url": "https://github.com/xblaster/instill-skills",
      "type": "github",
      "name": "official"
    }
  ]
}
```

**Usage**:
- Load any skill: `instill init` shows all available skills
- Load from official: `typescript-best-practices` (auto-discovered)
- Prefer official: `typescript-best-practices@official`

## Multiple Organization Sources

```json
{
  "last_updated": "2024-02-14T12:00:00Z",
  "installed_skills": [
    "typescript-best-practices",
    "security-guidelines",
    "api-design-patterns"
  ],
  "active_targets": ["claude-code", "cursor"],
  "sources": [
    {
      "url": "https://github.com/xblaster/instill-skills",
      "type": "github",
      "name": "official"
    },
    {
      "url": "https://github.com/your-company/internal-standards",
      "type": "github",
      "name": "company-standards"
    },
    {
      "url": "https://github.com/your-team/team-practices",
      "type": "github",
      "name": "team-practices"
    }
  ]
}
```

**Usage**:
- `typescript-best-practices` → Searches in order: official → company → team
- `security-guidelines@company-standards` → From company standards only
- `api-design-patterns@team-practices` → From team practices only

**Resolution Order**:
1. Local library (`.instill/library/`)
2. Cache (valid for 7 days)
3. Remote sources (in configured order)

## Development Team Setup

```json
{
  "last_updated": "2024-02-14T12:00:00Z",
  "installed_skills": [
    "typescript-expert",
    "react-expert",
    "testing-standards",
    "code-review-checklist"
  ],
  "active_targets": ["claude-code", "cursor", "vscode"],
  "sources": [
    {
      "url": "https://github.com/acme-corp/engineering-standards",
      "type": "github",
      "name": "engineering"
    },
    {
      "url": "https://github.com/acme-corp/frontend-team/skill-library",
      "type": "github",
      "name": "frontend"
    },
    {
      "url": "https://github.com/acme-corp/security-team/best-practices",
      "type": "github",
      "name": "security"
    },
    {
      "url": "https://github.com/xblaster/instill-skills",
      "type": "github",
      "name": "instill-official"
    }
  ]
}
```

**Structure**:
- Company-wide engineering standards (first priority)
- Frontend team specific practices
- Security team guidelines
- Instill official skills (fallback)

## Enterprise Setup with Fallbacks

```json
{
  "last_updated": "2024-02-14T12:00:00Z",
  "installed_skills": [
    "enterprise-typescript",
    "enterprise-api-design",
    "react-patterns",
    "testing-guide"
  ],
  "active_targets": ["claude-code", "cursor"],
  "sources": [
    {
      "url": "https://github.com/acme-corp/enterprise-standards",
      "type": "github",
      "name": "enterprise"
    },
    {
      "url": "https://github.com/acme-corp/dept-practices",
      "type": "github",
      "name": "department"
    },
    {
      "url": "https://github.com/xblaster/instill-skills",
      "type": "github",
      "name": "community"
    }
  ]
}
```

**Fallback Strategy**:
1. Enterprise standards first (mandatory)
2. Department practices (team-specific)
3. Community skills (reference/backup)

## Project-Specific Configuration

```json
{
  "last_updated": "2024-02-14T12:00:00Z",
  "installed_skills": [
    "nextjs-app-router",
    "typescript-strict",
    "testing-react-components",
    "deployment-checklist"
  ],
  "active_targets": ["claude-code"],
  "sources": [
    {
      "url": "https://github.com/my-org/nextjs-project-standards",
      "type": "github",
      "name": "project"
    },
    {
      "url": "https://github.com/my-org/company-standards",
      "type": "github",
      "name": "company"
    },
    {
      "url": "https://github.com/xblaster/instill-skills",
      "type": "github",
      "name": "official"
    }
  ]
}
```

**Perfect for**:
- Large projects with specific requirements
- Multi-team projects with shared and project-specific standards
- Projects using standard reference materials

## Source Entry Fields

Each source object must have:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | string | Yes | GitHub repository URL (must start with `https://github.com/`) |
| `type` | string | Yes | Repository type (currently only `"github"` supported) |
| `name` | string | Yes | Identifier for explicit source selection (e.g., `skill@official`) |

### Example Source

```json
{
  "url": "https://github.com/xblaster/instill-skills",
  "type": "github",
  "name": "official"
}
```

## Caching Behavior

Remote skills are automatically cached in `.instill/.cache/` with these characteristics:

- **Default TTL**: 7 days
- **Cache Location**: `.instill/.cache/skills/`
- **Metadata**: `.instill/.cache/metadata.json`

### Cache Metadata Example

```json
{
  "typescript-best-practices": {
    "source": "official",
    "fetchedAt": "2024-02-10T12:00:00Z"
  },
  "react-patterns": {
    "source": "official",
    "fetchedAt": "2024-02-09T15:30:00Z"
  }
}
```

## Managing Sources

### Add a Source

```bash
instill sources
# Select: Add a new source
# Enter: https://github.com/my-org/my-skills
```

This will be added to the `sources` array in `.instill/state.json`.

### View Configured Sources

```bash
instill sources
# Select: View Configured Sources
```

Lists all configured sources with their names and URLs.

### Remove a Source

```bash
instill sources
# Select: Remove Remote Source
# Choose source to delete
```

The source will be removed from `sources` array.

### Clear Cache

```bash
# Clear all cache
instill cache-clear

# Clear specific skill
instill cache-clear -s skill-name
```

## Notes

- **Local skills always take precedence** over remote versions with the same name
- **Source order matters** - earlier sources are checked first for skills
- **Backward compatible** - old state files without `sources` field continue to work
- **Network optional** - cached skills work offline
- **Automatic upgrades** - state file format is automatically upgraded when needed

## Common Patterns

### Override Remote Skill Locally

1. Add remote skill to `installed_skills`
2. Create same skill in `.instill/library/skill-name.md`
3. Local version will be used automatically

### Use Multiple Versions

```bash
# Original from official
skill-name@official

# Custom from company
skill-name@company
```

### Gradual Migration

```json
"sources": [
  { "url": "https://github.com/old-org/old-skills", "type": "github", "name": "legacy" },
  { "url": "https://github.com/new-org/new-skills", "type": "github", "name": "current" },
  { "url": "https://github.com/xblaster/instill-skills", "type": "github", "name": "official" }
]
```

Gradually phase out legacy source by moving skills to current source.

---

Last Updated: 2024-02-14
