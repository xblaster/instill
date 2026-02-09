export interface Adapter {
    /**
     * Installs or updates the specified skills into the target environment.
     */
    installSkills(skills: string[]): Promise<void>;
    /**
     * Removes the specified skills from the target environment.
     */
    removeSkills(skills: string[]): Promise<void>;
    /**
     * Removes all Instill-managed files for this target.
     */
    purgeAll(): Promise<void>;
}
//# sourceMappingURL=base.d.ts.map