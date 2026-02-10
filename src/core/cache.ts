import { commandr } from '../commandr.js';

const CACHE_DIR = '.instill/.cache';
const SKILLS_CACHE_DIR = '.instill/.cache/skills';
const LISTINGS_CACHE_DIR = '.instill/.cache/listings';
const METADATA_FILE = '.instill/.cache/metadata.json';

interface CacheMetadata {
  [skillName: string]: {
    source: string;
    fetchedAt: string;
  };
}

interface ListingMetadata {
  source: string;
  fetchedAt: string;
}

/**
 * Returns the cache directory path.
 */
export function getCachePath(): string {
  return CACHE_DIR;
}

/**
 * Ensures the cache directory structure exists.
 */
export async function ensureCacheDir(): Promise<void> {
  await commandr.ensureDir(SKILLS_CACHE_DIR);
  await commandr.ensureDir(LISTINGS_CACHE_DIR);
}

/**
 * Caches a skill file with metadata.
 */
export async function cacheSkill(
  skillName: string,
  content: string,
  source: string
): Promise<void> {
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
export async function getCachedSkill(skillName: string): Promise<string | null> {
  try {
    const skillPath = `${SKILLS_CACHE_DIR}/${skillName}.md`;
    return await commandr.readFile(skillPath);
  } catch (error) {
    return null;
  }
}

/**
 * Checks if a cached skill is valid based on TTL.
 */
export async function isCacheValid(skillName: string, ttlDays: number = 7): Promise<boolean> {
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
 * Caches a list of skills for a specific source.
 */
export async function cacheSkillList(
  sourceName: string,
  skills: string[]
): Promise<void> {
  await ensureCacheDir();

  const listPath = `${LISTINGS_CACHE_DIR}/${sourceName}.json`;
  await commandr.writeFile(listPath, JSON.stringify(skills, null, 2));

  // Update listing metadata
  const metadataPath = `${LISTINGS_CACHE_DIR}/${sourceName}.metadata.json`;
  const metadata: ListingMetadata = {
    source: sourceName,
    fetchedAt: new Date().toISOString(),
  };

  await commandr.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
}

/**
 * Retrieves a cached skill list for a source.
 */
export async function getCachedSkillList(sourceName: string): Promise<string[] | null> {
  try {
    const listPath = `${LISTINGS_CACHE_DIR}/${sourceName}.json`;
    const content = await commandr.readFile(listPath);
    return JSON.parse(content) as string[];
  } catch (error) {
    return null;
  }
}

/**
 * Checks if a cached skill list is valid based on TTL.
 */
export async function isSkillListCacheValid(
  sourceName: string,
  ttlDays: number = 7
): Promise<boolean> {
  try {
    const metadataPath = `${LISTINGS_CACHE_DIR}/${sourceName}.metadata.json`;
    const content = await commandr.readFile(metadataPath);
    const metadata = JSON.parse(content) as ListingMetadata;

    const fetchedAt = new Date(metadata.fetchedAt);
    const now = new Date();
    const ageInDays = (now.getTime() - fetchedAt.getTime()) / (1000 * 60 * 60 * 24);

    return ageInDays < ttlDays;
  } catch (error) {
    return false;
  }
}

/**
 * Clears cache for a specific skill or all skills.
 */
export async function clearCache(skillName?: string): Promise<void> {
  if (skillName) {
    // Clear specific skill
    try {
      const skillPath = `${SKILLS_CACHE_DIR}/${skillName}.md`;
      await commandr.deleteFile(skillPath);

      // Remove from metadata
      const metadata = await getCacheMetadata();
      delete metadata[skillName];
      await commandr.writeFile(METADATA_FILE, JSON.stringify(metadata, null, 2));
    } catch (error) {
      // Ignore errors if file doesn't exist
    }
  } else {
    // Clear all cache
    try {
      // Clear skills
      const files = await commandr.listDir(SKILLS_CACHE_DIR);
      for (const file of files) {
        if (file.endsWith('.md')) {
          await commandr.deleteFile(`${SKILLS_CACHE_DIR}/${file}`);
        }
      }
      
      // Clear listings
      try {
        const listingFiles = await commandr.listDir(LISTINGS_CACHE_DIR);
        for (const file of listingFiles) {
          if (file.endsWith('.json')) {
            await commandr.deleteFile(`${LISTINGS_CACHE_DIR}/${file}`);
          }
        }
      } catch (error) {
        // Listings directory might not exist
      }

      // Clear metadata
      await commandr.writeFile(METADATA_FILE, JSON.stringify({}, null, 2));
    } catch (error) {
      // Ignore errors if directory doesn't exist
    }
  }
}

/**
 * Retrieves all cache metadata.
 */
export async function getCacheMetadata(): Promise<CacheMetadata> {
  try {
    const content = await commandr.readFile(METADATA_FILE);
    return JSON.parse(content) as CacheMetadata;
  } catch (error) {
    return {};
  }
}
