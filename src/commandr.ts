import { readdir, readFile, writeFile, unlink, mkdir } from 'node:fs/promises';

/**
 * Commandr: The core OS abstraction layer for Instill.
 * Handles atomic file system operations.
 */
export const commandr = {
  /**
   * Lists names of files and subdirectories within a directory.
   */
  async listDir(path: string): Promise<string[]> {
    return await readdir(path);
  },

  /**
   * Reads the UTF-8 string content of a file.
   */
  async readFile(path: string): Promise<string> {
    return await readFile(path, 'utf8');
  },

  /**
   * Writes UTF-8 string content to a file, overwriting if it exists.
   */
  async writeFile(path: string, content: string): Promise<void> {
    await writeFile(path, content, 'utf8');
  },

  /**
   * Deletes a file from the filesystem.
   */
  async deleteFile(path: string): Promise<void> {
    await unlink(path);
  },

  /**
   * Ensures a directory exists, creating it recursively if needed.
   */
  async ensureDir(path: string): Promise<void> {
    await mkdir(path, { recursive: true });
  },
};
