import { commandr } from '../commandr.js';
import { STATE_FILE, type ProjectState } from './discovery.js';

/**
 * Persists the project state to state.json.
 */
export async function saveState(installed_skills: string[], active_targets: string[]): Promise<void> {
  const state: ProjectState = {
    last_updated: new Date().toISOString(),
    installed_skills,
    active_targets,
  };

  await commandr.ensureDir('.instill');
  await commandr.writeFile(STATE_FILE, JSON.stringify(state, null, 2));
}
