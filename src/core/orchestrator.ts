import { type Adapter } from '../adapters/base.js';
import { calculateDiff } from './diff.js';
import { saveState } from './state.js';

export interface AdapterRegistry {
  [target: string]: Adapter;
}

/**
 * Orchestrates the synchronization of skills across selected targets.
 */
export async function executeSync(
  userSelectedSkills: string[],
  userSelectedTargets: string[],
  previousSkills: string[],
  previousTargets: string[],
  registry: AdapterRegistry
): Promise<void> {
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

  // 3. Save new state
  await saveState(userSelectedSkills, userSelectedTargets);
}
