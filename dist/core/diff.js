/**
 * Calculates the difference between the previous state and the current selection.
 */
export function calculateDiff(userSelectedSkills, userSelectedTargets, previousSkills, previousTargets) {
    const skillsToRemove = previousSkills.filter(skill => !userSelectedSkills.includes(skill));
    const abandonedTargets = previousTargets.filter(target => !userSelectedTargets.includes(target));
    return {
        skillsToAdd: userSelectedSkills, // We re-install/update all selected skills
        skillsToRemove,
        abandonedTargets,
    };
}
//# sourceMappingURL=diff.js.map