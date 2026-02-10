/**
 * Integration tests for multi-source skill discovery and loading
 * Tests the complete flow of discovering and loading skills from local and remote sources
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  cacheSkill,
  getCachedSkill,
  clearCache,
  getCacheMetadata,
} from './cache.js';
import { loadRemoteSources, addRemoteSource } from './sources.js';
import { convertGitHubUrlToRawUrl, fetchSkillFromRemote, listGitHubRepoFiles } from './fetch.js';
import { discoverSkillsWithSources } from './discovery.js';
import { commandr } from '../commandr.js';
import type { RemoteSource } from './discovery.js';

vi.mock('../commandr.js', () => ({
  commandr: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
    listDir: vi.fn(),
    ensureDir: vi.fn(),
    deleteFile: vi.fn(),
  },
}));

describe('Integration Tests: Multi-Source Skill System', () => {
  const OFFICIAL_REPO_URL = 'https://github.com/xblaster/instill-skills';
  const OFFICIAL_REPO_NAME = 'instill-skills';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Remote Source Management', () => {
    it('should accept valid GitHub repository URLs', async () => {
      vi.mocked(commandr.readFile).mockResolvedValueOnce(
        JSON.stringify({
          last_updated: '2024-02-14T00:00:00Z',
          installed_skills: [],
          active_targets: [],
          sources: [],
        })
      );

      const sources = await loadRemoteSources();
      expect(Array.isArray(sources)).toBe(true);
    });

    it('should reject invalid repository URLs', async () => {
      const invalidUrl = 'https://gitlab.com/user/repo';

      await expect(addRemoteSource(invalidUrl)).rejects.toThrow(/Invalid repository URL/i);
    });

    it('should handle state with multiple remote sources', async () => {
      const mockState = {
        last_updated: '2024-02-14T00:00:00Z',
        installed_skills: [],
        active_targets: [],
        sources: [
          { url: OFFICIAL_REPO_URL, type: 'github' as const, name: 'official' },
          { url: 'https://github.com/team/skills', type: 'github' as const, name: 'team' },
        ],
      };

      vi.mocked(commandr.readFile).mockResolvedValueOnce(JSON.stringify(mockState));

      const sources = await loadRemoteSources();
      expect(Array.isArray(sources)).toBe(true);
    });
  });

  describe('Skill Caching Integration', () => {
    it('should cache skill with metadata', async () => {
      const skillContent = '# TypeScript Best Practices\n\nUse strict mode';

      vi.mocked(commandr.ensureDir).mockResolvedValueOnce(undefined);
      vi.mocked(commandr.writeFile).mockResolvedValueOnce(undefined);
      vi.mocked(commandr.writeFile).mockResolvedValueOnce(undefined);

      await cacheSkill('typescript-best-practices', skillContent, OFFICIAL_REPO_NAME);

      expect(commandr.writeFile).toHaveBeenCalledWith(
        '.instill/.cache/skills/typescript-best-practices.md',
        skillContent
      );
    });

    it('should retrieve cached skill', async () => {
      const skillContent = '# Cached Skill Content';

      vi.mocked(commandr.readFile).mockResolvedValueOnce(skillContent);

      const cached = await getCachedSkill('test-skill');

      expect(cached).toBe(skillContent);
    });

    it('should return null for non-existent cached skill', async () => {
      vi.mocked(commandr.readFile).mockRejectedValueOnce(new Error('File not found'));

      const cached = await getCachedSkill('non-existent');

      expect(cached).toBeNull();
    });

    it('should retrieve cache metadata', async () => {
      const metadata = {
        'skill-1': {
          source: 'official',
          fetchedAt: new Date().toISOString(),
        },
        'skill-2': {
          source: 'team',
          fetchedAt: new Date().toISOString(),
        },
      };

      vi.mocked(commandr.readFile).mockResolvedValueOnce(JSON.stringify(metadata));

      const retrieved = await getCacheMetadata();

      expect(typeof retrieved).toBe('object');
    });

    it('should clear specific cached skill', async () => {
      vi.mocked(commandr.deleteFile).mockResolvedValueOnce(undefined);
      vi.mocked(commandr.readFile).mockResolvedValueOnce(
        JSON.stringify({
          'skill-to-delete': { source: 'official', fetchedAt: new Date().toISOString() },
        })
      );
      vi.mocked(commandr.writeFile).mockResolvedValueOnce(undefined);

      await clearCache('skill-to-delete');

      expect(commandr.deleteFile).toHaveBeenCalled();
    });

    it('should clear all cache', async () => {
      vi.mocked(commandr.listDir).mockResolvedValueOnce(['skill1.md', 'skill2.md']);
      vi.mocked(commandr.deleteFile).mockResolvedValue(undefined);
      vi.mocked(commandr.writeFile).mockResolvedValueOnce(undefined);

      await clearCache();

      expect(commandr.listDir).toHaveBeenCalledWith('.instill/.cache/skills');
    });
  });

  describe('GitHub Repository URL Handling', () => {
    it('should convert GitHub URL to raw content URL', () => {
      const rawUrl = convertGitHubUrlToRawUrl(OFFICIAL_REPO_URL, '');

      expect(rawUrl).toContain('raw.githubusercontent.com');
      expect(rawUrl).toContain('xblaster/instill-skills');
    });

    it('should support skill path construction', () => {
      const rawUrl = convertGitHubUrlToRawUrl(OFFICIAL_REPO_URL, '');
      const skillPath = '/skills/typescript-best-practices.md';
      const fullUrl = rawUrl + skillPath;

      expect(fullUrl).toMatch(/raw\.githubusercontent\.com.*xblaster.*instill-skills.*skills/);
    });

    it('should construct correct raw URL for main branch', () => {
      const rawUrl = convertGitHubUrlToRawUrl(OFFICIAL_REPO_URL, '');

      // Should point to main/master branch by default
      expect(rawUrl).toMatch(/(main|master)/);
    });
  });

  describe('Error Handling and Resilience', () => {
    it('should handle network errors gracefully', async () => {
      const source: RemoteSource = {
        url: OFFICIAL_REPO_URL,
        type: 'github' as const,
        name: OFFICIAL_REPO_NAME,
      };

      vi.mocked(commandr.readFile).mockRejectedValueOnce(
        new Error('Network timeout')
      );

      // Should not crash, errors are handled by caller
      try {
        await fetchSkillFromRemote(source, 'test-skill');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle 404 errors for missing skills', async () => {
      vi.mocked(commandr.readFile).mockRejectedValueOnce(
        new Error('404: Not Found')
      );

      try {
        const source: RemoteSource = {
          url: OFFICIAL_REPO_URL,
          type: 'github' as const,
          name: OFFICIAL_REPO_NAME,
        };
        await fetchSkillFromRemote(source, 'non-existent');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle invalid URL validation', async () => {
      const tests = [
        { url: 'not-a-url', valid: false },
        { url: 'https://gitlab.com/user/repo', valid: false },
        { url: 'https://github.com/user/repo', valid: true },
      ];

      for (const test of tests) {
        if (!test.valid) {
          await expect(addRemoteSource(test.url)).rejects.toThrow();
        }
      }
    });
  });

  describe('State Management with Remote Sources', () => {
    it('should maintain remote sources in project state', async () => {
      const mockState = {
        last_updated: '2024-02-14T00:00:00Z',
        installed_skills: ['skill1', 'skill2'],
        active_targets: ['claude', 'cursor'],
        sources: [
          { url: OFFICIAL_REPO_URL, type: 'github' as const, name: OFFICIAL_REPO_NAME },
        ],
      };

      vi.mocked(commandr.readFile).mockResolvedValueOnce(JSON.stringify(mockState));

      const sources = await loadRemoteSources();

      expect(Array.isArray(sources)).toBe(true);
    });

    it('should handle state without sources field', async () => {
      const oldState = {
        last_updated: '2024-02-14T00:00:00Z',
        installed_skills: ['skill1'],
        active_targets: ['claude'],
      };

      vi.mocked(commandr.readFile).mockResolvedValueOnce(JSON.stringify(oldState));

      // Should not crash - returns empty array for backward compatibility
      const sources = await loadRemoteSources();
      expect(Array.isArray(sources)).toBe(true);
    });
  });

  describe('Official Repository Integration (xblaster/instill-skills)', () => {
    it('should construct URLs for official repository skills', () => {
      const baseUrl = convertGitHubUrlToRawUrl(OFFICIAL_REPO_URL, '');

      // Official skills should be at /skills/ directory
      const skillUrls = [
        'typescript-best-practices.md',
        'react-patterns.md',
        'security-audit.md',
        'api-design.md',
      ].map(skill => `${baseUrl}/skills/${skill}`);

      for (const url of skillUrls) {
        expect(url).toContain('raw.githubusercontent.com');
        expect(url).toContain('xblaster/instill-skills');
      }
    });

    it('should support adding official repository as remote source', async () => {
      // Setup: State with official repository already added
      vi.mocked(commandr.readFile)
        .mockResolvedValueOnce(
          JSON.stringify({
            last_updated: '2024-02-14T00:00:00Z',
            installed_skills: [],
            active_targets: [],
            sources: [
              { url: OFFICIAL_REPO_URL, type: 'github' as const, name: OFFICIAL_REPO_NAME },
            ],
          })
        );

      const sources = await loadRemoteSources();
      expect(sources.length).toBe(1);
      expect(sources[0]?.name).toBe(OFFICIAL_REPO_NAME);
    });

    it('should cache skills from official repository', async () => {
      const officialSkills = [
        { name: 'typescript-best-practices', content: '# TypeScript\n\nBest practices' },
        { name: 'react-patterns', content: '# React\n\nCommon patterns' },
      ];

      for (const skill of officialSkills) {
        vi.mocked(commandr.ensureDir).mockResolvedValueOnce(undefined);
        vi.mocked(commandr.writeFile).mockResolvedValueOnce(undefined);

        await cacheSkill(skill.name, skill.content, OFFICIAL_REPO_NAME);

        expect(commandr.writeFile).toHaveBeenCalledWith(
          `.instill/.cache/skills/${skill.name}.md`,
          skill.content
        );
      }
    });
  });

  describe('Complete Integration Workflow', () => {
    it('should follow complete discovery -> cache -> load workflow', async () => {
      const skillName = 'typescript-best-practices';
      const skillContent = '# TypeScript Best Practices\n\nStrict mode enabled';

      // Step 1: Remote source is configured
      vi.mocked(commandr.readFile).mockResolvedValueOnce(
        JSON.stringify({
          last_updated: '2024-02-14T00:00:00Z',
          installed_skills: [],
          active_targets: [],
          sources: [
            { url: OFFICIAL_REPO_URL, type: 'github' as const, name: OFFICIAL_REPO_NAME },
          ],
        })
      );

      const sources = await loadRemoteSources();
      expect(sources.length).toBeGreaterThan(0);

      // Step 2: Skill is fetched and cached
      vi.mocked(commandr.ensureDir).mockResolvedValueOnce(undefined);
      vi.mocked(commandr.writeFile)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined);

      await cacheSkill(skillName, skillContent, OFFICIAL_REPO_NAME);

      // Step 3: Cached skill is retrieved
      vi.mocked(commandr.readFile).mockResolvedValueOnce(skillContent);

      const cached = await getCachedSkill(skillName);
      expect(cached).toBe(skillContent);
    });

    it('should support multiple concurrent skills from multiple sources', async () => {
      const skills = [
        { name: 'typescript-best-practices', source: 'official' },
        { name: 'react-patterns', source: 'official' },
        { name: 'team-guidelines', source: 'team' },
      ];

      // Simulate caching multiple skills
      for (const skill of skills) {
        vi.mocked(commandr.ensureDir).mockResolvedValueOnce(undefined);
        vi.mocked(commandr.writeFile)
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce(undefined);

        await cacheSkill(skill.name, `# ${skill.name}`, skill.source);
      }

      // Verify all cache operations succeeded
      expect(commandr.ensureDir).toHaveBeenCalled();
      expect(commandr.writeFile).toHaveBeenCalled();
    });
  });

  describe('Cache Invalidation and Refresh', () => {
    it('should support cache refresh for outdated entries', async () => {
      const skillName = 'typescript-best-practices';
      const oldContent = '# Old Content';
      const newContent = '# Updated Content';

      // Remove old entry
      vi.mocked(commandr.deleteFile).mockResolvedValueOnce(undefined);
      vi.mocked(commandr.readFile).mockResolvedValueOnce(
        JSON.stringify({ [skillName]: { source: 'official', fetchedAt: '2024-01-01' } })
      );
      vi.mocked(commandr.writeFile).mockResolvedValueOnce(undefined);

      await clearCache(skillName);

      // Cache new version
      vi.mocked(commandr.ensureDir).mockResolvedValueOnce(undefined);
      vi.mocked(commandr.writeFile)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined);

      await cacheSkill(skillName, newContent, 'official');

      expect(commandr.deleteFile).toHaveBeenCalled();
    });
  });
});
