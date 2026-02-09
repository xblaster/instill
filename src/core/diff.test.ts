import { describe, it, expect } from 'vitest';
import { calculateDiff } from './diff.js';

describe('Diffing Algorithm', () => {
  it('should correctly identify removals and additions', () => {
    const previousSkills = ['skill1', 'skill2'];
    const selectedSkills = ['skill2', 'skill3'];
    const previousTargets = ['claude'];
    const selectedTargets = ['claude', 'gemini'];

    const diff = calculateDiff(selectedSkills, selectedTargets, previousSkills, previousTargets);

    expect(diff.skillsToAdd).toEqual(['skill2', 'skill3']);
    expect(diff.skillsToRemove).toEqual(['skill1']);
    expect(diff.abandonedTargets).toEqual([]);
  });

  it('should identify abandoned targets', () => {
    const previousSkills = ['skill1'];
    const selectedSkills = ['skill1'];
    const previousTargets = ['claude', 'gemini'];
    const selectedTargets = ['claude'];

    const diff = calculateDiff(selectedSkills, selectedTargets, previousSkills, previousTargets);

    expect(diff.abandonedTargets).toEqual(['gemini']);
  });
});
