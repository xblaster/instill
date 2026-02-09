import type { RemoteSource } from './discovery.js';
/**
 * Converts a GitHub repository URL to the raw content URL.
 */
export declare function convertGitHubUrlToRawUrl(repoUrl: string, filePath: string, branch?: string): string;
/**
 * Fetches a skill file from a remote GitHub repository.
 */
export declare function fetchSkillFromRemote(source: RemoteSource, skillName: string, filePath?: string): Promise<string>;
//# sourceMappingURL=fetch.d.ts.map