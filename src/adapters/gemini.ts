import { MirrorAdapter } from './mirror.js';
export class GeminiAdapter extends MirrorAdapter {
  constructor() {
    super('.gemini/skills');
  }
}