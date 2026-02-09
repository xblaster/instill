import type { RemoteSource } from './discovery.js';
/**
 * Presents a checkbox list for skill selection.
 */
export declare function selectSkills(available: string[], installed: string[]): Promise<string[]>;
/**
 * Presents a checkbox list for target environment selection.
 */
export declare function selectTargets(active: string[]): Promise<string[]>;
/**
 * Presents a menu for managing remote sources.
 */
export declare function manageRemoteSources(): Promise<'add' | 'remove' | 'list' | 'cancel'>;
/**
 * Prompts for a GitHub repository URL.
 */
export declare function promptForRepositoryUrl(): Promise<string>;
/**
 * Prompts for an optional source name.
 */
export declare function promptForSourceName(suggestedName?: string): Promise<string | undefined>;
/**
 * Presents a list of sources for removal.
 */
export declare function selectSourceToRemove(sources: RemoteSource[]): Promise<string | null>;
//# sourceMappingURL=tui.d.ts.map