# Caching Guide: Remote Skills

This guide explains how Instill caches remote skills for improved performance and offline access.

## Overview

When you load a skill from a remote source, Instill automatically caches it locally in `.instill/.cache/` for:

- **Faster Access**: Subsequent loads use the cached copy instead of re-fetching from GitHub
- **Offline Availability**: Cached skills work even without internet connection
- **Reduced Network Calls**: Fewer requests to GitHub reduces latency and bandwidth

## Cache Structure

```
.instill/
├── library/               # Local skills (unchanged)
├── state.json            # Configuration with remote sources
└── .cache/
    ├── skills/
    │   ├── typescript-best-practices.md
    │   ├── react-patterns.md
    │   └── ... (other cached skills)
    └── metadata.json     # Cache metadata with timestamps
```

## Cache Metadata

The `metadata.json` file tracks cache information:

```json
{
  "typescript-best-practices": {
    "source": "official",
    "fetchedAt": "2024-02-10T12:00:00Z"
  },
  "react-patterns": {
    "source": "community",
    "fetchedAt": "2024-02-08T15:30:00Z"
  }
}
```

**Fields**:
- `source`: The remote source name (matches configured source names)
- `fetchedAt`: ISO 8601 timestamp of when the skill was cached

## Time-to-Live (TTL)

### Default TTL: 7 Days

By default, cached skills are considered valid for **7 days** from the fetch time.

After 7 days, the cache is considered stale and Instill will:
1. Attempt to fetch fresh copy from remote source
2. Fall back to stale cache if network is unavailable
3. Update the cache with new timestamp on success

### TTL Configuration

Currently, TTL is set to 7 days by default and cannot be customized per-skill or globally.

Future versions may support:
```json
// NOT YET SUPPORTED
{
  "sources": [
    {
      "url": "https://github.com/org/skills",
      "type": "github",
      "name": "org-skills",
      "cacheTtlDays": 14  // Custom TTL
    }
  ]
}
```

## Cache Behavior

### When Loading a Skill

The resolution order is:

1. **Local Library** (`.instill/library/`) - Always fastest
2. **Valid Cache** (age < 7 days) - Return immediately
3. **Fetch Remote** - If cache missing or stale
4. **Stale Cache Fallback** - If fetch fails

### Example Timeline

```
Day 1: Fetch 'typescript-best-practices' from 'official' source
       → Cache stored with timestamp 2024-02-01T10:00:00Z

Day 3: Load 'typescript-best-practices'
       → Cache valid (2 days old < 7 days)
       → Returned from cache (instant)

Day 8: Load 'typescript-best-practices'
       → Cache invalid (8 days old > 7 days)
       → Attempt to fetch fresh from 'official' source
       → Update cache with new timestamp

Day 8 (no network): Load 'typescript-best-practices'
       → Cache invalid but network unavailable
       → ⚠️ Using cached version: remote sources are unavailable
       → Returned from stale cache (with warning)
```

## Clearing Cache

### Clear All Cache

```bash
instill cache-clear
```

Removes all cached skills and clears metadata.

**When to use**:
- Free up disk space
- Refresh all skills from remote sources
- Troubleshoot cache-related issues

### Clear Specific Skill

```bash
instill cache-clear -s typescript-best-practices
```

Removes only the specified skill from cache.

**When to use**:
- Refresh a single skill without affecting others
- Remove a skill you no longer use
- Clear cache for a problematic skill

### Verify Cache

```bash
# List all cached skills with metadata
instill cache-status

# Or check manually
cat .instill/.cache/metadata.json
```

## Offline Access

### How It Works

1. Skills are cached automatically when first loaded
2. **No internet required** to use cached skills
3. Cached skills work indefinitely (even after 7-day TTL expires)
4. Fresh updates only available when internet is restored

### Example: Offline Workflow

```bash
# Day 1: Online - fetch skills from remote
instill init
# → Caches: typescript-best-practices, react-patterns, etc.

# Day 5: Offline - use cached skills
instill init
# → Uses cached skills (no network required)
# → All skills work perfectly

# Day 10: Back online
instill init
# → Fresh copies fetched for skills older than 7 days
# → New caches stored with updated timestamps
```

