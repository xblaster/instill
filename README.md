# Instill 🚀

[![npm version](https://img.shields.io/npm/v/@xblaster/instill.svg)](https://www.npmjs.com/package/@xblaster/instill)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

<p align="center">
  <img src="logo.png" width="200" alt="Instill Logo">
</p>

<p align="center">
  <strong>The CLI-based "Package Manager for AI Context"</strong>
</p>

**Instill** orchestrates your project "Skills" and deploys them to the specific formats required by **Claude, Cursor, VS Code, Gemini**, and more. Stop manually syncing coding standards, architectural rules, and prompts across different AI tools.

```bash
# Get started in 30 seconds
pnpm add -g @xblaster/instill
instill sources add https://github.com/xblaster/instill-skills
instill install dependency-sentinel git-master
```

---

## 📖 Table of Contents

- [Why Instill?](#-why-instill)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Remote Skill Libraries](#-remote-skill-libraries)
  - [Official Repository](#official-skill-repository)
  - [Managing Sources](#managing-remote-sources)
  - [Configuration & Caching](#configuration)
- [Troubleshooting](#-troubleshooting-remote-skills)
- [Supported Targets](#-supported-targets)
- [Contributing & Community](#-contributing--community)

---

## 🎯 Why Instill?

Traditional package managers fetch code; Instill fetches **knowledge**. It acts as the bridge between your library of Markdown-based skills and the fragmented configuration files of modern AI agents.

- **Single Source of Truth**: Define a skill once in Markdown; use it everywhere.
- **Zero Friction**: Interactive TUI for selecting and installing skills.
- **Team Alignment**: Sync remote skill libraries from GitHub across your entire organization.
- **State-Aware**: Automatically cleans up removed skills and handles updates.

## 📦 Installation

Install Instill globally via your preferred package manager:

```bash
pnpm add -g @xblaster/instill
# or
npm install -g @xblaster/instill
```

## 🚀 2-Minute Quick Start

1.  **Create your Library**  
    Create a `.instill/library/` directory in your project root and drop in a Markdown file (e.g., `typescript-expert.md`).
2.  **Launch the Orchestrator**  
    ```bash
    instill init
    ```
    *Alternatively, add a remote source and install skills directly:*
    ```bash
    instill sources add https://github.com/xblaster/instill-skills
    instill install dependency-sentinel git-master
    ```
3.  **Sync**  
    Select your skills and target AI tools (e.g., Cursor, Claude Code) from the interactive menu. Instill handles the file placement and formatting.

## 🌐 Remote Skill Libraries

Instill supports fetching skills from remote GitHub repositories, allowing you to share and reuse skill libraries across teams and projects.

### Official Skill Repository

The official Instill skills repository is the primary source of curated, production-ready skills maintained by the Instill team.

**Repository**: [https://github.com/xblaster/instill-skills](https://github.com/xblaster/instill-skills)

Add it to your project:

```bash
instill sources add https://github.com/xblaster/instill-skills
```

### Managing Remote Sources

Add, remove, and view remote skill repositories using the dedicated command:

```bash
instill sources
```

This opens an interactive menu. You can also use non-interactive commands:

- **Add Remote Source**:
  ```bash
  instill sources add <url> [name]
  ```
- **Remove Remote Source**:
  ```bash
  instill sources remove <name>
  ```
- **List Remote Sources**:
  ```bash
  instill sources list
  ```

### Installing Skills Directly

You can install skills directly without the interactive menu:

```bash
instill install <skill-name1> [skill-name2...]
```

If no target environments have been configured yet, you will be prompted to select them.

### Example Remote Repository Structure

A typical remote skill library on GitHub should have this structure:

```text
your-instill-skills/
├── skills/
│   ├── typescript-best-practices.md
│   ├── react-patterns.md
│   └── security-audit.md
├── README.md
└── LICENSE
```

### Configuration

Remote sources are stored in `.instill/state.json`. You can configure multiple sources, and Instill will search them in order.

```json
{
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
    }
  ]
}
```

### Caching & Performance

Remote skills are automatically cached locally in `.instill/.cache/` for faster access and offline availability. Cache files expire after **7 days** by default.

```bash
# Clear all cached skills
instill cache-clear

# Clear cache for a specific skill
instill cache-clear -s skill-name
```

### Skill Resolution Order

When loading a skill, Instill searches in this order:

1. **Local Library** (`.instill/library/`) - *Always takes precedence*
2. **Cache** (if valid)
3. **Remote Sources** (in configured order)

To load a skill from a specific remote source explicitly, use the syntax: `skillName@sourceName`.

## ❓ Troubleshooting Remote Skills

<details>
<summary><strong>Skill not found from remote source</strong></summary>

1. Verify the repository URL is correct using `instill sources`.
2. Ensure the skill exists in the `/skills/` directory of the remote repository.
3. Check internet connectivity.
4. The skill may be named differently - use `instill init` to see available skills.
</details>

<details>
<summary><strong>Network timeout when fetching skills</strong></summary>

1. Check your internet connection.
2. Verify the GitHub repository is accessible.
3. Check for service outages on GitHub's status page.
   *(Note: Cached versions of skills will be used automatically as a fallback)*
</details>

<details>
<summary><strong>"Remote source unavailable" warning</strong></summary>

This means the system is using a cached version of the skill because the remote source is unreachable.
1. Check your internet connection and source URL accessibility.
2. Cache expires after 7 days - run `instill cache-clear` to refresh when connectivity is restored.
</details>

<details>
<summary><strong>Cache is stale (more than 7 days old)</strong></summary>

Run the clear command to force a refresh on the next `init`:
```bash
instill cache-clear
```
</details>

<details>
<summary><strong>Want to use a local version of a remote skill?</strong></summary>

Simply create the skill file locally in `.instill/library/[skill-name].md`. Local skills always take precedence over remote versions.
</details>

## 🛠️ Supported Targets

Instill automatically maps your skills to the following environments:

| Target | Location | Documentation |
|--------|----------|---------------|
| **Claude Code** | `.claude/skills/`, `.claude/commands/` | [Installation Guide](./docs/ide-integration/claude-code-skills-installation.md) |
| **Gemini** | `.gemini/skills/` | [Installation Guide](./docs/ide-integration/gemini-skills-installation.md) |
| **Cursor** | `.cursor/skills/`, `.cursor/rules/` | [Installation Guide](./docs/ide-integration/cursor-skills-installation.md) |
| **VS Code** | `.vscode/tasks.json` | [Installation Guide](./docs/ide-integration/vscode-tasks-installation.md) |
| **Antigravity** | `.agent/skills/` | [Installation Guide](./docs/ide-integration/antigravity-skills-installation.md) |
| **Codex** | `.agents/skills/`, `AGENTS.md` | [Installation Guide](./docs/ide-integration/codex-skills-installation.md) |
| **Cross-Platform** | `.agent/skills/` | [Guide](./docs/ide-integration/cross-platform-skills-guide.md) |

**[📚 Master IDE Integration Guide](./docs/ide-integration/master-installation-guide.md)** - Comprehensive guide covering all IDEs

## 🤝 Contributing & Community

We are building the standard for AI context management and we need your help!

- **Found a Bug?** [Open an issue](https://github.com/xblaster/instill/issues).
- **Have a Skill?** Contribute to the [official skills repo](https://github.com/xblaster/instill-skills).
- **Dev Setup**:
  ```bash
  pnpm install
  pnpm tsc
  node dist/index.js init
  ```

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---
<p align="center">
  Built with ❤️ by <a href="https://github.com/xblaster">@xblaster</a>
</p>