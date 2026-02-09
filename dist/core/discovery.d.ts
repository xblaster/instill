export interface RemoteSource {
    url: string;
    type: 'github';
    name: string;
}
export interface ProjectState {
    last_updated: string;
    installed_skills: string[];
    active_targets: string[];
    sources?: RemoteSource[];
}
export declare const LIBRARY_PATH = ".instill/library";
export declare const STATE_FILE = ".instill/state.json";
/**
 * Discovers available skills in the library.
 */
export declare function discoverSkills(): Promise<string[]>;
export interface SkillSource {
    name: string;
    source: 'local' | string;
}
/**
 * Discovers available skills from local and remote sources with source information.
 */
export declare function discoverSkillsWithSources(): Promise<SkillSource[]>;
/**
 * Loads the project state from state.json.
 */
export declare function loadState(): Promise<ProjectState | null>;
//# sourceMappingURL=discovery.d.ts.map