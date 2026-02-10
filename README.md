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
