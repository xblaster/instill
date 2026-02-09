import type { RemoteSource } from './discovery.js';
/**
 * Loads remote sources from the project state.
 */
export declare function loadRemoteSources(): Promise<RemoteSource[]>;
/**
 * Adds a new remote source with URL validation.
 */
export declare function addRemoteSource(url: string, name?: string): Promise<RemoteSource>;
/**
 * Removes a remote source by name.
 */
export declare function removeRemoteSource(name: string): Promise<boolean>;
/**
 * Lists all configured remote sources.
 */
export declare function listRemoteSources(): Promise<RemoteSource[]>;
//# sourceMappingURL=sources.d.ts.map