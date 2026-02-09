import { describe, it, expect, vi, beforeEach } from 'vitest';
import { discoverSkills, loadState, LIBRARY_PATH, STATE_FILE } from './discovery.js';
import { commandr } from '../commandr.js';

vi.mock('../commandr.js', () => ({
  commandr: {
    listDir: vi.fn(),
    readFile: vi.fn(),
  },
}));

describe('Discovery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('discoverSkills', () => {
    it('should return a list of skill names without extension', async () => {
      vi.mocked(commandr.listDir).mockResolvedValue(['skill1.md', 'skill2.md', 'not-a-skill.txt']);
      
      const skills = await discoverSkills();
      
      expect(commandr.listDir).toHaveBeenCalledWith(LIBRARY_PATH);
      expect(skills).toEqual(['skill1', 'skill2']);
    });

    it('should return empty array if directory listing fails', async () => {
      vi.mocked(commandr.listDir).mockRejectedValue(new Error('Folder not found'));
      
      const skills = await discoverSkills();
      
      expect(skills).toEqual([]);
    });
  });

  describe('loadState', () => {
    it('should return parsed state if file exists', async () => {
      const mockState = {
        last_updated: '2024-02-14',
        installed_skills: ['skill1'],
        active_targets: ['gemini'],
      };
      vi.mocked(commandr.readFile).mockResolvedValue(JSON.stringify(mockState));
      
      const state = await loadState();
      
      expect(commandr.readFile).toHaveBeenCalledWith(STATE_FILE);
      expect(state).toEqual(mockState);
    });

    it('should return null if state file reading fails', async () => {
      vi.mocked(commandr.readFile).mockRejectedValue(new Error('No state'));
      
      const state = await loadState();
      
      expect(state).toBeNull();
    });
  });
});
