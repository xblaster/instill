import { commandr } from '../commandr.js';
import { join } from 'node:path';
import { loadRemoteSources } from './sources.js';
import { getCachedSkill, cacheSkill } from './cache.js';
import { fetchSkillFromRemote } from './fetch.js';
import { discoverRemoteSkills } from './loader.js';

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
  const remoteSkills = await discoverRemoteSkills();
  for (const { name, source } of remoteSkills) {
    // Only add if not already present (local wins)
    if (!skills.has(name)) {
      skills.set(name, { name, source: source.name });
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

/**
 * Initializes the library with a template skill.
 */
export async function initializeLibraryWithTemplate(): Promise<void> {
  await commandr.ensureDir(LIBRARY_PATH);
  const templatePath = join(LIBRARY_PATH, 'template-skill.md');
  const templateContent = `## Example Skill

This is a template skill created by \`instill init\`.
Skills are markdown files that describe capabilities for your AI assistant.

### Requirement: Simple Echo
The system SHALL echo back the user's input.

#### Scenario: Basic Echo
- **WHEN** user says "Hello"
- **THEN** system says "Hello"
`;
  await commandr.writeFile(templatePath, templateContent);
}
