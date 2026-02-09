import { Command } from 'commander';
import { discoverSkills, loadState } from './core/discovery.js';
import { selectSkills, selectTargets } from './core/tui.js';
import { executeSync, type AdapterRegistry } from './core/orchestrator.js';
import { ClaudeAdapter } from './adapters/claude.js';
import { GeminiAdapter } from './adapters/gemini.js';
import { CursorAdapter } from './adapters/cursor.js';
import { AntigravityAdapter } from './adapters/antigravity.js';
import { CodexAdapter } from './adapters/codex.js';
import { VSCodeAdapter } from './adapters/vscode.js';

const registry: AdapterRegistry = {
  'claude-code': new ClaudeAdapter(),
  'gemini': new GeminiAdapter(),
  'cursor': new CursorAdapter(),
  'antigravity': new AntigravityAdapter(),
  'codex': new CodexAdapter(),
  'vscode': new VSCodeAdapter(),
};

const program = new Command();

program
  .name('instill')
  .description('Instill: A local skill orchestrator for AI assistants.')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize or update skills in the current project.')
  .action(async () => {
    try {
      // 1. Discovery
      const availableSkills = await discoverSkills();
      if (availableSkills.length === 0) {
        console.error('No skills found in .instill/library/. Add some .md files first!');
        return;
      }

      const state = await loadState();
      const previousSkills = state?.installed_skills || [];
      const previousTargets = state?.active_targets || [];

      // 2. Selection
      const selectedSkills = await selectSkills(availableSkills, previousSkills);
      const selectedTargets = await selectTargets(previousTargets);

      // 3. Execution
      console.log('\nSynchronizing context...');
      await executeSync(selectedSkills, selectedTargets, previousSkills, previousTargets, registry);
      console.log('✓ Synchronization complete and state updated.\n');
    } catch (error) {
      console.error('\nError during initialization:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();