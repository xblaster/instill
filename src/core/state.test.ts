import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveState } from './state.js';
import { commandr } from '../commandr.js';
import { STATE_FILE } from './discovery.js';

vi.mock('../commandr.js', () => ({
  commandr: {
    ensureDir: vi.fn(),
    writeFile: vi.fn(),
  },
}));

describe('State Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-02-14T12:00:00Z'));
  });

  it('should save the state with current timestamp', async () => {
    const skills = ['skill1'];
    const targets = ['claude'];
    
    await saveState(skills, targets);
    
    expect(commandr.ensureDir).toHaveBeenCalledWith('.instill');
    expect(commandr.writeFile).toHaveBeenCalledWith(
      STATE_FILE,
      JSON.stringify({
        last_updated: '2024-02-14T12:00:00.000Z',
        installed_skills: skills,
        active_targets: targets,
      }, null, 2)
    );
  });
});
