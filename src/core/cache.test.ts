import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getCachePath,
  ensureCacheDir,
  cacheSkill,
  getCachedSkill,
  isCacheValid,
  clearCache,
  getCacheMetadata,
} from './cache.js';
import { commandr } from '../commandr.js';

vi.mock('../commandr.js');

describe('cache module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  describe('getCachePath', () => {
    it('returns cache directory path', () => {
      const path = getCachePath();
      expect(path).toBe('.instill/.cache');
    });
  });

  describe('ensureCacheDir', () => {
    it('creates cache directory', async () => {
      vi.mocked(commandr.ensureDir).mockResolvedValueOnce(undefined);
      await ensureCacheDir();
      expect(vi.mocked(commandr.ensureDir)).toHaveBeenCalledWith('.instill/.cache/skills');
    });
  });

  describe('cacheSkill', () => {
    it('saves skill file and updates metadata', async () => {
      vi.mocked(commandr.ensureDir).mockResolvedValueOnce(undefined);
      vi.mocked(commandr.writeFile).mockResolvedValueOnce(undefined);
      vi.mocked(commandr.readFile).mockResolvedValueOnce('{}');

      const now = new Date().toISOString();
      await cacheSkill('test-skill', '# Test Skill', 'test-source');

      expect(vi.mocked(commandr.writeFile)).toHaveBeenCalledTimes(2);
      const calls = vi.mocked(commandr.writeFile).mock.calls;
      const skillWriteCall = calls[0];
      if (skillWriteCall) {
        expect(skillWriteCall[0]).toBe('.instill/.cache/skills/test-skill.md');
        expect(skillWriteCall[1]).toBe('# Test Skill');
      }
    });
  });

  describe('getCachedSkill', () => {
    it('returns cached skill content', async () => {
      const content = '# Cached Skill';
      vi.mocked(commandr.readFile).mockResolvedValueOnce(content);

      const result = await getCachedSkill('test-skill');
      expect(result).toBe(content);
      expect(vi.mocked(commandr.readFile)).toHaveBeenCalledWith(
        '.instill/.cache/skills/test-skill.md'
      );
    });

    it('returns null when skill not in cache', async () => {
      vi.mocked(commandr.readFile).mockRejectedValueOnce(new Error('Not found'));

      const result = await getCachedSkill('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('isCacheValid', () => {
    it('returns false when skill not in cache', async () => {
      vi.mocked(commandr.readFile).mockResolvedValueOnce('{}');

      const valid = await isCacheValid('nonexistent');
      expect(valid).toBe(false);
    });

    it('returns true for recently cached skill', async () => {
      const now = new Date();
      const metadata = {
        'test-skill': {
          source: 'test-source',
          fetchedAt: now.toISOString(),
        },
      };
      vi.mocked(commandr.readFile).mockResolvedValueOnce(JSON.stringify(metadata));

      const valid = await isCacheValid('test-skill', 7);
      expect(valid).toBe(true);
    });

    it('returns false for expired cache', async () => {
      const past = new Date();
      past.setDate(past.getDate() - 8); // 8 days ago
      const metadata = {
        'test-skill': {
          source: 'test-source',
          fetchedAt: past.toISOString(),
        },
      };
      vi.mocked(commandr.readFile).mockResolvedValueOnce(JSON.stringify(metadata));

      const valid = await isCacheValid('test-skill', 7);
      expect(valid).toBe(false);
    });
  });

  describe('clearCache', () => {
    it('clears all cache when no skill specified', async () => {
      vi.mocked(commandr.listDir).mockResolvedValueOnce(['skill1.md', 'skill2.md']);
      vi.mocked(commandr.deleteFile).mockResolvedValueOnce(undefined);
      vi.mocked(commandr.writeFile).mockResolvedValueOnce(undefined);
      vi.mocked(commandr.readFile).mockResolvedValueOnce('{}');

      await clearCache();

      expect(vi.mocked(commandr.deleteFile)).toHaveBeenCalledTimes(2);
      expect(vi.mocked(commandr.writeFile)).toHaveBeenCalledWith(
        '.instill/.cache/metadata.json',
        JSON.stringify({}, null, 2)
      );
    });

    it('clears specific skill cache', async () => {
      vi.mocked(commandr.deleteFile).mockResolvedValueOnce(undefined);
      vi.mocked(commandr.readFile).mockResolvedValueOnce('{"test-skill": {"source": "test"}}');
      vi.mocked(commandr.writeFile).mockResolvedValueOnce(undefined);

      await clearCache('test-skill');

      expect(vi.mocked(commandr.deleteFile)).toHaveBeenCalledWith(
        '.instill/.cache/skills/test-skill.md'
      );
    });
  });

  describe('getCacheMetadata', () => {
    it('returns cache metadata', async () => {
      vi.clearAllMocks();
      const metadata = {
        'skill1': { source: 'source1', fetchedAt: '2024-01-01T00:00:00Z' },
        'skill2': { source: 'source2', fetchedAt: '2024-01-02T00:00:00Z' },
      };
      vi.mocked(commandr.readFile).mockResolvedValueOnce(JSON.stringify(metadata));

      const result = await getCacheMetadata();
      expect(result).toEqual(metadata);
    });

    it('returns empty object when metadata not found', async () => {
      vi.clearAllMocks();
      vi.mocked(commandr.readFile).mockRejectedValueOnce(new Error('Not found'));

      const result = await getCacheMetadata();
      expect(result).toEqual({});
    });
  });
});
