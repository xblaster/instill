import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ClaudeAdapter } from './claude.js';
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

describe('ClaudeAdapter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should copy skills to .claude/skills', async () => {
    const adapter = new ClaudeAdapter();
    vi.mocked(commandr.readFile).mockResolvedValue('Skill Content');

    await adapter.installSkills(['skill1']);

    expect(commandr.ensureDir).toHaveBeenCalledWith('.claude/skills');
    expect(commandr.ensureDir).toHaveBeenCalledWith(join('.claude/skills', 'skill1'));
    expect(commandr.writeFile).toHaveBeenCalledWith(join('.claude/skills', 'skill1', 'SKILL.md'), 'Skill Content');
  });

  it('should delete skills from .claude/skills', async () => {
    const adapter = new ClaudeAdapter();

    await adapter.removeSkills(['skill1']);

    expect(commandr.deleteFile).toHaveBeenCalledWith(join('.claude/skills', 'skill1', 'SKILL.md'));
  });
});
