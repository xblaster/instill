import { type Adapter } from './base.js';
export declare class MirrorAdapter implements Adapter {
    protected targetDir: string;
    constructor(targetDir: string);
    installSkills(skills: string[]): Promise<void>;
    removeSkills(skills: string[]): Promise<void>;
    purgeAll(): Promise<void>;
}
//# sourceMappingURL=mirror.d.ts.map