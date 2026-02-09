import inquirer from 'inquirer';
import type { RemoteSource } from './discovery.js';

/**
 * Presents a checkbox list for skill selection.
 */
export async function selectSkills(available: string[], installed: string[]): Promise<string[]> {
  const { selected } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selected',
      message: 'Select Skills to Instill:',
      choices: available.map(skill => ({
        name: skill,
        value: skill,
        checked: installed.includes(skill),
      })),
    },
  ]);
  return selected;
}

/**
 * Presents a checkbox list for target environment selection.
 */
export async function selectTargets(active: string[]): Promise<string[]> {
  const targets = [
    { name: 'Claude Code', value: 'claude-code' },
    { name: 'Gemini', value: 'gemini' },
    { name: 'Cursor', value: 'cursor' },
    { name: 'Antigravity', value: 'antigravity' },
    { name: 'Codex', value: 'codex' },
    { name: 'VS Code', value: 'vscode' },
  ];

  const { selected } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selected',
      message: 'Select Target Environments:',
      choices: targets.map(t => ({
        ...t,
        checked: active.includes(t.value),
      })),
    },
  ]);
  return selected;
}

/**
 * Presents a menu for managing remote sources.
 */
export async function manageRemoteSources(): Promise<'add' | 'remove' | 'list' | 'cancel'> {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Manage Remote Sources:',
      choices: [
        { name: 'Add Remote Source', value: 'add' },
        { name: 'Remove Remote Source', value: 'remove' },
        { name: 'View Configured Sources', value: 'list' },
        { name: 'Cancel', value: 'cancel' },
      ],
    },
  ]);
  return action;
}

/**
 * Prompts for a GitHub repository URL.
 */
export async function promptForRepositoryUrl(): Promise<string> {
  const { url } = await inquirer.prompt([
    {
      type: 'input',
      name: 'url',
      message: 'Enter GitHub repository URL (e.g., https://github.com/user/instill-skills):',
      validate: (input: string) => {
        if (!input.trim()) {
          return 'URL cannot be empty';
        }
        return true;
      },
    },
  ]);
  return url;
}

/**
 * Prompts for an optional source name.
 */
export async function promptForSourceName(suggestedName?: string): Promise<string | undefined> {
  const { name } = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: `Enter source name (or press Enter to use "${suggestedName}"):`,
      default: suggestedName,
    },
  ]);
  return name || suggestedName;
}

/**
 * Presents a list of sources for removal.
 */
export async function selectSourceToRemove(sources: RemoteSource[]): Promise<string | null> {
  if (sources.length === 0) {
    console.log('No remote sources configured.');
    return null;
  }

  const { source } = await inquirer.prompt([
    {
      type: 'list',
      name: 'source',
      message: 'Select source to remove:',
      choices: sources.map(s => ({
        name: `${s.name} (${s.url})`,
        value: s.name,
      })),
    },
  ]);
  return source;
}
