import { type Adapter } from '../adapters/base.js';
export interface AdapterRegistry {
    [target: string]: Adapter;
}
/**
 * Orchestrates the synchronization of skills across selected targets.
 */
export declare function executeSync(userSelectedSkills: string[], userSelectedTargets: string[], previousSkills: string[], previousTargets: string[], registry: AdapterRegistry): Promise<void>;
//# sourceMappingURL=orchestrator.d.ts.map