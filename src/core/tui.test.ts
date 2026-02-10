import { describe, it, expect, vi, beforeEach } from 'vitest';
import { selectSkills, selectTargets } from './tui.js';
import inquirer from 'inquirer';

vi.mock('inquirer', () => ({
  default: {
    prompt: vi.fn(),
  },
}));

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
});
