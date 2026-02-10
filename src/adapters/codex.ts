import { MirrorAdapter } from './mirror.js';
export class CodexAdapter extends MirrorAdapter {
  constructor() {
    super('.agents/skills');
  }
}
