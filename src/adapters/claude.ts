import { MirrorAdapter } from './mirror.js';

export class ClaudeAdapter extends MirrorAdapter {
  constructor() {
    super('.claude/skills');
  }
}