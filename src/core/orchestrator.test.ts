import { describe, it, expect, vi, beforeEach } from 'vitest';
import { executeSync } from './orchestrator.js';
import * as state from './state.js';

vi.mock('./state.js', () => ({
  saveState: vi.fn(),
}));

describe('Orchestrator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should invoke adapter methods and save state', async () => {
    const mockAdapter: any = {
      installSkills: vi.fn(),
      removeSkills: vi.fn(),
      purgeAll: vi.fn(),
    };

    const registry = { 'claude': mockAdapter };
    const selectedSkills = ['skill1'];
    const selectedTargets = ['claude'];
    const previousSkills = ['skill2'];
    const previousTargets = ['claude', 'gemini'];

    // Note: we need a mock adapter for gemini too if it's abandoned
    const mockGeminiAdapter: any = {
      purgeAll: vi.fn(),
    };
    (registry as any)['gemini'] = mockGeminiAdapter;

    await executeSync(selectedSkills, selectedTargets, previousSkills, previousTargets, registry);

    expect(mockAdapter.removeSkills).toHaveBeenCalledWith(['skill2']);
    expect(mockAdapter.installSkills).toHaveBeenCalledWith(['skill1']);
    expect(mockGeminiAdapter.purgeAll).toHaveBeenCalled();
    expect(state.saveState).toHaveBeenCalledWith(selectedSkills, selectedTargets);
  });
});
