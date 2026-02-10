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

/**
 * Lists all skill files in a remote GitHub repository's skills directory.
 */
export async function listGitHubRepoFiles(
  source: RemoteSource,
  dirPath: string = 'skills'
): Promise<string[]> {
  if (source.type !== 'github') {
    throw new Error(`Unsupported source type: ${source.type}`);
  }

  // Parse: https://github.com/user/repo -> api.github.com/repos/user/repo/contents/dirPath
  const match = source.url.match(/github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_.-]+)\/?$/);
  if (!match) {
    throw new Error(`Invalid GitHub URL: ${source.url}`);
  }

  const [, owner, repo] = match;
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${dirPath}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Instill/1.0 (https://github.com/xblaster/instill)',
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        // Return empty array if skills directory doesn't exist
        return [];
      }
      if (response.status === 403) {
        throw new Error(`GitHub API rate limit reached or forbidden for ${source.name}`);
      }
      throw new Error(
        `Failed to list skills from ${source.name}: HTTP ${response.status} ${response.statusText}`
      );
    }

    const data = (await response.json()) as Array<{ name: string; type: string }>;
    return data
      .filter(file => file.type === 'file' && file.name.endsWith('.md'))
      .map(file => file.name.replace(/\.md$/, ''));
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Failed to list')) {
        throw error;
      }
      // Handle rate limiting
      if (error.message.includes('403')) {
        throw new Error(`GitHub API rate limit reached or forbidden for ${source.name}`);
      }
    }
    throw new Error(
      `Error listing skills from "${source.name}": ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
