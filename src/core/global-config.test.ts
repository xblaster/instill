import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loadGlobalConfig,
  saveGlobalConfig,
  addGlobalSource,
  removeGlobalSource,
  GLOBAL_CONFIG_DIR,
  GLOBAL_CONFIG_FILE,
} from './global-config.js';
import * as commandrModule from '../commandr.js';

vi.mock('../commandr.js', () => ({
  commandr: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
    ensureDir: vi.fn(),
  },
}));

const { commandr } = commandrModule;

describe('global-config module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadGlobalConfig', () => {
    it('returns sources from valid config file', async () => {
      const sources = [{ url: 'https://github.com/user/repo', type: 'github' as const, name: 'repo' }];
      vi.mocked(commandr.readFile).mockResolvedValueOnce(JSON.stringify({ sources }));

      const config = await loadGlobalConfig();
      expect(config.sources).toEqual(sources);
    });

    it('returns empty sources when file does not exist', async () => {
      vi.mocked(commandr.readFile).mockRejectedValueOnce(new Error('ENOENT'));

      const config = await loadGlobalConfig();
      expect(config.sources).toEqual([]);
    });

    it('returns empty sources and warns when file is malformed', async () => {
      vi.mocked(commandr.readFile).mockResolvedValueOnce('not valid json{{{');
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const config = await loadGlobalConfig();
      expect(config.sources).toEqual([]);
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('malformed'));

      warnSpy.mockRestore();
    });

    it('returns empty sources array when sources field missing', async () => {
      vi.mocked(commandr.readFile).mockResolvedValueOnce(JSON.stringify({}));

      const config = await loadGlobalConfig();
      expect(config.sources).toEqual([]);
    });
  });

  describe('saveGlobalConfig', () => {
    it('ensures directory exists before writing', async () => {
      vi.mocked(commandr.ensureDir).mockResolvedValueOnce(undefined);
      vi.mocked(commandr.writeFile).mockResolvedValueOnce(undefined);

      await saveGlobalConfig({ sources: [] });

      expect(commandr.ensureDir).toHaveBeenCalledWith(GLOBAL_CONFIG_DIR);
      expect(commandr.writeFile).toHaveBeenCalledWith(
        GLOBAL_CONFIG_FILE,
        expect.stringContaining('"sources"')
      );
    });
  });

  describe('addGlobalSource', () => {
    it('adds a valid GitHub source', async () => {
      vi.mocked(commandr.readFile).mockResolvedValueOnce(JSON.stringify({ sources: [] }));
      vi.mocked(commandr.ensureDir).mockResolvedValueOnce(undefined);
      vi.mocked(commandr.writeFile).mockResolvedValueOnce(undefined);

      const source = await addGlobalSource('https://github.com/xblaster/instill-skills');
      expect(source.name).toBe('instill-skills');
      expect(source.url).toBe('https://github.com/xblaster/instill-skills');
      expect(source.type).toBe('github');
    });

    it('uses provided name when given', async () => {
      vi.mocked(commandr.readFile).mockResolvedValueOnce(JSON.stringify({ sources: [] }));
      vi.mocked(commandr.ensureDir).mockResolvedValueOnce(undefined);
      vi.mocked(commandr.writeFile).mockResolvedValueOnce(undefined);

      const source = await addGlobalSource('https://github.com/xblaster/instill-skills', 'my-lib');
      expect(source.name).toBe('my-lib');
    });

    it('rejects invalid URL', async () => {
      await expect(addGlobalSource('https://gitlab.com/user/repo')).rejects.toThrow(
        'Invalid repository URL'
      );
    });

    it('rejects duplicate source name', async () => {
      const existing = [{ url: 'https://github.com/user/repo', type: 'github' as const, name: 'repo' }];
      vi.mocked(commandr.readFile).mockResolvedValueOnce(JSON.stringify({ sources: existing }));

      await expect(addGlobalSource('https://github.com/user/repo')).rejects.toThrow(
        'already exists'
      );
    });
  });

  describe('removeGlobalSource', () => {
    it('removes an existing source and returns true', async () => {
      const sources = [{ url: 'https://github.com/user/repo', type: 'github' as const, name: 'repo' }];
      vi.mocked(commandr.readFile).mockResolvedValueOnce(JSON.stringify({ sources }));
      vi.mocked(commandr.ensureDir).mockResolvedValueOnce(undefined);
      vi.mocked(commandr.writeFile).mockResolvedValueOnce(undefined);

      const result = await removeGlobalSource('repo');
      expect(result).toBe(true);

      const written = vi.mocked(commandr.writeFile).mock.calls[0][1] as string;
      expect(JSON.parse(written).sources).toEqual([]);
    });

    it('returns false when source not found', async () => {
      vi.mocked(commandr.readFile).mockResolvedValueOnce(JSON.stringify({ sources: [] }));

      const result = await removeGlobalSource('nonexistent');
      expect(result).toBe(false);
    });
  });
});
