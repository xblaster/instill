import { commandr } from '../commandr.js';
import { STATE_FILE, type ProjectState, type RemoteSource } from './discovery.js';

/**
 * Persists the project state to state.json.
 */
export async function saveState(
  installed_skills: string[],
  active_targets: string[],
  sources: RemoteSource[] = []
): Promise<void> {
  const state: ProjectState = {
    last_updated: new Date().toISOString(),
    installed_skills,
    active_targets,
    sources,
  };

  await commandr.ensureDir('.instill');
  await commandr.writeFile(STATE_FILE, JSON.stringify(state, null, 2));
}
