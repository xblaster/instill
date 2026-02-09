import { type Adapter } from './base.js';
export declare class ClaudeAdapter implements Adapter {
    installSkills(skills: string[]): Promise<void>;
    removeSkills(skills: string[]): Promise<void>;
    purgeAll(): Promise<void>;
}
//# sourceMappingURL=claude.d.ts.map