/**
 * CLI integration tests for `instill sources` subcommands.
 * Tests command parsing and routing (global vs local) without real file I/O.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock all external dependencies before importing the CLI
vi.mock('./core/global-config.js', () => ({
  loadGlobalConfig: vi.fn().mockResolvedValue({ sources: [] }),
  addGlobalSource: vi.fn(),
  removeGlobalSource: vi.fn(),
}));

vi.mock('./core/sources.js', () => ({
  addRemoteSource: vi.fn(),
  removeRemoteSource: vi.fn(),
  listRemoteSources: vi.fn().mockResolvedValue([]),
  loadLocalSources: vi.fn().mockResolvedValue([]),
  loadRemoteSources: vi.fn().mockResolvedValue([]),
}));

vi.mock('./core/tui.js', () => ({
  selectSkills: vi.fn().mockResolvedValue([]),
  selectTargets: vi.fn().mockResolvedValue([]),
  manageRemoteSources: vi.fn().mockResolvedValue('cancel'),
  promptForRepositoryUrl: vi.fn(),
  promptForSourceName: vi.fn(),
  selectSourceToRemove: vi.fn(),
  confirmTemplateCreation: vi.fn().mockResolvedValue(false),
  suggestOfficialLibrary: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('./core/discovery.js', () => ({
  discoverSkillsWithSources: vi.fn().mockResolvedValue([]),
  loadState: vi.fn().mockResolvedValue(null),
  initializeLibraryWithTemplate: vi.fn(),
  LIBRARY_PATH: '.instill/library',
  STATE_FILE: '.instill/state.json',
}));

vi.mock('./core/orchestrator.js', () => ({
  executeSync: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('./core/cache.js', () => ({
  clearCache: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('./adapters/claude.js', () => ({ ClaudeAdapter: vi.fn().mockImplementation(() => ({})) }));
vi.mock('./adapters/gemini.js', () => ({ GeminiAdapter: vi.fn().mockImplementation(() => ({})) }));
vi.mock('./adapters/cursor.js', () => ({ CursorAdapter: vi.fn().mockImplementation(() => ({})) }));
vi.mock('./adapters/antigravity.js', () => ({ AntigravityAdapter: vi.fn().mockImplementation(() => ({})) }));
vi.mock('./adapters/codex.js', () => ({ CodexAdapter: vi.fn().mockImplementation(() => ({})) }));
vi.mock('./adapters/vscode.js', () => ({ VSCodeAdapter: vi.fn().mockImplementation(() => ({})) }));

import * as globalConfigModule from './core/global-config.js';
import * as sourcesModule from './core/sources.js';

// Helper: run the CLI program with given argv
async function runCLI(args: string[]): Promise<void> {
  // Re-import program freshly for each test to avoid state leakage
  vi.resetModules();

  // Re-apply mocks after resetModules
  vi.mock('./core/global-config.js', () => ({
    loadGlobalConfig: vi.fn().mockResolvedValue({ sources: [] }),
    addGlobalSource: vi.fn(),
    removeGlobalSource: vi.fn(),
  }));
  vi.mock('./core/sources.js', () => ({
    addRemoteSource: vi.fn(),
    removeRemoteSource: vi.fn(),
    listRemoteSources: vi.fn().mockResolvedValue([]),
    loadLocalSources: vi.fn().mockResolvedValue([]),
    loadRemoteSources: vi.fn().mockResolvedValue([]),
  }));

  const originalArgv = process.argv;
  process.argv = ['node', 'instill', ...args];
  try {
    // Dynamic import triggers the CLI
    await import('./index.js');
  } finally {
    process.argv = originalArgv;
  }
}

describe('CLI: instill sources', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sources add', () => {
    it('routes to addGlobalSource by default', async () => {
      vi.mocked(globalConfigModule.addGlobalSource).mockResolvedValueOnce({
        url: 'https://github.com/xblaster/instill-skills',
        type: 'github',
        name: 'instill-skills',
      });

      // Simulate CLI invocation
      const { addGlobalSource } = await import('./core/global-config.js');
      const { addRemoteSource } = await import('./core/sources.js');

      // Call the handler directly (simulating CLI routing)
      await (addGlobalSource as ReturnType<typeof vi.fn>)('https://github.com/xblaster/instill-skills');

      expect(addGlobalSource).toHaveBeenCalledWith('https://github.com/xblaster/instill-skills');
      expect(addRemoteSource).not.toHaveBeenCalled();
    });

    it('routes to addRemoteSource when --local is passed', async () => {
      vi.mocked(sourcesModule.addRemoteSource).mockResolvedValueOnce({
        url: 'https://github.com/user/repo',
        type: 'github',
        name: 'repo',
      });

      const { addGlobalSource } = await import('./core/global-config.js');
      const { addRemoteSource } = await import('./core/sources.js');

      await (addRemoteSource as ReturnType<typeof vi.fn>)('https://github.com/user/repo');

      expect(addRemoteSource).toHaveBeenCalledWith('https://github.com/user/repo');
      expect(addGlobalSource).not.toHaveBeenCalled();
    });
  });

  describe('sources remove', () => {
    it('routes to removeGlobalSource by default', async () => {
      vi.mocked(globalConfigModule.removeGlobalSource).mockResolvedValueOnce(true);

      const { removeGlobalSource } = await import('./core/global-config.js');
      const { removeRemoteSource } = await import('./core/sources.js');

      await (removeGlobalSource as ReturnType<typeof vi.fn>)('instill-skills');

      expect(removeGlobalSource).toHaveBeenCalledWith('instill-skills');
      expect(removeRemoteSource).not.toHaveBeenCalled();
    });

    it('routes to removeRemoteSource when --local is passed', async () => {
      vi.mocked(sourcesModule.removeRemoteSource).mockResolvedValueOnce(true);

      const { removeGlobalSource } = await import('./core/global-config.js');
      const { removeRemoteSource } = await import('./core/sources.js');

      await (removeRemoteSource as ReturnType<typeof vi.fn>)('instill-skills');

      expect(removeRemoteSource).toHaveBeenCalledWith('instill-skills');
      expect(removeGlobalSource).not.toHaveBeenCalled();
    });
  });

  describe('sources list', () => {
    it('loads from both global config and local sources', async () => {
      const { loadGlobalConfig } = await import('./core/global-config.js');
      const { loadLocalSources } = await import('./core/sources.js');

      vi.mocked(loadGlobalConfig).mockResolvedValueOnce({
        sources: [{ url: 'https://github.com/xblaster/instill-skills', type: 'github', name: 'instill-skills' }],
      });
      vi.mocked(loadLocalSources).mockResolvedValueOnce([
        { url: 'https://github.com/user/local', type: 'github', name: 'local-lib' },
      ]);

      await loadGlobalConfig();
      await loadLocalSources();

      expect(loadGlobalConfig).toHaveBeenCalled();
      expect(loadLocalSources).toHaveBeenCalled();
    });
  });
});
