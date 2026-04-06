import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { addRemoteSource, removeRemoteSource, listRemoteSources, loadRemoteSources, loadLocalSources } from './sources.js';
import * as discovery from './discovery.js';
import * as state from './state.js';
import * as globalConfig from './global-config.js';
import type { RemoteSource } from './discovery.js';

vi.mock('./discovery.js');
vi.mock('./state.js');
vi.mock('./global-config.js');

const emptyState = {
  last_updated: '2024-01-01T00:00:00Z',
  installed_skills: [] as string[],
  active_targets: [] as string[],
  sources: [] as RemoteSource[],
};

describe('sources module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: no global sources
    vi.mocked(globalConfig.loadGlobalConfig).mockResolvedValue({ sources: [] });
  });

  describe('loadRemoteSources (merged global + local)', () => {
    it('returns empty array when neither global nor local have sources', async () => {
      vi.mocked(discovery.loadState).mockResolvedValueOnce(null);
      const sources = await loadRemoteSources();
      expect(sources).toEqual([]);
    });

    it('returns local sources only when no global sources', async () => {
      const localSources = [
        { url: 'https://github.com/user/repo1', type: 'github' as const, name: 'repo1' },
      ];
      vi.mocked(discovery.loadState).mockResolvedValueOnce({ ...emptyState, sources: localSources });
      const sources = await loadRemoteSources();
      expect(sources).toEqual(localSources);
    });

    it('returns global sources when no local sources', async () => {
      const globalSources = [
        { url: 'https://github.com/xblaster/instill-skills', type: 'github' as const, name: 'instill-skills' },
      ];
      vi.mocked(globalConfig.loadGlobalConfig).mockResolvedValueOnce({ sources: globalSources });
      vi.mocked(discovery.loadState).mockResolvedValueOnce(null);
      const sources = await loadRemoteSources();
      expect(sources).toEqual(globalSources);
    });

    it('merges non-conflicting global and local sources', async () => {
      const globalSources = [
        { url: 'https://github.com/xblaster/instill-skills', type: 'github' as const, name: 'instill-skills' },
      ];
      const localSources = [
        { url: 'https://github.com/user/local-lib', type: 'github' as const, name: 'local-lib' },
      ];
      vi.mocked(globalConfig.loadGlobalConfig).mockResolvedValueOnce({ sources: globalSources });
      vi.mocked(discovery.loadState).mockResolvedValueOnce({ ...emptyState, sources: localSources });
      const sources = await loadRemoteSources();
      expect(sources).toHaveLength(2);
      expect(sources.map(s => s.name)).toContain('instill-skills');
      expect(sources.map(s => s.name)).toContain('local-lib');
    });

    it('local source wins over global source with same name', async () => {
      const globalSources = [
        { url: 'https://github.com/user/repo-global', type: 'github' as const, name: 'my-lib' },
      ];
      const localSources = [
        { url: 'https://github.com/user/repo-local', type: 'github' as const, name: 'my-lib' },
      ];
      vi.mocked(globalConfig.loadGlobalConfig).mockResolvedValueOnce({ sources: globalSources });
      vi.mocked(discovery.loadState).mockResolvedValueOnce({ ...emptyState, sources: localSources });
      const sources = await loadRemoteSources();
      expect(sources).toHaveLength(1);
      expect(sources[0]?.url).toBe('https://github.com/user/repo-local');
    });
  });

  describe('addRemoteSource', () => {
    it('validates GitHub URL format', async () => {
      vi.mocked(discovery.loadState).mockResolvedValue(null);

      await expect(addRemoteSource('https://gitlab.com/user/repo')).rejects.toThrow(
        'Invalid repository URL'
      );
    });

    it('accepts valid GitHub URLs', async () => {
      vi.mocked(discovery.loadState).mockResolvedValue({ ...emptyState });

      const source = await addRemoteSource('https://github.com/user/instill-skills');
      expect(source.url).toBe('https://github.com/user/instill-skills');
      expect(source.type).toBe('github');
      expect(source.name).toBe('instill-skills');
    });

    it('extracts name from URL when not provided', async () => {
      vi.mocked(discovery.loadState).mockResolvedValue({ ...emptyState });

      const source = await addRemoteSource('https://github.com/user/my-repo.git');
      expect(source.name).toBe('my-repo.git');
    });

    it('uses custom name when provided', async () => {
      vi.mocked(discovery.loadState).mockResolvedValue({ ...emptyState });

      const source = await addRemoteSource('https://github.com/user/repo', 'custom-name');
      expect(source.name).toBe('custom-name');
    });

    it('rejects duplicate source names', async () => {
      const existingSources = [
        { url: 'https://github.com/user/repo1', type: 'github' as const, name: 'repo1' },
      ];
      vi.mocked(discovery.loadState).mockResolvedValue({ ...emptyState, sources: existingSources });

      await expect(addRemoteSource('https://github.com/user/repo2', 'repo1')).rejects.toThrow(
        'already exists'
      );
    });
  });

  describe('removeRemoteSource', () => {
    it('returns false when source not found', async () => {
      vi.mocked(discovery.loadState).mockResolvedValue({ ...emptyState });

      const removed = await removeRemoteSource('nonexistent');
      expect(removed).toBe(false);
    });

    it('removes source by name', async () => {
      const sources = [
        { url: 'https://github.com/user/repo1', type: 'github' as const, name: 'repo1' },
        { url: 'https://github.com/user/repo2', type: 'github' as const, name: 'repo2' },
      ];
      vi.mocked(discovery.loadState).mockResolvedValue({ ...emptyState, sources });

      const removed = await removeRemoteSource('repo1');
      expect(removed).toBe(true);
      // Check that saveState was called with only repo2
      const calls = vi.mocked(state.saveState).mock.calls;
      expect(calls.length).toBeGreaterThan(0);
      const callArgs = calls[0];
      if (callArgs && callArgs[2]) {
        const savedSources = callArgs[2] as RemoteSource[];
        expect(savedSources.length).toBe(1);
        expect(savedSources[0]?.name).toBe('repo2');
      }
    });
  });

  describe('listRemoteSources', () => {
    it('returns merged global + local sources', async () => {
      const globalSources = [
        { url: 'https://github.com/xblaster/instill-skills', type: 'github' as const, name: 'instill-skills' },
      ];
      const localSources = [
        { url: 'https://github.com/user/local-lib', type: 'github' as const, name: 'local-lib' },
      ];
      vi.mocked(globalConfig.loadGlobalConfig).mockResolvedValueOnce({ sources: globalSources });
      vi.mocked(discovery.loadState).mockResolvedValueOnce({ ...emptyState, sources: localSources });

      const sources = await listRemoteSources();
      expect(sources).toHaveLength(2);
    });
  });

  describe('loadLocalSources', () => {
    it('returns only project-local sources without global merge', async () => {
      const localSources = [
        { url: 'https://github.com/user/repo', type: 'github' as const, name: 'repo' },
      ];
      vi.mocked(discovery.loadState).mockResolvedValueOnce({ ...emptyState, sources: localSources });

      const sources = await loadLocalSources();
      expect(sources).toEqual(localSources);
      expect(globalConfig.loadGlobalConfig).not.toHaveBeenCalled();
    });
  });
});
