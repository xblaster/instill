# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Instill** is a CLI-based "Package Manager for Context" that orchestrates skill files (Markdown-based coding standards and architectural patterns) across multiple AI assistants and IDEs.

**Core Concept**: Users define skills in `.instill/library/` or fetch from remote GitHub repositories, then use `instill init` to apply them to their AI tools (Claude Code, Cursor, VS Code, Gemini, etc.).

**Key Philosophy**: Local-first with remote support, state-aware, multi-target support, fully backward-compatible.

## Build & Development Commands

```bash
# Build TypeScript to JavaScript
pnpm build
# or
pnpm run build

# Run all tests
pnpm test
# or
pnpm vitest run

# Run specific test file
pnpm vitest run src/core/discovery.test.ts

# Run tests in watch mode
pnpm vitest

# Run integration tests
pnpm vitest run src/core/integration.test.ts
```

## Architecture Overview

### High-Level Flow

```
User runs: instill init
    ↓
[Discovery] → Find skills in local + remote sources
    ↓
[State] → Load previous state from .instill/state.json
    ↓
[TUI] → Interactive menu (select skills & targets)
    ↓
[Diff] → Calculate what changed
    ↓
[Orchestrator] → Use adapters to install/remove skills
    ↓
[State] → Save new state
```

### Core Modules

#### 1. **Discovery** (`src/core/discovery.ts`)
- Finds available skills from `.instill/library/` (local) and remote sources
- Returns list of skill names, preferring local over remote duplicates
- Handles both local files and remote GitHub repositories
- Related modules: `sources.ts`, `fetch.ts`, `cache.ts`

#### 2. **State Management** (`src/core/state.ts`, `src/core/discovery.ts`)
- Loads/saves `.instill/state.json` (project configuration)
- Tracks: installed_skills, active_targets, remote sources, last update timestamp
- Backward compatible: auto-upgrades old format by adding empty `sources` field
- Export: `loadState()`, `saveState()`

#### 3. **Orchestrator** (`src/core/orchestrator.ts`)
- Coordinates the sync operation
- Receives: user selections, previous state, adapter registry
- Calculates diff (what to add/remove/abandon)
- Calls adapters to apply changes, then saves new state

#### 4. **Diff Calculation** (`src/core/diff.ts`)
- Determines: `skillsToAdd`, `skillsToRemove`, `abandonedTargets`
- Abandoned targets: targets no longer selected by user
- Used to know what adapters to call and what to clean up

#### 5. **Adapters** (`src/adapters/`)
- Interface: `Adapter` with `installSkills()`, `removeSkills()`, `purgeAll()`
- Each adapter translates skills to target format:
  - **Claude Code**: Writes to `.claude/skills/`
  - **Cursor**: Writes to `.cursor/skills/` and `.cursor/rules/`
  - **VS Code**: Generates tasks in `.vscode/tasks.json`
  - **Gemini**: Writes to `.gemini/skills/`
  - **Antigravity**: Writes to `.agent/skills/`
  - **Codex**: Writes to `.agents/skills/` and `AGENTS.md`
- Adapters read skill content, transform to target format, write files

#### 6. **Remote Skills System** (v1.2.0+)
- **Sources** (`src/core/sources.ts`): Add/remove/list GitHub repositories in state
- **Fetch** (`src/core/fetch.ts`): Download skill files from GitHub raw URLs
- **Cache** (`src/core/cache.ts`): File-based cache in `.instill/.cache/` with 7-day TTL
- **Loader** (`src/core/loader.ts`): Unified skill loading with fallback chain: local → cache → remote
- Resolution order ensures local skills override remote, cache provides offline support

#### 7. **TUI** (`src/core/tui.ts`)
- Interactive prompts using Inquirer
- Allows users to: select skills, select targets, manage remote sources, clear cache
- Manages remote sources via `instill sources` command

### Data Flow During Install

1. **User runs** `instill init`
2. **Discovery** finds skills from `.instill/library/` + remote sources
3. **State loads** previous selections from `.instill/state.json`
4. **TUI prompts** user to select skills and targets (shows previous selections by default)
5. **Loader** reads selected skill files (tries local → cache → remote)
6. **Diff calculates** add/remove/abandon operations
7. **Orchestrator executes**:
   - For each selected target: adapter calls `installSkills()` (skill content + target name)
   - For abandoned targets: adapter calls `purgeAll()`
8. **Adapter** reads skill content, transforms to format (e.g., YAML for VS Code), writes to target location
9. **State saves** new installed_skills, active_targets, sources
10. **User done** - skills now available in their AI tools

### Key Patterns

#### Multi-Source Skills
- Users add GitHub repos via `instill sources` command
- Remote sources stored in `.instill/state.json` as: `{ url, type: "github", name }`
- During discovery, local skills checked first, then remote sources in order
- Duplicate skill names: local always wins
- Explicit selection: `skillName@source-name` loads from specific source

