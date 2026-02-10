import { commandr } from '../commandr.js';
import { type Adapter } from './base.js';
import { loadSkill } from '../core/loader.js';
import { join } from 'node:path';

export class MirrorAdapter implements Adapter {
  constructor(protected targetDir: string) { }

  async installSkills(skills: string[]): Promise<void> {
    await commandr.ensureDir(this.targetDir);
    for (const skill of skills) {
      const content = await loadSkill(skill);
      if (content) {
        await commandr.writeFile(join(this.targetDir, `${skill}.md`), content);
      } else {
        console.warn(`⚠️  Skipping installation of "${skill}": content not found.`);
      }
    }
  }

  async removeSkills(skills: string[]): Promise<void> {
    for (const skill of skills) {
      try {
        await commandr.deleteFile(join(this.targetDir, `${skill}.md`));
      } catch {
        // Ignore if file doesn't exist
      }
    }
  }

  async purgeAll(): Promise<void> {
    try {
      const files = await commandr.listDir(this.targetDir);
      for (const file of files) {
        await commandr.deleteFile(join(this.targetDir, file));
      }
    } catch {
      // Directory might not exist
    }
  }
}
