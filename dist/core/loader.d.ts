import type { RemoteSource } from './discovery.js';
/**
 * Loads a skill from available sources (local > cache > remote).
 * Supports explicit source selection via source parameter or skillName@source-name syntax.
 */
export declare function loadSkill(skillIdentifier: string): Promise<string | null>;
/**
 * Preloads (discovers) a skill from remote sources without returning content.
 * Used for discovery and metadata purposes.
 */
export declare function discoverRemoteSkills(): Promise<Array<{
    name: string;
    sources: RemoteSource[];
}>>;
//# sourceMappingURL=loader.d.ts.map