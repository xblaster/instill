import { readdir, readFile, writeFile, unlink, mkdir } from 'node:fs/promises';
/**
 * Commandr: The core OS abstraction layer for Instill.
 * Handles atomic file system operations.
 */
export const commandr = {
    /**
     * Lists names of files and subdirectories within a directory.
     */
    async listDir(path) {
        return await readdir(path);
    },
    /**
     * Reads the UTF-8 string content of a file.
     */
    async readFile(path) {
        return await readFile(path, 'utf8');
    },
    /**
     * Writes UTF-8 string content to a file, overwriting if it exists.
     */
    async writeFile(path, content) {
        await writeFile(path, content, 'utf8');
    },
    /**
     * Deletes a file from the filesystem.
     */
    async deleteFile(path) {
        await unlink(path);
    },
    /**
     * Ensures a directory exists, creating it recursively if needed.
     */
    async ensureDir(path) {
        await mkdir(path, { recursive: true });
    },
};
//# sourceMappingURL=commandr.js.map