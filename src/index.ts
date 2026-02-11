#!/usr/bin/env node
import { Command } from 'commander';
import {
  discoverSkillsWithSources,
  loadState,
  initializeLibraryWithTemplate,
} from './core/discovery.js';
import {
  selectSkills,
  selectTargets,
  manageRemoteSources,
  promptForRepositoryUrl,
  promptForSourceName,
  selectSourceToRemove,
  confirmTemplateCreation,
} from './core/tui.js';
import { executeSync, type AdapterRegistry } from './core/orchestrator.js';
import { addRemoteSource, removeRemoteSource, listRemoteSources } from './core/sources.js';
import { clearCache } from './core/cache.js';
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
  .version('1.3.0');

program
  .command('init')
  .description('Initialize or update skills in the current project.')
  .action(async () => {
    try {
      // 1. Discovery
      let availableSkills = await discoverSkillsWithSources();

      if (availableSkills.length === 0) {
        const shouldCreateTemplate = await confirmTemplateCreation();
        if (shouldCreateTemplate) {
          await initializeLibraryWithTemplate();
          console.log('✓ Created template skill in .instill/library/template-skill.md');
          // Re-discover after template creation
          availableSkills = await discoverSkillsWithSources();
        } else {
          console.log('No skills available. Initialization cancelled.');
          return;
        }
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

program
  .command('install [skills...]')
  .description('Install one or more skills.')
  .action(async skills => {
    try {
      if (skills.length === 0) {
        console.error('Error: No skills specified for installation.');
        process.exit(1);
      }

      // 1. Discovery
      const availableSkills = await discoverSkillsWithSources();
      const availableSkillNames = availableSkills.map(s => s.name);

      // Validate skills
      for (const skill of skills) {
        if (!availableSkillNames.includes(skill)) {
          console.error(`Error: Skill "${skill}" not found.`);
          process.exit(1);
        }
      }

      const state = await loadState();
      const previousSkills = state?.installed_skills || [];
      let selectedTargets = state?.active_targets || [];

      // If no targets in state, prompt for them
      if (selectedTargets.length === 0) {
        selectedTargets = await selectTargets([]);
        if (selectedTargets.length === 0) {
          console.log('No targets selected. Installation cancelled.');
          return;
        }
      }

      // Combine new skills with previous ones
      const selectedSkills = Array.from(new Set([...previousSkills, ...skills]));

      // 3. Execution
      console.log('\nSynchronizing context...');
      await executeSync(
        selectedSkills,
        selectedTargets,
        previousSkills,
        state?.active_targets || [],
        registry
      );
      console.log('✓ Installation complete and state updated.\n');
    } catch (error) {
      console.error('\nError during installation:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

const sourcesCommand = program
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
            } catch (error) {
              console.error(
                `Error adding source: ${error instanceof Error ? error.message : error}`
              );
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
            } catch (error) {
              console.error(`Error removing source: ${error instanceof Error ? error.message : error}`);
            }
            break;
          }

          case 'list': {
            try {
              const sources = await listRemoteSources();
              if (sources.length === 0) {
                console.log('No remote sources configured.');
              } else {
                console.log('\nConfigured Remote Sources:');
                sources.forEach((source, index) => {
                  console.log(`${index + 1}. ${source.name} (${source.url})`);
                });
              }
            } catch (error) {
              console.error(`Error listing sources: ${error instanceof Error ? error.message : error}`);
            }
            break;
          }

          case 'cancel':
            continueManaging = false;
            break;
        }
      }
    } catch (error) {
      console.error('\nError managing sources:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

sourcesCommand
  .command('add <url> [name]')
  .description('Add a remote skill library source.')
  .action(async (url, name) => {
    try {
      const suggestedName = name || url.split('/').pop()?.replace(/\.git$/, '');
      const newSource = await addRemoteSource(url, suggestedName);
      console.log(`✓ Added source: ${newSource.name}`);
    } catch (error) {
      console.error(`Error adding source: ${error instanceof Error ? error.message : error}`);
      process.exit(1);
    }
  });

sourcesCommand
  .command('remove <name>')
  .description('Remove a remote skill library source.')
  .action(async name => {
    try {
      const removed = await removeRemoteSource(name);
      if (removed) {
        console.log(`✓ Removed source: ${name}`);
      } else {
        console.error(`Source not found: ${name}`);
        process.exit(1);
      }
    } catch (error) {
      console.error(`Error removing source: ${error instanceof Error ? error.message : error}`);
      process.exit(1);
    }
  });

sourcesCommand
  .command('list')
  .description('List configured remote skill library sources.')
  .action(async () => {
    try {
      const sources = await listRemoteSources();
      if (sources.length === 0) {
        console.log('No remote sources configured.');
      } else {
        console.log('\nConfigured Remote Sources:');
        sources.forEach((source, index) => {
          console.log(`${index + 1}. ${source.name} (${source.url})`);
        });
      }
    } catch (error) {
      console.error(`Error listing sources: ${error instanceof Error ? error.message : error}`);
      process.exit(1);
    }
  });

program
  .command('cache-clear')
  .description('Clear the remote skills cache.')
  .option('-s, --skill <name>', 'Clear cache for a specific skill')
  .action(async options => {
    try {
      if (options.skill) {
        await clearCache(options.skill);
        console.log(`✓ Cleared cache for skill: ${options.skill}`);
      } else {
        await clearCache();
        console.log('✓ Cleared all cached skills');
      }
    } catch (error) {
      console.error('\nError clearing cache:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();