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

  it('should copy skills to .gemini/context', async () => {
    const adapter = new GeminiAdapter();
    vi.mocked(commandr.readFile).mockResolvedValue('Skill Content');

    await adapter.installSkills(['skill1']);

    expect(commandr.ensureDir).toHaveBeenCalledWith('.gemini/context');
    expect(commandr.writeFile).toHaveBeenCalledWith(join('.gemini/context', 'skill1.md'), 'Skill Content');
  });

  it('should delete skills from .gemini/context', async () => {
    const adapter = new GeminiAdapter();

    await adapter.removeSkills(['skill1']);

    expect(commandr.deleteFile).toHaveBeenCalledWith(join('.gemini/context', 'skill1.md'));
  });
});