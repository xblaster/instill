import { commandr } from '../commandr.js';
import { LIBRARY_PATH } from './discovery.js';
import { loadRemoteSources } from './sources.js';
import { getCachedSkill, cacheSkill, isCacheValid } from './cache.js';
import { fetchSkillFromRemote } from './fetch.js';
import type { RemoteSource } from './discovery.js';

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
  if (cachedContent && (await isCacheValid(skillName))) {
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
    return await loadFromRemoteSource(source, skillName);
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
  Array<{ name: string; sources: RemoteSource[] }>
> {
  const sources = await loadRemoteSources();
  const discoveredSkills: Array<{ name: string; sources: RemoteSource[] }> = [];

  // For MVP, we don't enumerate all remote skills (would require listing directory)
  // Instead, skills are discovered on-demand when loaded
  // This can be enhanced in future to parse README or use GitHub API

  return discoveredSkills;
}
