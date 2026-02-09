# Instill 🚀

**Instill** is a CLI-based "Package Manager for Context." Unlike traditional package managers that fetch libraries from the internet, Instill orchestrates local knowledge files ("Skills").

It acts as a bridge between your library of skills (Markdown files defining coding standards, architectural patterns, etc.) and the specific configuration formats required by various AI assistants (Claude Code, Gemini, Cursor, VS Code, etc.).

## 🎯 Core Philosophy

- **Local First with Remote Support**: Skills are simple Markdown files stored locally in your project, with optional support for remote GitHub repositories.
- **Interactive (TUI)**: Primary interface is a checklist menu invoked via `instill init`.
- **State-Aware**: Remembers what was installed previously to handle clean updates and removals (unchecking a box deletes the file from the target).
- **Agnostic**: Support for multiple targets (IDEs/Agents) simultaneously.
- **Multi-Source**: Seamlessly blend local and remote skill libraries from GitHub.

## 📦 Installation

Install Instill globally from the `@xblaster` registry:

```bash
pnpm add -g @xblaster/instill
# or
npm install -g @xblaster/instill
```

## 🚀 Quick Start

1. **Initialize your Library**: Create a `.instill/library/` directory in your project root and add your skill Markdown files (e.g., `typescript-expert.md`).
2. **Run Instill**:
   ```bash
   instill init
   ```
3. **Select Skills & Targets**: Use the interactive menu to choose which skills to apply to which AI tools.

## 🌐 Remote Skill Libraries

Instill now supports fetching skills from remote GitHub repositories, allowing you to share and reuse skill libraries across teams and projects.

### Managing Remote Sources

Add, remove, and view remote skill repositories using the dedicated command:

```bash
instill sources
```

This opens an interactive menu where you can:
- **Add Remote Source**: Specify a GitHub repository URL (e.g., `https://github.com/user/instill-skills`)
- **Remove Remote Source**: Delete a configured remote repository
- **View Configured Sources**: List all remote repositories currently enabled

### Example Remote Repository Structure

A typical remote skill library on GitHub should have this structure:

```
your-instill-skills/
├── skills/
│   ├── typescript-best-practices.md
│   ├── react-patterns.md
│   └── security-audit.md
├── README.md
└── LICENSE
```

### Configuration

Remote sources are stored in `.instill/state.json`:

```json
{
  "last_updated": "2024-02-14T12:00:00Z",
  "installed_skills": ["typescript-expert", "react-patterns"],
  "active_targets": ["claude-code"],
  "sources": [
    {
      "url": "https://github.com/user/instill-skills",
      "type": "github",
      "name": "user-skills"
    },
    {
      "url": "https://github.com/org/enterprise-skills",
      "type": "github",
      "name": "enterprise-skills"
    }
  ]
}
```

### Caching & Performance

Remote skills are automatically cached locally in `.instill/.cache/` for:
- Faster subsequent access
- Offline skill availability
- Reduced network requests

Cache files expire after 7 days by default. Clear the cache manually:

```bash
# Clear all cached skills
instill cache-clear

# Clear cache for a specific skill
instill cache-clear -s skill-name
```

### Skill Resolution Order

When loading a skill, Instill searches in this order:

1. **Local Library** (`.instill/library/`)
2. **Cache** (if valid)
3. **Remote Sources** (in configured order)

Local skills always take precedence, allowing you to override remote versions locally.

### Explicit Source Selection

To load a skill from a specific remote source:

```bash
# Use skillName@sourceName syntax in skill selection
my-skill@enterprise-skills
```

## 🛠️ Supported Targets

- **Claude Code**: Skills in `.claude/skills/`, commands in `.claude/commands/`. [Installation Guide](./docs/ide-integration/claude-code-skills-installation.md)
- **Cursor**: Skills in `.cursor/skills/`, rules in `.cursor/rules/`. [Installation Guide](./docs/ide-integration/cursor-skills-installation.md)
- **VS Code**: Tasks in `.vscode/tasks.json`, extensions for capabilities. [Installation Guide](./docs/ide-integration/vscode-tasks-installation.md)
- **Antigravity**: Skills in `.agent/skills/`. [Installation Guide](./docs/ide-integration/antigravity-skills-installation.md)
- **Codex**: Skills in `.agents/skills/`, agent instructions in `AGENTS.md`. [Installation Guide](./docs/ide-integration/codex-skills-installation.md)
- **Cross-Platform**: Universal `.agent/skills/` standard. [Installation Guide](./docs/ide-integration/cross-platform-skills-guide.md)

**[📚 Master IDE Integration Guide](./docs/ide-integration/master-installation-guide.md)** - Comprehensive guide covering all IDEs

## 👩‍💻 Local Development

If you want to contribute or run Instill from source:

### Prerequisites
- [Node.js](https://nodejs.org/) (Latest LTS)
- [pnpm](https://pnpm.io/)

### Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Build the project:
   ```bash
   pnpm tsc
   ```
4. Run locally:
   ```bash
   node dist/index.js init
   ```

### Running Tests
We use `vitest` for unit testing:
```bash
pnpm vitest run
```

---
Built with ❤️ by [@xblaster](https://github.com/xblaster)
