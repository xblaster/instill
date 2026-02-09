import type { RemoteSource } from './discovery.js';

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com';
const DEFAULT_BRANCH = 'main';

/**
 * Converts a GitHub repository URL to the raw content URL.
 */
export function convertGitHubUrlToRawUrl(
  repoUrl: string,
  filePath: string,
  branch: string = DEFAULT_BRANCH
): string {
  // Parse: https://github.com/user/repo -> raw.githubusercontent.com/user/repo/main/filePath
  const match = repoUrl.match(/github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_.-]+)\/?$/);
  if (!match) {
    throw new Error(`Invalid GitHub URL: ${repoUrl}`);
  }

  const [, owner, repo] = match;
  return `${GITHUB_RAW_BASE}/${owner}/${repo}/${branch}/${filePath}`;
}

/**
 * Fetches a skill file from a remote GitHub repository.
 */
export async function fetchSkillFromRemote(
  source: RemoteSource,
  skillName: string,
  filePath: string = `skills/${skillName}.md`
): Promise<string> {
  if (source.type !== 'github') {
    throw new Error(`Unsupported source type: ${source.type}`);
  }

  const url = convertGitHubUrlToRawUrl(source.url, filePath);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Instill/1.0 (https://github.com/xblaster/instill)',
        'Accept': 'text/plain',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          `Skill "${skillName}" not found in repository "${source.name}" (${source.url})`
        );
      }
      throw new Error(
        `Failed to fetch skill from ${source.name}: HTTP ${response.status} ${response.statusText}`
      );
    }

    return await response.text();
  } catch (error) {
    if (error instanceof Error) {
      // Re-throw known errors
      if (error.message.includes('not found') || error.message.includes('Failed to fetch')) {
        throw error;
      }
      // Handle network errors
      if (error.message.includes('fetch') || error.message.includes('ENOTFOUND')) {
        throw new Error(
          `Network error fetching from ${source.name}: ${error.message}`
        );
      }
    }
    throw new Error(
      `Error fetching skill "${skillName}" from "${source.name}": ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
