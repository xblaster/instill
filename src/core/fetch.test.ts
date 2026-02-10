import { describe, it, expect, beforeEach, vi } from 'vitest';
import { convertGitHubUrlToRawUrl, fetchSkillFromRemote, listGitHubRepoFiles } from './fetch.js';
import type { RemoteSource } from './discovery.js';

// Mock the global fetch
global.fetch = vi.fn();

describe('fetch module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('convertGitHubUrlToRawUrl', () => {
    it('converts GitHub URL to raw content URL', () => {
      const url = 'https://github.com/user/repo';
      const filePath = 'skills/test.md';
      const result = convertGitHubUrlToRawUrl(url, filePath);
      expect(result).toBe(
        'https://raw.githubusercontent.com/user/repo/main/skills/test.md'
      );
    });

    it('handles URLs with trailing slash', () => {
      const url = 'https://github.com/user/repo/';
      const filePath = 'skills/test.md';
      const result = convertGitHubUrlToRawUrl(url, filePath);
      expect(result).toBe(
        'https://raw.githubusercontent.com/user/repo/main/skills/test.md'
      );
    });

    it('accepts custom branch', () => {
      const url = 'https://github.com/user/repo';
      const filePath = 'skills/test.md';
      const result = convertGitHubUrlToRawUrl(url, filePath, 'develop');
      expect(result).toBe(
        'https://raw.githubusercontent.com/user/repo/develop/skills/test.md'
      );
    });

    it('throws for invalid URL', () => {
      const url = 'https://gitlab.com/user/repo';
      expect(() => convertGitHubUrlToRawUrl(url, 'skills/test.md')).toThrow('Invalid GitHub URL');
    });
  });

  describe('fetchSkillFromRemote', () => {
    const source: RemoteSource = {
      url: 'https://github.com/user/repo',
      type: 'github',
      name: 'test-source',
    };

    it('fetches skill content from remote', async () => {
      const content = '# Test Skill';
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: vi.fn().mockResolvedValueOnce(content),
      } as any);

      const result = await fetchSkillFromRemote(source, 'test-skill');
      expect(result).toBe(content);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://raw.githubusercontent.com/user/repo/main/skills/test-skill.md',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'User-Agent': expect.any(String),
            'Accept': 'text/plain',
          }),
        })
      );
    });

    it('throws for 404 errors', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as any);

      await expect(fetchSkillFromRemote(source, 'nonexistent')).rejects.toThrow(
        /not found/i
      );
    });

    it('throws for other HTTP errors', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as any);

      await expect(fetchSkillFromRemote(source, 'test')).rejects.toThrow(
        /Failed to fetch/
      );
    });

    it('throws for network errors', async () => {
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchSkillFromRemote(source, 'test')).rejects.toThrow();
    });

    it('rejects non-github source types', async () => {
      const invalidSource: RemoteSource = {
        ...source,
        type: 'gitlab' as any,
      };

      await expect(fetchSkillFromRemote(invalidSource, 'test')).rejects.toThrow(
        /Unsupported source type/
      );
    });
  });

  describe('listGitHubRepoFiles', () => {
    const source: RemoteSource = {
      url: 'https://github.com/user/repo',
      type: 'github',
      name: 'test-source',
    };

    it('lists skill names from remote repository', async () => {
      const apiResponse = [
        { name: 'skill1.md', type: 'file' },
        { name: 'skill2.md', type: 'file' },
        { name: 'README.md', type: 'file' },
        { name: 'other.txt', type: 'file' },
        { name: 'subdir', type: 'dir' },
      ];

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: vi.fn().mockResolvedValueOnce(apiResponse),
      } as any);

      const result = await listGitHubRepoFiles(source);
      
      // Should filter for .md files and remove extension
      // Note: we usually want to filter out common non-skill files like README.md if they aren't skills
      // But the current implementation just takes all .md files.
      expect(result).toEqual(['skill1', 'skill2', 'README']);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/user/repo/contents/skills',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Accept': 'application/vnd.github.v3+json',
          }),
        })
      );
    });

    it('returns empty array if skills directory is not found (404)', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as any);

      const result = await listGitHubRepoFiles(source);
      expect(result).toEqual([]);
    });

    it('throws for rate limiting (403)', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
      } as any);

      await expect(listGitHubRepoFiles(source)).rejects.toThrow(/rate limit/i);
    });
  });
});
