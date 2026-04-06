import { commandr } from '../commandr.js';
import { join } from 'node:path';
import { homedir } from 'node:os';
import type { RemoteSource } from './discovery.js';

export interface GlobalConfig {
  sources: RemoteSource[];
}

export const GLOBAL_CONFIG_DIR = join(homedir(), '.instill');
export const GLOBAL_CONFIG_FILE = join(GLOBAL_CONFIG_DIR, 'config.json');

/**
 * Loads the global user-level config from ~/.instill/config.json.
 * Returns empty config if the file is missing or malformed.
 */
export async function loadGlobalConfig(): Promise<GlobalConfig> {
  try {
    const content = await commandr.readFile(GLOBAL_CONFIG_FILE);
    const parsed = JSON.parse(content) as GlobalConfig;
    return { sources: parsed.sources ?? [] };
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.warn(`Warning: ~/.instill/config.json is malformed and will be ignored.`);
    }
    return { sources: [] };
  }
}

/**
 * Saves the global config to ~/.instill/config.json.
 * Creates the directory if it does not exist.
 */
export async function saveGlobalConfig(config: GlobalConfig): Promise<void> {
  await commandr.ensureDir(GLOBAL_CONFIG_DIR);
  await commandr.writeFile(GLOBAL_CONFIG_FILE, JSON.stringify(config, null, 2));
}

/**
 * Adds a remote source to the global config.
 */
export async function addGlobalSource(url: string, name?: string): Promise<RemoteSource> {
  if (!isValidGitHubUrl(url)) {
    throw new Error(
      `Invalid repository URL: "${url}". Must be a GitHub HTTPS URL (e.g., https://github.com/user/repo)`
    );
  }

  const config = await loadGlobalConfig();
  const sourceName = name || extractRepoName(url);

  if (config.sources.some(s => s.name === sourceName)) {
    throw new Error(`A source with name "${sourceName}" already exists`);
  }

  const newSource: RemoteSource = {
    url: url.trim(),
    type: 'github',
    name: sourceName,
  };

  config.sources.push(newSource);
  await saveGlobalConfig(config);
  return newSource;
}

/**
 * Removes a remote source from the global config by name.
 * Returns true if removed, false if not found.
 */
export async function removeGlobalSource(name: string): Promise<boolean> {
  const config = await loadGlobalConfig();
  const index = config.sources.findIndex(s => s.name === name);

  if (index === -1) {
    return false;
  }

  config.sources.splice(index, 1);
  await saveGlobalConfig(config);
  return true;
}

function isValidGitHubUrl(url: string): boolean {
  return /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+\/?$/.test(url.trim());
}

function extractRepoName(url: string): string {
  const match = url.trim().match(/github\.com\/[a-zA-Z0-9_-]+\/([a-zA-Z0-9_.-]+)\/?$/);
  return match?.[1] ?? 'remote-repo';
}
