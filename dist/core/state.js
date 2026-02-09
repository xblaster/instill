import { commandr } from '../commandr.js';
import { STATE_FILE } from './discovery.js';
/**
 * Persists the project state to state.json.
 */
export async function saveState(installed_skills, active_targets, sources = []) {
    const state = {
        last_updated: new Date().toISOString(),
        installed_skills,
        active_targets,
        sources,
    };
    await commandr.ensureDir('.instill');
    await commandr.writeFile(STATE_FILE, JSON.stringify(state, null, 2));
}
//# sourceMappingURL=state.js.map