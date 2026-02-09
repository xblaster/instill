import { Command } from 'commander';
import { discoverSkills, loadState } from './core/discovery.js';
import { selectSkills, selectTargets, manageRemoteSources, promptForRepositoryUrl, promptForSourceName, selectSourceToRemove, } from './core/tui.js';
import { executeSync } from './core/orchestrator.js';
import { addRemoteSource, removeRemoteSource, listRemoteSources } from './core/sources.js';
import { clearCache } from './core/cache.js';
import { ClaudeAdapter } from './adapters/claude.js';
import { GeminiAdapter } from './adapters/gemini.js';
import { CursorAdapter } from './adapters/cursor.js';
import { AntigravityAdapter } from './adapters/antigravity.js';
import { CodexAdapter } from './adapters/codex.js';
import { VSCodeAdapter } from './adapters/vscode.js';
const registry = {
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
    }
    catch (error) {
        console.error('\nError during initialization:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
});
program
    .command('sources')
    .description('Manage remote skill library sources.')
    .action(async () => {
    try {
        let continueManaging = true;
        while (continueManaging) {
            const action = await manageRemoteSources();
            switch (action) {
                case 'add': {
                    try {
                        const url = await promptForRepositoryUrl();
                        const suggestedName = url.split('/').pop()?.replace(/\.git$/, '');
                        const name = await promptForSourceName(suggestedName);
                        const newSource = await addRemoteSource(url, name);
                        console.log(`✓ Added source: ${newSource.name}`);
                    }
                    catch (error) {
                        console.error(`Error adding source: ${error instanceof Error ? error.message : error}`);
                    }
                    break;
                }
                case 'remove': {
                    try {
                        const sources = await listRemoteSources();
                        const nameToRemove = await selectSourceToRemove(sources);
                        if (nameToRemove) {
                            const removed = await removeRemoteSource(nameToRemove);
                            if (removed) {
                                console.log(`✓ Removed source: ${nameToRemove}`);
                            }
                        }
                    }
                    catch (error) {
                        console.error(`Error removing source: ${error instanceof Error ? error.message : error}`);
                    }
                    break;
                }
                case 'list': {
                    try {
                        const sources = await listRemoteSources();
                        if (sources.length === 0) {
                            console.log('No remote sources configured.');
                        }
                        else {
                            console.log('\nConfigured Remote Sources:');
                            sources.forEach((source, index) => {
                                console.log(`${index + 1}. ${source.name} (${source.url})`);
                            });
                        }
                    }
                    catch (error) {
                        console.error(`Error listing sources: ${error instanceof Error ? error.message : error}`);
                    }
                    break;
                }
                case 'cancel':
                    continueManaging = false;
                    break;
            }
        }
    }
    catch (error) {
        console.error('\nError managing sources:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
});
program
    .command('cache-clear')
    .description('Clear the remote skills cache.')
    .option('-s, --skill <name>', 'Clear cache for a specific skill')
    .action(async (options) => {
    try {
        if (options.skill) {
            await clearCache(options.skill);
            console.log(`✓ Cleared cache for skill: ${options.skill}`);
        }
        else {
            await clearCache();
            console.log('✓ Cleared all cached skills');
        }
    }
    catch (error) {
        console.error('\nError clearing cache:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
});
program.parse();
//# sourceMappingURL=index.js.map