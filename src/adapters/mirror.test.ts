import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MirrorAdapter } from './mirror.js';
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

describe('MirrorAdapter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should copy skills to targetDir', async () => {
    const adapter = new MirrorAdapter('.test/dir');
    vi.mocked(commandr.readFile).mockResolvedValue('Content');

    await adapter.installSkills(['skill1']);

    expect(commandr.ensureDir).toHaveBeenCalledWith('.test/dir');
    expect(commandr.ensureDir).toHaveBeenCalledWith(join('.test/dir', 'skill1'));
    expect(commandr.writeFile).toHaveBeenCalledWith(join('.test/dir', 'skill1', 'SKILL.md'), 'Content');
  });

  it('should remove skills from targetDir', async () => {
    const adapter = new MirrorAdapter('.test/dir');

    await adapter.removeSkills(['skill1']);

    expect(commandr.deleteFile).toHaveBeenCalledWith(join('.test/dir', 'skill1', 'SKILL.md'));
  });

  it('should purge all files in targetDir', async () => {
    const adapter = new MirrorAdapter('.test/dir');
    vi.mocked(commandr.listDir).mockResolvedValue(['file1.md', 'file2.md']);

    await adapter.purgeAll();

    expect(commandr.deleteFile).toHaveBeenCalledTimes(2);
    expect(commandr.deleteFile).toHaveBeenCalledWith(join('.test/dir', 'file1.md'));
  });
});
