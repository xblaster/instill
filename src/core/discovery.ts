import { commandr } from '../commandr.js';
import { join } from 'node:path';

export interface ProjectState {
  last_updated: string;
  installed_skills: string[];
  active_targets: string[];
}

export const LIBRARY_PATH = '.instill/library';
export const STATE_FILE = '.instill/state.json';

/**
 * Discovers available skills in the library.
 */
export async function discoverSkills(): Promise<string[]> {
  try {
    const files = await commandr.listDir(LIBRARY_PATH);
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace(/\.md$/, ''));
  } catch (error) {
    // If directory doesn't exist, return empty
    return [];
  }
}

/**
 * Loads the project state from state.json.
 */
export async function loadState(): Promise<ProjectState | null> {
  try {
    const content = await commandr.readFile(STATE_FILE);
    return JSON.parse(content) as ProjectState;
  } catch (error) {
    return null;
  }
}
