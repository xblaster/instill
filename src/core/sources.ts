import { loadState } from './discovery.js';
import { saveState } from './state.js';
import { loadGlobalConfig } from './global-config.js';
import type { RemoteSource } from './discovery.js';

/**
 * Loads merged remote sources: global config + project-local state.
 * Project-local sources take precedence over global sources on name conflict.
 */
export async function loadRemoteSources(): Promise<RemoteSource[]> {
  const [globalConfig, state] = await Promise.all([loadGlobalConfig(), loadState()]);
  const localSources = state?.sources ?? [];
  const localNames = new Set(localSources.map(s => s.name));

  // Start with global sources, then overlay local (local wins on name conflict)
  const globalSources = globalConfig.sources.filter(s => !localNames.has(s.name));
  return [...globalSources, ...localSources];
}

/**
 * Loads only project-local sources from state.json (no global merge).
 */
export async function loadLocalSources(): Promise<RemoteSource[]> {
  const state = await loadState();
  return state?.sources ?? [];
}

/**
 * Adds a new remote source with URL validation.
 */
export async function addRemoteSource(
  url: string,
  name?: string
): Promise<RemoteSource> {
  // Validate GitHub URL
  if (!isValidGitHubUrl(url)) {
    throw new Error(
      `Invalid repository URL: "${url}". Must be a GitHub HTTPS URL (e.g., https://github.com/user/repo)`
    );
  }

  const sources = await loadRemoteSources();

  // Extract repository name from URL if not provided
  const sourceName = name || extractRepoName(url);

  // Check for duplicate names
  if (sources.some(s => s.name === sourceName)) {
    throw new Error(`A source with name "${sourceName}" already exists`);
  }

  const newSource: RemoteSource = {
    url: url.trim(),
    type: 'github',
    name: sourceName,
  };

  sources.push(newSource);

  // Get current state to preserve installed_skills and active_targets
  const state = await loadState();
  await saveState(state?.installed_skills ?? [], state?.active_targets ?? [], sources);

  return newSource;
}

/**
 * Removes a remote source by name.
 */
export async function removeRemoteSource(name: string): Promise<boolean> {
  const sources = await loadRemoteSources();
  const index = sources.findIndex(s => s.name === name);

  if (index === -1) {
    return false;
  }

  sources.splice(index, 1);

  // Get current state to preserve installed_skills and active_targets
  const state = await loadState();
  await saveState(state?.installed_skills ?? [], state?.active_targets ?? [], sources);

  return true;
}

/**
 * Lists all configured remote sources.
 */
export async function listRemoteSources(): Promise<RemoteSource[]> {
  return loadRemoteSources();
}

/**
 * Validates if a URL is a valid GitHub repository URL.
 */
function isValidGitHubUrl(url: string): boolean {
  return /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+\/?$/.test(url.trim());
}

/**
 * Extracts repository name from GitHub URL.
 */
function extractRepoName(url: string): string {
  const match = url.trim().match(/github\.com\/[a-zA-Z0-9_-]+\/([a-zA-Z0-9_.-]+)\/?$/);
  return (match?.[1]) || 'remote-repo';
}
