import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ClaudeAdapter } from './claude.js';
import { commandr } from '../commandr.js';

vi.mock('../commandr.js', () => ({
  commandr: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
  },
}));

describe('ClaudeAdapter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should inject skills into CLAUDE.md with markers', async () => {
    const adapter = new ClaudeAdapter();
    vi.mocked(commandr.readFile).mockImplementation(async (path) => {
      if (path.includes('skill1.md')) return 'Skill 1 Logic';
      if (path === 'CLAUDE.md') return 'User content here';
      throw new Error('Not found');
    });

    await adapter.installSkills(['skill1']);

    expect(commandr.writeFile).toHaveBeenCalledWith(
      'CLAUDE.md',
      expect.stringContaining('<!-- INSTILL_START -->')
    );
    expect(commandr.writeFile).toHaveBeenCalledWith(
      'CLAUDE.md',
      expect.stringContaining('Skill 1 Logic')
    );
  });

  it('should remove the managed block on purgeAll', async () => {
    const adapter = new ClaudeAdapter();
    vi.mocked(commandr.readFile).mockResolvedValue(`Header
<!-- INSTILL_START -->
Trash
<!-- INSTILL_END -->
Footer`);

    await adapter.purgeAll();

    expect(commandr.writeFile).toHaveBeenCalledWith('CLAUDE.md', 'Header\nFooter');
  });
});