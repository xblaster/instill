# Instill 🚀

**Instill** is the "Package Manager for AI Context." Stop manually syncing coding standards, architectural rules, and prompts across different AI tools. Instill orchestrates your project "Skills" and deploys them to the specific formats required by Claude, Cursor, VS Code, and more.

## 🎯 Why Instill?

Traditional package managers fetch code; Instill fetches **knowledge**. It acts as the bridge between your library of Markdown-based skills and the fragmented configuration files of modern AI agents.

- **Single Source of Truth**: Define a skill once in Markdown; use it everywhere.
- **Zero Friction**: Interactive TUI for selecting and installing skills.
- **Team Alignment**: Sync remote skill libraries from GitHub across your entire organization.
- **State-Aware**: Automatically cleans up removed skills and handles updates.

## 📦 Installation

Install Instill globally via your preferred package manager:

pnpm add -g @xblaster/instill  
\# or  
npm install -g @xblaster/instill  

## 🚀 2-Minute Quick Start

1.  **Create your Library**  
    Create a .instill/library/ directory in your project root and drop in a Markdown file (e.g., typescript-expert.md).
2.  **Launch the Orchestrator**  
    instill init  
    
3.  **Sync**  
    Select your skills and target AI tools (e.g., Cursor, Claude Code) from the interactive menu. Instill handles the file placement and formatting.

## 🌐 Remote Skill Libraries

Instill allows you to share and reuse skill libraries across teams using GitHub repositories.

### Official Skill Repository

We maintain a curated list of production-ready skills:

[**View Official Skills**](https://github.com/xblaster/instill-skills)

To add it to your project:

instill sources  
\# Select "Add a new source" and enter:  
\# \[https://github.com/xblaster/instill-skills\](https://github.com/xblaster/instill-skills)  

### Managing Sources

- **Add/Remove**: Use instill sources to manage your remote origins.
- **Caching**: Remote skills are cached in .instill/.cache/ for 7 days to ensure offline availability.
- **Resolution Order**: Local skills (.instill/library/) always override remote skills of the same name.

### Advanced Usage: Multiple Remote Sources

Example configuration with multiple skill libraries:

```json
{
  "last_updated": "2024-02-14T12:00:00Z",
  "installed_skills": ["typescript-best-practices", "react-patterns", "security-audit"],
  "active_targets": ["claude-code", "cursor"],
  "sources": [
    {
      "url": "https://github.com/xblaster/instill-skills",
      "type": "github",
      "name": "official"
    },
    {
      "url": "https://github.com/your-org/internal-standards",
      "type": "github",
      "name": "org-standards"
    },
    {
      "url": "https://github.com/your-team/team-practices",
      "type": "github",
      "name": "team-practices"
    }
  ]
}
```

With this setup, you can:
- Use `typescript-best-practices` to get from first matching source (official)
- Use `guideline@org-standards` to explicitly pick from org standards
- Mix and match skills from different sources in a single project

### Troubleshooting Remote Skills

#### Issue: Skill not found from remote source
**Solution**:
1. Verify the repository URL is correct: `instill sources`
2. Ensure the skill exists in the `/skills/` directory of the remote repository
3. Check internet connectivity
4. The skill may be named differently - use `instill init` to see available skills

#### Issue: Network timeout when fetching skills
**Solution**:
1. Check your internet connection
2. Verify the GitHub repository is accessible
3. Cached versions of skills will be used automatically as fallback
4. Check for service outages on GitHub's status page

#### Issue: "Remote source unavailable" warning
**Meaning**: The system is using a cached version of the skill because the remote source is unreachable.
**Solution**:
1. Check your internet connection
2. Verify the source URL is accessible
3. The cached version will be used until the remote source is available again
4. Cache expires after 7 days - run `instill cache-clear` to refresh

#### Issue: Cache is stale (more than 7 days old)
**Solution**:
```bash
# Clear cache for a specific skill
instill cache-clear -s skill-name

# Clear all cached skills
instill cache-clear
```

After clearing, the next `instill init` will fetch fresh copies from remote sources.

#### Issue: Want to use a local version of a remote skill
**Solution**:
Create the skill file locally in `.instill/library/[skill-name].md`. Local skills always take precedence over remote versions.

## 🛠️ Supported Targets

Instill automatically maps your skills to the following environments:

| **Target** | **Location** | **Integration Link** |
| --- | --- | --- |
| **Claude Code** | .claude/skills/ | [Guide](https://www.google.com/search?q=./docs/ide-integration/claude-code-skills-installation.md) |
| --- | --- | --- |
| **Cursor** | .cursor/rules/ | [Guide](https://www.google.com/search?q=./docs/ide-integration/cursor-skills-installation.md) |
| --- | --- | --- |
| **VS Code** | .vscode/tasks.json | [Guide](https://www.google.com/search?q=./docs/ide-integration/vscode-tasks-installation.md) |
| --- | --- | --- |
| **Antigravity** | .agent/skills/ | [Guide](https://www.google.com/search?q=./docs/ide-integration/antigravity-skills-installation.md) |
| --- | --- | --- |
| **Codex** | AGENTS.md | [Guide](https://www.google.com/search?q=./docs/ide-integration/codex-skills-installation.md) |
| --- | --- | --- |

## 🤝 Contributing & Community

We are building the standard for AI context management and we need your help!

- **Found a Bug?** [Open an issue](https://www.google.com/search?q=https://github.com/xblaster/instill/issues).
- **Have a Skill?** Contribute to the [official skills repo](https://github.com/xblaster/instill-skills).
- **Dev Setup**:  
    pnpm install  
    pnpm tsc  
    node dist/index.js init  
    

## 📜 License

Distributed under the MIT License. See LICENSE for more information.

Built with ❤️ by [@xblaster](https://github.com/xblaster)
