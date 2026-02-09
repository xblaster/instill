interface CacheMetadata {
    [skillName: string]: {
        source: string;
        fetchedAt: string;
    };
}
/**
 * Returns the cache directory path.
 */
export declare function getCachePath(): string;
/**
 * Ensures the cache directory structure exists.
 */
export declare function ensureCacheDir(): Promise<void>;
/**
 * Caches a skill file with metadata.
 */
export declare function cacheSkill(skillName: string, content: string, source: string): Promise<void>;
/**
 * Retrieves a cached skill by name.
 */
export declare function getCachedSkill(skillName: string): Promise<string | null>;
/**
 * Checks if a cached skill is valid based on TTL.
 */
export declare function isCacheValid(skillName: string, ttlDays?: number): Promise<boolean>;
/**
 * Clears cache for a specific skill or all skills.
 */
export declare function clearCache(skillName?: string): Promise<void>;
/**
 * Retrieves all cache metadata.
 */
export declare function getCacheMetadata(): Promise<CacheMetadata>;
export {};
//# sourceMappingURL=cache.d.ts.map