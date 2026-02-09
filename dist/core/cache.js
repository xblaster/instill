import { commandr } from '../commandr.js';
const CACHE_DIR = '.instill/.cache';
const SKILLS_CACHE_DIR = '.instill/.cache/skills';
const METADATA_FILE = '.instill/.cache/metadata.json';
/**
 * Returns the cache directory path.
 */
export function getCachePath() {
    return CACHE_DIR;
}
/**
 * Ensures the cache directory structure exists.
 */
export async function ensureCacheDir() {
    await commandr.ensureDir(SKILLS_CACHE_DIR);
}
/**
 * Caches a skill file with metadata.
 */
export async function cacheSkill(skillName, content, source) {
    await ensureCacheDir();
    const skillPath = `${SKILLS_CACHE_DIR}/${skillName}.md`;
    await commandr.writeFile(skillPath, content);
    // Update metadata
    const metadata = await getCacheMetadata();
    metadata[skillName] = {
        source,
        fetchedAt: new Date().toISOString(),
    };
    await commandr.writeFile(METADATA_FILE, JSON.stringify(metadata, null, 2));
}
/**
 * Retrieves a cached skill by name.
 */
export async function getCachedSkill(skillName) {
    try {
        const skillPath = `${SKILLS_CACHE_DIR}/${skillName}.md`;
        return await commandr.readFile(skillPath);
    }
    catch (error) {
        return null;
    }
}
/**
 * Checks if a cached skill is valid based on TTL.
 */
export async function isCacheValid(skillName, ttlDays = 7) {
    const metadata = await getCacheMetadata();
    const entry = metadata[skillName];
    if (!entry) {
        return false;
    }
    const fetchedAt = new Date(entry.fetchedAt);
    const now = new Date();
    const ageInDays = (now.getTime() - fetchedAt.getTime()) / (1000 * 60 * 60 * 24);
    return ageInDays < ttlDays;
}
/**
 * Clears cache for a specific skill or all skills.
 */
export async function clearCache(skillName) {
    if (skillName) {
        // Clear specific skill
        try {
            const skillPath = `${SKILLS_CACHE_DIR}/${skillName}.md`;
            await commandr.deleteFile(skillPath);
            // Remove from metadata
            const metadata = await getCacheMetadata();
            delete metadata[skillName];
            await commandr.writeFile(METADATA_FILE, JSON.stringify(metadata, null, 2));
        }
        catch (error) {
            // Ignore errors if file doesn't exist
        }
    }
    else {
        // Clear all cache
        try {
            const files = await commandr.listDir(SKILLS_CACHE_DIR);
            for (const file of files) {
                if (file.endsWith('.md')) {
                    await commandr.deleteFile(`${SKILLS_CACHE_DIR}/${file}`);
                }
            }
            // Clear metadata
            await commandr.writeFile(METADATA_FILE, JSON.stringify({}, null, 2));
        }
        catch (error) {
            // Ignore errors if directory doesn't exist
        }
    }
}
/**
 * Retrieves all cache metadata.
 */
export async function getCacheMetadata() {
    try {
        const content = await commandr.readFile(METADATA_FILE);
        return JSON.parse(content);
    }
    catch (error) {
        return {};
    }
}
//# sourceMappingURL=cache.js.map