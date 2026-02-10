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
        const skillDir = join(this.targetDir, skill);
        await commandr.ensureDir(skillDir);
        await commandr.writeFile(join(skillDir, 'SKILL.md'), content);
      } else {
        console.warn(`⚠️  Skipping installation of "${skill}": content not found.`);
      }
    }
  }

  async removeSkills(skills: string[]): Promise<void> {
    for (const skill of skills) {
      try {
        const skillDir = join(this.targetDir, skill);
        await commandr.deleteFile(join(skillDir, 'SKILL.md'));
        // We don't delete the directory here to avoid issues if other files exist
        // or if multiple removals are happening. PurgeAll handles full cleanup.
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