## Performance Characteristics

### Cache Hit (Valid Cache)

- **Time**: < 5ms (file I/O only)
- **Impact**: Instant skill loading
- **Use Case**: Development, frequent skill usage

### Cache Miss (Fetch from Remote)

- **Time**: 1-5 seconds (network + fetch)
- **Impact**: Noticeable delay on first load
- **Use Case**: Initial setup, manual refresh
- **Fallback**: Stale cache used if network fails

### Local Skill (No Cache)

- **Time**: < 5ms (file I/O only)
- **Impact**: Always instant
- **Use Case**: Project-specific skills

## Disk Space

### Cache Size

Typical cache sizes:
- Single skill: 5-50 KB
- 10 skills: 50-500 KB
- 100 skills: 500 KB - 5 MB

**Factors**:
- Skill content size (Markdown files)
- Number of cached skills
- Metadata overhead (minimal)

### Cleanup

Remove unused cached skills:

```bash
# See what's cached
ls -lh .instill/.cache/skills/

# Remove single cached skill
instill cache-clear -s old-skill-name

# Clear all cache
instill cache-clear
```

## Troubleshooting

### Cache Issues

#### Problem: Stale information is cached

**Solution**:
```bash
# Clear the specific skill
instill cache-clear -s skill-name

# Next load will fetch fresh copy
instill init
```

#### Problem: "Using cached version" warning

This appears when the remote source is unavailable but a cached copy exists.

**Solution**:
1. Check internet connection
2. Verify remote repository is accessible
3. Wait for remote source to become available
4. Run `instill cache-clear -s skill-name` to refresh when available

#### Problem: Cache taking too much disk space

```bash
# Clear all cache to free space
instill cache-clear

# Verify cleanup
du -sh .instill/.cache/
```

#### Problem: Skill not updating after push to remote

The cache prevents updates. Refresh manually:

```bash
# Clear the skill's cache
instill cache-clear -s skill-name

# Load fresh from remote
instill init
```

## Best Practices

### 1. Maintain Consistent Remote Sources

Keep your `.instill/state.json` sources stable. Frequently changing sources can make caching less effective.

### 2. Use Explicit Source Selection for Overrides

```bash
# Instead of relying on search order
skill-name@specific-source

# Guarantees consistent behavior
```

### 3. Clear Cache When Troubleshooting

If a skill behaves unexpectedly:

```bash
instill cache-clear -s problem-skill
instill init
```

### 4. Document Cache Dependencies

In team settings, document that:
- First `instill init` requires internet (caches skills)
- Subsequent runs work offline
- Cache invalidates after 7 days

### 5. Automate Cache Refresh in CI/CD

In continuous integration pipelines, refresh cache before building:

```bash
# CI/CD script
instill cache-clear
instill init
# Now all skills are fresh
```

## Advanced Topics

### Cache Invalidation Strategy

Current strategy:
- **Time-based**: Invalidate after 7 days
- **Source-based**: Different sources tracked separately
- **Name-based**: Same skill name from different sources cached separately

### Future Enhancements

Potential improvements:
- Configurable TTL per source
- Hash-based cache validation
- Automatic refresh on source changes
- Compression for large skill sets

## FAQ

**Q: Can I share cached skills between projects?**
A: Not recommended. Each project maintains its own cache to ensure independence.

**Q: Do I need to commit `.instill/.cache/` to git?**
A: No. Cache is regenerated automatically. Add to `.gitignore`:
```
.instill/.cache/
```

**Q: How do I know if a skill came from cache?**
A: Check metadata:
```bash
cat .instill/.cache/metadata.json | grep skill-name
```

**Q: Can cache expire if I work offline for extended periods?**
A: Yes, cache remains valid indefinitely offline. When you reconnect to internet, skills older than 7 days will be refreshed.

**Q: How do I ensure team members have fresh skills?**
A: Clear cache in CI/CD:
```bash
instill cache-clear
```

---

Last Updated: 2024-02-10
Document Version: 1.0
