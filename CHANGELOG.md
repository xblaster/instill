# Changelog

All notable changes to Instill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-02-10

### Added
- **Remote Skill Library Support**: Fetch skills from GitHub repositories
  - Add/remove remote sources via `instill sources` command
  - Automatic caching of remote skills with 7-day TTL
  - Skill resolution order: local → cache → remote sources
  - Explicit source selection with `skillName@source` syntax
  - Support for multiple remote sources simultaneously

- **Caching System**
  - File-based cache in `.instill/.cache/` for performance and offline access
  - Cache metadata tracking (source, fetch timestamp)
  - TTL-based validation (default 7 days)
  - Automatic fallback to cache when remote sources unavailable
  - Manual cache management: `instill cache-clear`

- **Multi-Source Configuration**
  - Remote sources stored in `.instill/state.json`
  - Support for unlimited concurrent sources
  - Full backward compatibility with existing projects

- **Error Handling & Resilience**
  - Graceful fallback to cache on network failures
  - Clear warning messages when cache is used
  - Validation for malformed URLs and unreachable repositories
  - Comprehensive error messages for troubleshooting

- **Integration Testing**
  - 23 comprehensive integration tests for multi-source system
  - Tests validate official Instill Skills repository integration
  - Coverage for caching, error handling, and complete workflows

- **Documentation**
  - Enhanced README with multi-source library examples
  - Troubleshooting guide for remote source issues
  - 7 configuration pattern examples for different setups
  - Detailed caching behavior and TTL documentation
  - GitHub repository structure conventions guide

### Changed
- `loadSkill()` now searches across local, cache, and remote sources
- State file automatically extended with `sources` field for backward compatibility
- Improved skill loading performance with caching layer

### Fixed
- Network resilience: cached skills available even when sources unavailable
- State management: old format automatically upgraded to support sources

### Technical Details
- New modules: `src/core/sources.ts`, `src/core/cache.ts`, `src/core/fetch.ts`, `src/core/loader.ts`
- New module improvements in `src/core/discovery.ts` for multi-source discovery
- Warning system in loader for cache usage feedback

## [1.1.0] - Previously released

### Features
- Multi-target AI assistant support (Claude Code, Cursor, VS Code, etc.)
- Interactive TUI for skill selection and management
- State-aware installation tracking
- Adapter-based architecture for IDE/tool integration

---

## How to Use This Changelog

- **[Added]**: New features
- **[Changed]**: Changes in existing functionality
- **[Fixed]**: Bug fixes
- **[Removed]**: Removed features
- **[Deprecated]**: Soon-to-be removed features

## Future Releases

### Planned for v1.3.0
- [ ] Parallel fetching for multiple remote sources
- [ ] Progress indicators in TUI for remote skill discovery
- [ ] Configurable cache TTL per source
- [ ] GitLab and Gitea support (in addition to GitHub)
- [ ] Skill versioning and semantic version support
- [ ] Central skill registry (optional)

### Under Consideration
- [ ] Skill dependency resolution
- [ ] Private repository support with authentication
- [ ] Automatic skill updates
- [ ] Skill marketplace integration
- [ ] Performance profiling and optimization

---

Last Updated: 2026-02-10
