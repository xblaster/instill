import { commandr } from '../commandr.js';
import { LIBRARY_PATH } from '../core/discovery.js';
import { join } from 'node:path';
export class MirrorAdapter {
    constructor(targetDir) {
        this.targetDir = targetDir;
    }
    async installSkills(skills) {
        await commandr.ensureDir(this.targetDir);
        for (const skill of skills) {
            const content = await commandr.readFile(join(LIBRARY_PATH, `${skill}.md`));
            await commandr.writeFile(join(this.targetDir, `${skill}.md`), content);
        }
    }
    async removeSkills(skills) {
        for (const skill of skills) {
            try {
                await commandr.deleteFile(join(this.targetDir, `${skill}.md`));
            }
            catch {
                // Ignore if file doesn't exist
            }
        }
    }
    async purgeAll() {
        try {
            const files = await commandr.listDir(this.targetDir);
            for (const file of files) {
                await commandr.deleteFile(join(this.targetDir, file));
            }
        }
        catch {
            // Directory might not exist
        }
    }
}
//# sourceMappingURL=mirror.js.map