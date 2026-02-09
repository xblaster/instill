export interface DiffResult {
    skillsToAdd: string[];
    skillsToRemove: string[];
    abandonedTargets: string[];
}
/**
 * Calculates the difference between the previous state and the current selection.
 */
export declare function calculateDiff(userSelectedSkills: string[], userSelectedTargets: string[], previousSkills: string[], previousTargets: string[]): DiffResult;
//# sourceMappingURL=diff.d.ts.map