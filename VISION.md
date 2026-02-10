# Instill Vision

## Core Purpose

**Instill is a Package Manager for Context.**

Unlike traditional package managers (npm, pip, cargo) that fetch *libraries* from the internet, Instill fetches *context* in the form of "Skills"—Markdown files that encode coding standards, architectural patterns, security guidelines, and AI assistant instructions.

Instill bridges the gap between your project's knowledge library and the specific configuration formats required by different AI assistants and IDEs (Claude Code, Cursor, VS Code, Gemini, etc.).

---

## Core Principles

### 1. **Local First with Remote Support**
- Skills live locally in your project (`.instill/library/`)
- Remote GitHub repositories extend your library with shared, community-driven skills
- Local skills always take precedence (override remote versions)
- Works offline with cached remote content

### 2. **Multi-Source Library Design**
- Single project can blend skills from multiple sources:
  - Local project-specific skills
  - Remote official/curated skill libraries
  - Team/organizational skill repositories
- Skills are discovered and loaded transparently across all sources
- No dependency management or version conflicts—simplicity first

### 3. **Interactive First (TUI)**
- Primary user interface is an interactive checklist (`instill init`)
- Users see available skills, select which ones to apply
- Simple state management—remembers previous selections
- Supports adding/managing remote sources interactively via `instill sources`

### 4. **State-Aware**
- Project remembers what skills were installed and where
- `.instill/state.json` persists configuration across runs
- Clean updates and removals (unchecking a box removes the skill)
- Enables teams to share consistent skill configurations

### 5. **Assistant & IDE Agnostic**
- Output is adapter-based: Claude Code, Cursor, VS Code, Gemini, etc.
- Skills describe *intent* (coding standards, patterns); adapters translate to target format
- Adding a new AI tool = writing a new adapter, not changing core logic
- Multiple adapters can be active simultaneously for polyglot teams

### 6. **Content-Driven**
- Skills are just Markdown files—no compiled formats, no authentication required
- Remote libraries are simple GitHub repos with `/skills/` directory
- No central registry or package server
- Distributable, forkable, auditable

---

## Evolution & Roadmap

### Phase 1: Foundation (Complete ✅)
- Local skill library discovery and installation
- Basic state management
- Single adapter for Claude Code
- Simple TUI for skill selection

### Phase 2: Multi-Target Support (Complete ✅)
- Adapters for Cursor, VS Code, Gemini, Antigravity, Codex
- Simultaneous multi-IDE configuration
- Project-level and team-level skill coordination

### Phase 3: Remote Libraries (In Progress)
- **Support for GitHub skill repositories** (enables this vision fully)
- Remote source management via CLI
- Caching for performance and offline access
- Library resolution across local + remote sources
- Official `instill-skills` repository as reference implementation

### Phase 4: Community & Ecosystem (Future)
- Skill discovery and search
- Quality metrics and ratings
- Integration with community repositories
- Advanced caching and sync strategies
- Possibly: skill dependency resolution (if needed)

---

## Design Principles

1. **Simplicity Over Completeness**
   - Skills are Markdown, not code
   - State is JSON, not databases
   - No complex dependency management (yet)
   - Focus on 80% use cases

2. **Transparency & Auditability**
   - All configuration in `.instill/` (visible in git)
   - Remote skills cached locally and reviewable
   - Clear source attribution for each skill
   - Users understand what's being applied to their tools

3. **Backward Compatibility**
   - New features don't break existing projects
   - Local-only projects work unchanged
   - Can opt-in to remote sources incrementally
   - Migration is always optional

4. **User Agency**
   - No automatic installations or silent updates
   - Explicit choices via TUI
   - Users control what gets applied to each tool
   - Easy to disable, remove, or customize

---

## Strategic Goals

### Short Term
- ✅ Enable sharing of skills across projects via GitHub
- ✅ Support common development workflows (CLI, TUI, multiple targets)
- Build official `instill-skills` reference library
- Gather feedback from early users

### Medium Term
- Reduce friction in onboarding teams to shared standards
- Establish Instill as the de-facto standard for AI assistant configuration
- Build integrations with popular IDE extensions
- Publish curated skill collections for common stacks (React, FastAPI, etc.)

### Long Term
- Create a community-driven ecosystem of shareable skills
- Position Instill as the bridge between human expertise and AI assistants
- Enable organizations to encode and distribute their architectural knowledge globally

---

## Out of Scope (For Now)

- Semantic versioning or package version management
- Central package registry or marketplace (GitHub remains primary source)
- Authentication for private repositories
- Automatic skill dependency resolution
- Skill compilation or optimization
- Real-time sync or collaboration

These can be added if the community needs them, but we start simple.

---

## How This Vision Guides Development

**Every feature should answer**: *Does this help users better share, discover, and apply context to their AI assistants?*

- ✅ **Remote GitHub support**: Yes—enables sharing across teams and projects
- ✅ **Caching**: Yes—makes remote skills reliable and offline-accessible
- ✅ **Multi-target adapters**: Yes—one skill, many tools
- ✅ **TUI with state**: Yes—users understand and control their setup
- ❌ **Central registry**: Not needed yet—GitHub is sufficient and more flexible
- ❌ **Semantic versioning**: Not needed yet—simplicity > complexity

---

## Success Metrics

1. **Adoption**: Teams using Instill to share standards across projects
2. **Ecosystem**: Community-contributed skill libraries with quality content
3. **Integration**: Support for all major AI assistants and IDEs
4. **Usability**: New users can set up shared skills in <5 minutes
5. **Trust**: Skills are transparent, auditable, and version-controlled via git

---

*Last Updated: 2026-02-10*
*Vision steward: Instill Core Team*
