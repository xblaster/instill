import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GeminiAdapter } from './gemini.js';
import { commandr } from '../commandr.js';
import { join } from 'node:path';

vi.mock('../commandr.js', () => ({
  commandr: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
    deleteFile: vi.fn(),
    ensureDir: vi.fn(),
    listDir: vi.fn(),
  },
}));

describe('GeminiAdapter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should copy skills to .gemini/skills', async () => {
    const adapter = new GeminiAdapter();
    vi.mocked(commandr.readFile).mockResolvedValue('Skill Content');

    await adapter.installSkills(['skill1']);

    expect(commandr.ensureDir).toHaveBeenCalledWith('.gemini/skills');
    expect(commandr.ensureDir).toHaveBeenCalledWith(join('.gemini/skills', 'skill1'));
    expect(commandr.writeFile).toHaveBeenCalledWith(join('.gemini/skills', 'skill1', 'SKILL.md'), 'Skill Content');
  });

  it('should delete skills from .gemini/skills', async () => {
    const adapter = new GeminiAdapter();

    await adapter.removeSkills(['skill1']);

    expect(commandr.deleteFile).toHaveBeenCalledWith(join('.gemini/skills', 'skill1', 'SKILL.md'));
  });
});