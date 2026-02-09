# Instill 🚀

**Instill** is a CLI-based "Package Manager for Context." Unlike traditional package managers that fetch libraries from the internet, Instill orchestrates local knowledge files ("Skills").

It acts as a bridge between your library of skills (Markdown files defining coding standards, architectural patterns, etc.) and the specific configuration formats required by various AI assistants (Claude Code, Gemini, Cursor, VS Code, etc.).

## 🎯 Core Philosophy

- **Local First**: No remote repositories. Skills are simple Markdown files stored locally in your project.
- **Interactive (TUI)**: Primary interface is a checklist menu invoked via `instill init`.
- **State-Aware**: Remembers what was installed previously to handle clean updates and removals (unchecking a box deletes the file from the target).
- **Agnostic**: Support for multiple targets (IDEs/Agents) simultaneously.

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
