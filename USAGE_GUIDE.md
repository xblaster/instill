# Instill CLI - Remote Sources Usage Guide

## Overview

The instill CLI supports managing remote GitHub skill repositories as sources. This allows you to:
- Add external skill libraries from GitHub
- Manage multiple skill sources
- Fetch skills from remote repositories
- Organize skills across different sources

---

## Adding the xblaster/instill-skills Source

### Method 1: Using the CLI Command (Direct)

```bash
instill sources add https://github.com/xblaster/instill-skills
```

### Method 2: Using the Interactive CLI

```bash
instill sources
```

Then select **"Add a new source"** and follow the prompts.

### Method 3: Using Node.js API

```javascript
import { addRemoteSource } from '@xblaster/instill/dist/core/sources.js';

const source = await addRemoteSource('https://github.com/xblaster/instill-skills');
console.log(`Added: ${source.name} (${source.url})`);
```

### Method 4: Direct State File

Edit `.instill/state.json` and add to the `sources` array.

---

## Managing Sources

### List All Sources

**CLI Command:**
```bash
instill sources list
```

**Interactive:**
```bash
instill sources
# Select "View Configured Sources"
```

**Output:**
```
Configured Remote Sources:
1. instill-skills (https://github.com/xblaster/instill-skills)
```

---

### Remove a Source

**CLI Command:**
```bash
instill sources remove instill-skills
```

**Interactive:**
```bash
instill sources
# Select "Remove a source" → Choose source to remove
```

---

## Using Skills from Remote Sources

### Install Skills Directly

```bash
instill install dependency-sentinel git-master
```

This will:
1. Discover the skills from local and remote sources.
2. Install them to the active target environments.
3. If no targets are active, it will prompt you to select them.

### Discover Skills (Interactive)

```bash
instill init
```

This will:
1. Discover all available skills (local + remote).
2. Let you select skills to install.
3. Synchronize selected skills to your adapters.
### Fetch a Specific Skill

**Programmatic:**
```javascript
import { fetchSkillFromRemote } from '@xblaster/instill/dist/core/fetch.js';
import { listRemoteSources } from '@xblaster/instill/dist/core/sources.js';

const sources = await listRemoteSources();
const source = sources.find(s => s.name === 'instill-skills');

const skillContent = await fetchSkillFromRemote(source, 'skill-name');
console.log(skillContent);
```

---

## Repository Structure

The remote repository should follow this structure:

```
github.com/xblaster/instill-skills/
├── main/
│   ├── skills/
│   │   ├── skill-name-1.md
│   │   ├── skill-name-2.md
│   │   └── ...
│   └── ...
```

Skills are expected to be Markdown files in the `skills/` directory on the `main` branch.

---

## Valid Repository URLs

### Requirements:
- ✓ Must be HTTPS protocol
- ✓ Must be GitHub (github.com)
- ✓ Must have format: `https://github.com/owner/repo`
- ✓ Optional trailing slash

### Valid Examples:
```
https://github.com/xblaster/instill-skills
https://github.com/xblaster/instill-skills/
https://github.com/user/my-repo-name
https://github.com/org/skills-library
```

### Invalid Examples:
```
http://github.com/user/repo              ✗ HTTP instead of HTTPS
https://gitlab.com/user/repo             ✗ GitLab instead of GitHub
github.com/user/repo                     ✗ Missing protocol
https://github.com/user                  ✗ Missing repo name
```

---

## Troubleshooting

### "Source with name X already exists"

**Problem:** You're trying to add a source that already exists

**Solution:** Either:
1. Use a different name: `instill sources` → Add → Provide custom name
2. Remove the existing source first

```javascript
import { removeRemoteSource } from '@xblaster/instill/dist/core/sources.js';
await removeRemoteSource('existing-name');
```

### "Invalid repository URL"

**Problem:** The URL format is not valid

**Solution:** Ensure your URL:
- Uses HTTPS (not HTTP)
- Is from GitHub (not GitLab, Bitbucket, etc.)
- Follows: `https://github.com/owner/repo`

### "Skill not found in repository"

**Problem:** Can't fetch a specific skill

**Solution:**
1. Verify the skill file exists in the remote repository
2. Check the file is named correctly with `.md` extension
3. Verify the repository structure matches expectations
4. Check that you're using the correct branch (`main` is default)

### "Network error"

**Problem:** Can't reach the GitHub repository

**Solution:**
1. Verify internet connectivity
2. Check the repository URL is correct
3. Ensure the repository is public
4. Try accessing the URL in a browser

---

## Advanced Usage

### Fetch from a Specific Branch

```javascript
import { fetchSkillFromRemote, convertGitHubUrlToRawUrl } from '@xblaster/instill/dist/core/fetch.js';

const source = {
  url: 'https://github.com/xblaster/instill-skills',
  type: 'github',
  name: 'instill-skills'
};

// Convert to raw URL with specific branch
const rawUrl = convertGitHubUrlToRawUrl(
  source.url,
  'skills/skill-name.md',
  'develop'  // Use 'develop' branch instead of 'main'
);

// Fetch manually
const response = await fetch(rawUrl);
const content = await response.text();
```

### Custom Source Names

Create multiple entries for the same repository with different purposes:

```javascript
import { addRemoteSource } from '@xblaster/instill/dist/core/sources.js';

// Production skills
await addRemoteSource(
  'https://github.com/xblaster/instill-skills',
  'production-skills'
);

// Experimental skills
await addRemoteSource(
  'https://github.com/xblaster/instill-skills',
  'experimental-skills'  // Different name, same repo
);
```

---

## Best Practices

### 1. Use Descriptive Names
```javascript
// Good
await addRemoteSource(
  'https://github.com/xblaster/instill-skills',
  'instill-official'
);

// Not ideal - too generic
await addRemoteSource(
  'https://github.com/xblaster/instill-skills'
  // Uses auto-generated 'instill-skills'
);
```

### 2. Organize by Purpose
```javascript
// Development skills
await addRemoteSource(
  'https://github.com/myorg/dev-skills',
  'dev-skills'
);

// Production skills
await addRemoteSource(
  'https://github.com/myorg/prod-skills',
  'prod-skills'
);
```

### 3. Keep URLs Public
Ensure repositories are public so the fetch mechanism can access them without authentication.

### 4. Document Your Skills
In your remote repository, maintain a `README.md` listing available skills:
```
# Available Skills

- skill-name-1: Description
- skill-name-2: Description
- ...
```

---

## Configuration Persistence

Source configurations are automatically saved to `.instill/state.json`:

```json
{
  "last_updated": "2026-02-09T13:54:50.374Z",
  "installed_skills": [],
  "active_targets": ["claude-code"],
  "sources": [
    {
      "url": "https://github.com/xblaster/instill-skills",
      "type": "github",
      "name": "instill-skills"
    }
  ]
}
```

This file is automatically managed by the CLI, but can be edited manually if needed.

---

## Integration with Other Commands

### With `instill init`

Sources are automatically discovered when running `instill init`:

```bash
instill init
# Discovers skills from:
# - Local skills in .instill/library/
# - All configured remote sources
```

### With `instill cache-clear`

Clear cached remote skills:

```bash
# Clear all caches
instill cache-clear

# Clear cache for specific skill
instill cache-clear --skill skill-name
```

---

## Summary

The remote source management feature provides a powerful way to extend instill with skills from GitHub repositories. The `https://github.com/xblaster/instill-skills` source has been successfully added and is ready for use.

For more information on creating or contributing to skill repositories, refer to the main instill documentation.
