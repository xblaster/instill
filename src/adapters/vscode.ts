import { MirrorAdapter } from './mirror.js';
export class VSCodeAdapter extends MirrorAdapter {
  constructor() {
    super('.vscode/context');
  }
}
