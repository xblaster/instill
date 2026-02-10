import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setWarningsEnabled, discoverRemoteSkills } from './loader.js';
import { loadRemoteSources } from './sources.js';
import {
  getCachedSkillList,
  cacheSkillList,
  isSkillListCacheValid,
} from './cache.js';
import { listGitHubRepoFiles } from './fetch.js';
import type { RemoteSource } from './discovery.js';

vi.mock('./sources.js');
vi.mock('./cache.js');
vi.mock('./fetch.js');

describe('loader module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    // Disable warnings during tests
    setWarningsEnabled(false);
  });

  describe('discoverRemoteSkills', () => {
    it('returns empty array when no remote sources configured', async () => {
      vi.mocked(loadRemoteSources).mockResolvedValueOnce([]);

      const result = await discoverRemoteSkills();

      expect(result).toEqual([]);
      expect(vi.mocked(listGitHubRepoFiles)).not.toHaveBeenCalled();
    });

    it('discovers skills from single remote source', async () => {
      const source: RemoteSource = {
        url: 'https://github.com/user/repo',
        type: 'github',
        name: 'test-source',
      };

      vi.mocked(loadRemoteSources).mockResolvedValueOnce([source]);
      vi.mocked(isSkillListCacheValid).mockResolvedValueOnce(false);
      vi.mocked(getCachedSkillList).mockResolvedValueOnce(null);
      vi.mocked(listGitHubRepoFiles).mockResolvedValueOnce([
        'skill1',
        'skill2',
        'skill3',
      ]);
      vi.mocked(cacheSkillList).mockResolvedValueOnce(undefined);

      const result = await discoverRemoteSkills();

      expect(result).toEqual([
        { name: 'skill1', source: source },
        { name: 'skill2', source: source },
        { name: 'skill3', source: source },
      ]);
      expect(vi.mocked(listGitHubRepoFiles)).toHaveBeenCalledWith(source);
      expect(vi.mocked(cacheSkillList)).toHaveBeenCalledWith('test-source', [
        'skill1',
        'skill2',
        'skill3',
      ]);
    });

    it('uses cached list if valid', async () => {
      const source: RemoteSource = {
        url: 'https://github.com/user/repo',
        type: 'github',
        name: 'cached-source',
      };

      vi.mocked(loadRemoteSources).mockResolvedValueOnce([source]);
      vi.mocked(isSkillListCacheValid).mockResolvedValueOnce(true);
      vi.mocked(getCachedSkillList).mockResolvedValueOnce(['cached-skill']);

      const result = await discoverRemoteSkills();

      expect(result).toEqual([{ name: 'cached-skill', source: source }]);
      expect(vi.mocked(listGitHubRepoFiles)).not.toHaveBeenCalled();
    });
  });
});