#### State Preservation
- State tracks both selected skills and their installation targets
- On re-run: unchecking a skill → adapter removes it from that target
- Unchecking a target → adapter purges all skills from it
- Sources preserved across runs (never wiped unless explicitly removed)

#### Adapter Pattern
- Each adapter implements same interface (install, remove, purge)
- Receives raw skill names and reads content itself via `commandr.readFile()`
- Each adapter knows how to format and install for its target
- New targets added by: creating new adapter implementing interface + registering in `src/index.ts`

## Testing

### Test Organization
- **Unit tests**: `src/core/*.test.ts`, `src/adapters/*.test.ts` (mock file I/O)
- **Integration tests**: `src/core/integration.test.ts` (23 tests validating multi-source workflows)
- Framework: Vitest with mocking via `vi.mock()`

### Key Test Files
- `discovery.test.ts`: Tests local skill discovery, state loading
- `sources.test.ts`: Tests add/remove/list remote sources, validation
- `cache.test.ts`: Tests caching, TTL, metadata
- `fetch.test.ts`: Tests GitHub URL conversion, fetch errors
- `integration.test.ts`: End-to-end workflows with multiple sources and cache

### Important: File I/O Mocking
- Tests mock `commandr.js` (abstraction for file I/O)
- Don't mock functions from `fs` directly; mock `commandr` instead
- Real file operations tested via `commandr` functions: `readFile()`, `writeFile()`, `listDir()`, `deleteFile()`, `ensureDir()`

## Important Constraints

### TypeScript & Strict Mode
- `strict: true` in tsconfig.json
- All code is strict mode TypeScript
- ES2020 target with ES modules (`.js` imports required)
- Use `.js` extensions in imports (e.g., `import { foo } from './bar.js'`)

### Backward Compatibility (CRITICAL)
- **v1.2.0 requirement**: Must remain 100% backward compatible with v1.1
- Old `.instill/state.json` (no `sources` field) must continue working
- Any new fields auto-added/upgraded transparently
- Don't break existing project workflows

### Remote Repository Structure
- Remote skill repos must follow: `skills/` directory with `.md` files
- Skill names: kebab-case (e.g., `typescript-best-practices.md`)
- Official repo: https://github.com/xblaster/instill-skills

### Adapter Implementation Notes
- `installSkills()` receives skill **names** (without `.md`), adapter loads content
- Adapter responsible for: reading skill file, transforming to target format, writing
- Use `commandr.readFile()` to load skill content
- Each adapter returns a class extending/implementing the `Adapter` interface

## Common Development Tasks

### Adding a New Adapter
1. Create `src/adapters/newtool.ts` implementing `Adapter` interface
2. Implement: `installSkills()`, `removeSkills()`, `purgeAll()`
3. Register in `src/index.ts` in the `registry` object
4. Add tests in `src/adapters/newtool.test.ts` (mock `commandr`)
5. The orchestrator automatically discovers and uses it

### Fixing Discovery Issues
- Start in `src/core/discovery.ts` for local discovery
- Check `src/core/sources.ts` for remote source loading
- Verify `src/core/fetch.ts` for GitHub URL handling
- Debug cache with `src/core/cache.ts` TTL validation
- Integration tests in `src/core/integration.test.ts` validate the chain

### Debugging Skill Installation
1. Trace starts in `orchestrator.ts` with `executeSync()`
2. Check diff calculation in `diff.ts`
3. Verify adapter is called (check registry in `index.ts`)
4. Adapter loads skill via loader, transforms content, writes file
5. State saved with new selections

### Working with Remote Skills
- Skills loaded via `loader.ts` with resolution: local → cache → remote
- Cache in `.instill/.cache/skills/` with metadata
- Fetch from GitHub raw URLs (converted from repo URL)
- TTL: 7 days default, enforced in `cache.ts`
- Warnings displayed when cache used (in `loader.ts`)

## Version & Release

- **Current Version**: 1.2.0 (supports remote skill libraries)
- **Package**: `@xblaster/instill` published to npm
- **Node Version**: ES2020 modules, Node 18+ compatible
- **Type Exports**: Includes `.d.ts` declaration files

## Documentation

- **README.md**: User guide, feature overview, installation
- **VISION.md**: Long-term project vision and philosophy
- **CHANGELOG.md**: Version history and feature notes
- **MIGRATION_GUIDE.md**: Upgrade guide for v1.1 → v1.2
- **docs/caching-guide.md**: Detailed caching behavior
- **docs/examples/state-json-examples.md**: Configuration patterns
- **docs/remote-repository-structure.md**: How to create skill repos

---

**Last Updated**: 2026-02-10 | **Version**: 1.2.0
