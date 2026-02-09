import { calculateDiff } from './diff.js';
import { saveState } from './state.js';
import { loadState } from './discovery.js';
/**
 * Orchestrates the synchronization of skills across selected targets.
 */
export async function executeSync(userSelectedSkills, userSelectedTargets, previousSkills, previousTargets, registry) {
    const diff = calculateDiff(userSelectedSkills, userSelectedTargets, previousSkills, previousTargets);
    // 1. Update SELECTED Targets
    for (const targetName of userSelectedTargets) {
        const adapter = registry[targetName];
        if (!adapter) {
            console.warn(`Warning: No adapter found for target "${targetName}"`);
            continue;
        }
        // Remove skills that were unchecked
        if (diff.skillsToRemove.length > 0) {
            await adapter.removeSkills(diff.skillsToRemove);
        }
        // Add/Update selected skills
        if (diff.skillsToAdd.length > 0) {
            await adapter.installSkills(diff.skillsToAdd);
        }
    }
    // 2. Cleanup Abandoned Targets
    for (const targetName of diff.abandonedTargets) {
        const adapter = registry[targetName];
        if (adapter) {
            await adapter.purgeAll();
        }
    }
    // 3. Save new state (preserve existing sources)
    const currentState = await loadState();
    await saveState(userSelectedSkills, userSelectedTargets, currentState?.sources ?? []);
}
//# sourceMappingURL=orchestrator.js.map