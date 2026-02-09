/**
 * Commandr: The core OS abstraction layer for Instill.
 * Handles atomic file system operations.
 */
export declare const commandr: {
    /**
     * Lists names of files and subdirectories within a directory.
     */
    listDir(path: string): Promise<string[]>;
    /**
     * Reads the UTF-8 string content of a file.
     */
    readFile(path: string): Promise<string>;
    /**
     * Writes UTF-8 string content to a file, overwriting if it exists.
     */
    writeFile(path: string, content: string): Promise<void>;
    /**
     * Deletes a file from the filesystem.
     */
    deleteFile(path: string): Promise<void>;
    /**
     * Ensures a directory exists, creating it recursively if needed.
     */
    ensureDir(path: string): Promise<void>;
};
//# sourceMappingURL=commandr.d.ts.map