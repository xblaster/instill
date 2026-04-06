import { describe, it, expect, vi, beforeEach } from 'vitest';
import { selectSkills, selectTargets, suggestOfficialLibrary } from './tui.js';
import inquirer from 'inquirer';

vi.mock('inquirer', () => ({
  default: {
    prompt: vi.fn(),
  },
}));

vi.mock('./global-config.js', () => ({
  loadGlobalConfig: vi.fn().mockResolvedValue({ sources: [] }),
  addGlobalSource: vi.fn(),
}));

vi.mock('./sources.js', () => ({
  loadLocalSources: vi.fn().mockResolvedValue([]),
}));

import * as globalConfigModule from './global-config.js';
import * as sourcesModule from './sources.js';

const OFFICIAL_URL = 'https://github.com/xblaster/instill-skills';

describe('TUI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('selectSkills', () => {
    it('should return selected skills from prompt', async () => {
      vi.mocked(inquirer.prompt).mockResolvedValue({ selected: ['skill1'] });
      
      const available = [
        { name: 'skill1', source: 'local' },
        { name: 'skill2', source: 'local' },
      ];
      const result = await selectSkills(available, ['skill2']);
      
      expect(result).toEqual(['skill1']);
      expect(inquirer.prompt).toHaveBeenCalledWith([
        expect.objectContaining({
          type: 'checkbox',
          choices: [
            expect.objectContaining({ value: 'skill1', checked: false }),
            expect.objectContaining({ value: 'skill2', checked: true }),
          ],
        }),
      ]);
    });
  });

  describe('selectTargets', () => {
    it('should return selected targets from prompt', async () => {
      vi.mocked(inquirer.prompt).mockResolvedValue({ selected: ['gemini'] });

      const result = await selectTargets(['claude-code']);

      expect(result).toEqual(['gemini']);
      expect(inquirer.prompt).toHaveBeenCalledWith([
        expect.objectContaining({
          type: 'checkbox',
          choices: expect.arrayContaining([
            expect.objectContaining({ value: 'claude-code', checked: true }),
            expect.objectContaining({ value: 'gemini', checked: false }),
          ]),
        }),
      ]);
    });
  });

  describe('suggestOfficialLibrary', () => {
    it('does not prompt when official library is already in global config', async () => {
      vi.mocked(globalConfigModule.loadGlobalConfig).mockResolvedValueOnce({
        sources: [{ url: OFFICIAL_URL, type: 'github', name: 'instill-skills' }],
      });

      await suggestOfficialLibrary();

      expect(inquirer.prompt).not.toHaveBeenCalled();
    });

    it('does not prompt when official library is already in local state', async () => {
      vi.mocked(sourcesModule.loadLocalSources).mockResolvedValueOnce([
        { url: OFFICIAL_URL, type: 'github', name: 'instill-skills' },
      ]);

      await suggestOfficialLibrary();

      expect(inquirer.prompt).not.toHaveBeenCalled();
    });

    it('prompts when official library is absent from both global and local', async () => {
      vi.mocked(inquirer.prompt).mockResolvedValueOnce({ confirm: false } as never);

      await suggestOfficialLibrary();

      expect(inquirer.prompt).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ type: 'confirm' }),
        ])
      );
    });

    it('prompts when other sources exist but official library is absent', async () => {
      vi.mocked(globalConfigModule.loadGlobalConfig).mockResolvedValueOnce({
        sources: [{ url: 'https://github.com/other/repo', type: 'github', name: 'other' }],
      });
      vi.mocked(inquirer.prompt).mockResolvedValueOnce({ confirm: false } as never);

      await suggestOfficialLibrary();

      expect(inquirer.prompt).toHaveBeenCalled();
    });

    it('adds official library to global config when user accepts', async () => {
      vi.mocked(inquirer.prompt).mockResolvedValueOnce({ confirm: true } as never);
      vi.mocked(globalConfigModule.addGlobalSource).mockResolvedValueOnce({
        url: OFFICIAL_URL,
        type: 'github',
        name: 'instill-skills',
      });

      await suggestOfficialLibrary();

      expect(globalConfigModule.addGlobalSource).toHaveBeenCalledWith(OFFICIAL_URL);
    });

    it('does not add source when user declines', async () => {
      vi.mocked(inquirer.prompt).mockResolvedValueOnce({ confirm: false } as never);

      await suggestOfficialLibrary();

      expect(globalConfigModule.addGlobalSource).not.toHaveBeenCalled();
    });
  });
});
