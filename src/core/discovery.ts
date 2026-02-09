import { commandr } from '../commandr.js';
import { join } from 'node:path';
import { loadRemoteSources } from './sources.js';
import { getCachedSkill, cacheSkill } from './cache.js';
import { fetchSkillFromRemote } from './fetch.js';

export interface RemoteSource {
  url: string;
  type: 'github';
  name: string;
}

export interface ProjectState {
  last_updated: string;
  installed_skills: string[];
  active_targets: string[];
  sources?: RemoteSource[];
}

export const LIBRARY_PATH = '.instill/library';
export const STATE_FILE = '.instill/state.json';

/**
 * Discovers available skills in the library.
 */
export async function discoverSkills(): Promise<string[]> {
  const skillsWithSources = await discoverSkillsWithSources();
  // Return unique skill names, preferring local
  return Array.from(new Set(skillsWithSources.map(s => s.name)));
}

export interface SkillSource {
  name: string;
  source: 'local' | string; // 'local' or remote source name
}

/**
 * Discovers available skills from local and remote sources with source information.
 */
export async function discoverSkillsWithSources(): Promise<SkillSource[]> {
  const skills = new Map<string, SkillSource>();

  // Discover local skills first (takes precedence)
  try {
    const files = await commandr.listDir(LIBRARY_PATH);
    const localSkills = files
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace(/\.md$/, ''));

    for (const skillName of localSkills) {
      skills.set(skillName, { name: skillName, source: 'local' });
    }
  } catch (error) {
    // If directory doesn't exist, continue with remote sources
  }

  // Discover remote skills
  const sources = await loadRemoteSources();
  for (const source of sources) {
    try {
      // Try to discover skills from remote source
      // For now, we'll discover on-demand rather than listing all remote skills
      // This avoids excessive network calls during discovery
      // Remote skills will be available when explicitly requested
    } catch (error) {
      // Log but don't block discovery on remote source errors
    }
  }

  return Array.from(skills.values());
}

/**
 * Loads the project state from state.json.
 */
export async function loadState(): Promise<ProjectState | null> {
  try {
    const content = await commandr.readFile(STATE_FILE);
    const state = JSON.parse(content) as ProjectState;
    // Ensure sources field exists (backward compatibility)
    if (!state.sources) {
      state.sources = [];
    }
    return state;
  } catch (error) {
    return null;
  }
}
