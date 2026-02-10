# Migration Guide: Instill 1.1 → 1.2

Version 1.2 introduces support for remote skill libraries from GitHub. This guide helps you upgrade and leverage new features.

## TL;DR

**Good news**: Instill 1.2 is 100% backward compatible. No changes required.

**To enable remote skills**:
```bash
npm update @xblaster/instill  # or pnpm update
instill sources                 # Add a remote source
instill init                    # Discover and install remote skills
```

## What's New

### 1. Remote Skill Libraries
Fetch skills from GitHub repositories instead of local-only.

**Before (1.1)**:
```
.instill/library/
├── typescript-guru.md
└── security-checklist.md
```

**After (1.2)**:
```
.instill/library/        # Local skills (still works)
├── typescript-guru.md
└── custom-rules.md

.instill/state.json      # Now includes remote sources
{
  "sources": [
    {
      "url": "https://github.com/xblaster/instill-skills",
      "type": "github",
      "name": "official"
    }
  ]
}
```

### 2. Automatic Caching
Remote skills are cached locally for offline access and performance.

```
.instill/.cache/
├── skills/
│   ├── typescript-best-practices.md
│   └── react-patterns.md
└── metadata.json
```

### 3. Multi-Source Support
Use skills from multiple repositories simultaneously.

## Upgrade Process

### Step 1: Update Instill

```bash
# Using npm
npm install -g @xblaster/instill@latest

# Using pnpm
pnpm add -g @xblaster/instill@latest
```

### Step 2: Verify Installation

```bash
instill --version
# Should show: 1.2.0 or higher
```

### Step 3: Check Existing Setup

No changes needed! Your existing setup continues to work:

```bash
cd your-project
instill init

# You'll see the same skills as before
# Nothing has changed in behavior
```

### Step 4: (Optional) Add Remote Sources

If you want to use remote skill libraries:

```bash
instill sources
# Select: Add a new source
# Enter: https://github.com/xblaster/instill-skills
```

Then discover available skills:

```bash
instill init
# You'll now see both local and remote skills
```

## Backward Compatibility

### 1. Local Skills Still Work

Projects using `.instill/library/` continue working unchanged.

**Before**:
```json
{
  "installed_skills": ["typescript-guru"],
  "active_targets": ["claude-code"]
}
```

**After** (auto-upgraded):
```json
{
  "installed_skills": ["typescript-guru"],
  "active_targets": ["claude-code"],
  "sources": []  // Added automatically
}
```

### 2. No API Changes

All existing functions and commands work exactly as before.

```bash
# All these still work the same way
instill init
instill sources  # NEW command - optional
```

### 3. `.gitignore` Unchanged

The `.instill/.cache/` directory is automatically excluded from git.

```
# No need to update .gitignore
# Cache is already ignored by design
```

## Migration Scenarios

### Scenario 1: Single Developer (Local Skills Only)

**Action**: Nothing needed!

```bash
# Keep using as before
instill init
# Select from your local `.instill/library/` skills
```

### Scenario 2: Team with Shared Standards

**Action**: Add your organization's skill repository

```bash
instill sources
# Add: https://github.com/your-org/your-skills

instill init
# Now see both local and organization skills
```

### Scenario 3: Multiple Teams/Projects

**Action**: Add multiple sources

```bash
instill sources
# Add: https://github.com/company/engineering-standards
# Add: https://github.com/team-a/practices
# Add: https://github.com/xblaster/instill-skills
```

## Troubleshooting Migration

### Issue: "sources" field missing from state.json

**Cause**: Updated from 1.1 to 1.2

**Solution**: Run `instill init` once to auto-upgrade:
```bash
instill init
# The sources field will be added automatically
```

### Issue: Old cached skills not available

**Cause**: Cache format changed between versions

**Solution**: Clear and rebuild cache:
```bash
instill cache-clear
instill init
# New cache will be created
```

### Issue: Git conflicts in `.instill/state.json`

**Cause**: Team members on different versions

**Solution**: Ensure everyone is on 1.2+:
```bash
npm install -g @xblaster/instill@latest
```

Then resolve conflicts (manual merge if needed).

## Performance Impact

### Positive Changes
- ✅ Faster skill loading (cached copies used first)
- ✅ Offline capability for cached skills
- ✅ Reduced network requests

### No Degradation
- ⚠️ First remote skill fetch: 1-5 seconds (one time per skill)
- ⚠️ Large projects (100+ skills): cache size ~5MB

## What to Communicate to Your Team

### For Individual Contributors

```
✅ No action needed - everything works as before
✅ New feature available: add organization skills
❓ Questions? See: https://github.com/xblaster/instill#remote-skill-libraries
```

### For Team Leads

```
✅ Backward compatible - existing projects unaffected
✅ Optional - remote skills adoption is gradual
✅ Benefits:
   - Share organization-wide standards
   - Centralize skill management
   - Enable offline development

📚 Documentation: See README and docs/caching-guide.md
```

## Rollback (If Needed)

If you need to downgrade back to 1.1:

```bash
npm install -g @xblaster/instill@1.1.0

# Reset your state.json (optional)
rm .instill/state.json
```

**Note**: Your local skills in `.instill/library/` are never affected.

## Next Steps

### 1. Update Everyone
Coordinate team upgrade to 1.2+

### 2. Optionally Add Remote Sources
```bash
# Share organization skill repository
instill sources
# Add your organization's GitHub repository
```

### 3. Enjoy New Features
- 🚀 Multi-source skill management
- 📦 Organization-wide standards
- 🔌 Offline skill availability

## FAQ

**Q: Do I have to use remote skills?**
A: No! Local skills work exactly as before. Remote skills are optional.

**Q: Will my local skills be deleted?**
A: No. `.instill/library/` is never modified by Instill.

**Q: Can I disable remote skills if I don't want them?**
A: Yes. Just don't add any sources in `instill sources`.

**Q: How do I move skills from local to remote?**
A: Create a GitHub repository, copy skills to `/skills/`, and add it as a source.

**Q: What if a remote repository goes offline?**
A: Cached copies continue to work. A warning message appears but skills still load.

**Q: Can I use private repositories?**
A: Not yet. Private repository support is planned for v1.3+.

**Q: How do I update cached skills?**
A: Run `instill cache-clear -s skill-name` then `instill init` to fetch fresh.

## Support

For issues or questions:
- 📖 **Documentation**: See README and docs/
- 🐛 **Bug Reports**: https://github.com/xblaster/instill/issues
- 💬 **Discussions**: https://github.com/xblaster/instill/discussions

---

**Version**: 1.2.0
**Date**: 2026-02-10
**Compatibility**: ✅ 100% backward compatible with 1.1.x
