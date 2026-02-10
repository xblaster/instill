import { commandr } from '../commandr.js';
import { LIBRARY_PATH } from './discovery.js';
import { loadRemoteSources } from './sources.js';
import {
  getCachedSkill,
  cacheSkill,
  isCacheValid,
  cacheSkillList,
  getCachedSkillList,
  isSkillListCacheValid,
} from './cache.js';
import { fetchSkillFromRemote, listGitHubRepoFiles } from './fetch.js';
import type { RemoteSource } from './discovery.js';

// Global flag to track if warnings should be displayed
let showWarnings = true;

/**
 * Enable or disable warning messages during skill loading.
 */
export function setWarningsEnabled(enabled: boolean): void {
  showWarnings = enabled;
}

/**
 * Display a warning message about cache usage.
 */
function warnCacheUsage(skillName: string, reason: string): void {
  if (showWarnings) {
    console.warn(`⚠️  Using cached version of "${skillName}": ${reason}`);
  }
}

/**
 * Loads a skill from available sources (local > cache > remote).
 * Supports explicit source selection via source parameter or skillName@source-name syntax.
 */
export async function loadSkill(skillIdentifier: string): Promise<string | null> {
  // Parse skillName@source-name syntax
  let skillName = skillIdentifier;
  let preferredSource: string | undefined;

  const parts = skillIdentifier.split('@');
  if (parts.length === 2 && parts[0] && parts[1]) {
    skillName = parts[0];
    preferredSource = parts[1];
  }

  // Try local library first
  try {
    const localPath = `${LIBRARY_PATH}/${skillName}.md`;
    const content = await commandr.readFile(localPath);
    return content;
  } catch (error) {
    // Skill not in local library, continue to remote sources
  }

  // Try cache
  const cachedContent = await getCachedSkill(skillName);
  const cacheValid = cachedContent && (await isCacheValid(skillName));
  if (cacheValid) {
    return cachedContent;
  }

  // Try remote sources
  const sources = await loadRemoteSources();

  if (preferredSource) {
    // Load from specific source only
    const source = sources.find(s => s.name === preferredSource);
    if (!source) {
      throw new Error(`Source "${preferredSource}" not found`);
    }
    try {
      return await loadFromRemoteSource(source, skillName);
    } catch (error) {
      // If preferred source fails, try cache as fallback
      if (cachedContent) {
        warnCacheUsage(skillName, `source "${preferredSource}" is unavailable`);
        return cachedContent;
      }
      throw error;
    }
  }

  // Try each remote source in order
  let lastError: Error | null = null;
  for (const source of sources) {
    try {
      const content = await loadFromRemoteSource(source, skillName);
      if (content) {
        return content;
      }
    } catch (error) {
      lastError = error as Error;
      // Continue to next source
    }
  }

  // If no cache hit and remote failed, return expired cache as fallback
  if (cachedContent) {
    warnCacheUsage(skillName, 'remote sources are unavailable');
    return cachedContent;
  }

  if (lastError) {
    throw lastError;
  }

  return null;
}

/**
 * Loads a skill from a specific remote source.
 */
async function loadFromRemoteSource(source: RemoteSource, skillName: string): Promise<string> {
  const content = await fetchSkillFromRemote(source, skillName);
  // Automatically cache fetched content
  await cacheSkill(skillName, content, source.name);
  return content;
}

/**
 * Preloads (discovers) a skill from remote sources without returning content.
 * Used for discovery and metadata purposes.
 */
export async function discoverRemoteSkills(): Promise<
  Array<{ name: string; source: RemoteSource }>
> {
  const sources = await loadRemoteSources();
  const discoveredSkills: Array<{ name: string; source: RemoteSource }> = [];

  for (const source of sources) {
    try {
      let skillNames: string[] | null = null;

      // Check cache first
      const cacheValid = await isSkillListCacheValid(source.name);
      if (cacheValid) {
        skillNames = await getCachedSkillList(source.name);
      }

      // Fetch from remote if cache invalid or missing
      if (!skillNames) {
        try {
          skillNames = await listGitHubRepoFiles(source);
          // Update cache
          await cacheSkillList(source.name, skillNames);
        } catch (error) {
          // If remote fetch fails, try to use expired cache as fallback
          const expiredCache = await getCachedSkillList(source.name);
          if (expiredCache) {
            warnCacheUsage(`listing for ${source.name}`, 'remote source is unavailable');
            skillNames = expiredCache;
          } else {
            throw error;
          }
        }
      }

      if (skillNames) {
        for (const name of skillNames) {
          discoveredSkills.push({ name, source });
        }
      }
    } catch (error) {
      if (showWarnings) {
        console.warn(
          `⚠️  Could not load skills from ${source.name}: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  }

  return discoveredSkills;
}
