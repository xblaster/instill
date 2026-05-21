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
 * Strips YAML frontmatter (--- ... ---) from skill content.
 * Used to normalise vercel-labs/skills SKILL.md files before installation.
 */
export function stripFrontmatter(content: string): string {
  const match = content.match(/^---[\r\n][\s\S]*?[\r\n]---[\r\n]([\s\S]*)$/);
  return match ? match[1].trim() : content;
}

/**
 * Fetches a raw URL, returning null on 404 and throwing on other errors.
 */
async function fetchRawContent(url: string, sourceName: string): Promise<string | null> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'User-Agent': 'Instill/1.0 (https://github.com/xblaster/instill)',
      'Accept': 'text/plain',
    },
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(
      `Failed to fetch skill from ${sourceName}: HTTP ${response.status} ${response.statusText}`
    );
  }
  return await response.text();
}

/**
 * Fetches a skill file from a remote GitHub repository.
 * Supports two formats:
 *   - Flat:      skills/{skillName}.md          (instill default)
 *   - Directory: skills/{skillName}/SKILL.md    (vercel-labs/skills format)
 * Tries flat format first; falls back to directory format on 404.
 * Frontmatter is stripped automatically from SKILL.md files.
 */
export async function fetchSkillFromRemote(
  source: RemoteSource,
  skillName: string
): Promise<string> {
  if (source.type !== 'github') {
    throw new Error(`Unsupported source type: ${source.type}`);
  }

  try {
    // 1. Try flat format: skills/{skillName}.md
    const flatUrl = convertGitHubUrlToRawUrl(source.url, `skills/${skillName}.md`);
    const flatContent = await fetchRawContent(flatUrl, source.name);
    if (flatContent !== null) {
      return flatContent;
    }

    // 2. Fallback: vercel-labs directory format: skills/{skillName}/SKILL.md
    const dirUrl = convertGitHubUrlToRawUrl(source.url, `skills/${skillName}/SKILL.md`);
    const dirContent = await fetchRawContent(dirUrl, source.name);
    if (dirContent !== null) {
      return stripFrontmatter(dirContent);
    }

    throw new Error(
      `Skill "${skillName}" not found in repository "${source.name}" (${source.url})`
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('not found') || error.message.includes('Failed to fetch')) {
        throw error;
      }
      if (error.message.includes('fetch') || error.message.includes('ENOTFOUND')) {
        throw new Error(`Network error fetching from ${source.name}: ${error.message}`);
      }
    }
    throw new Error(
      `Error fetching skill "${skillName}" from "${source.name}": ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Lists all skill names in a remote GitHub repository's skills directory.
 * Supports two formats:
 *   - Flat:      *.md files (instill default)
 *   - Directory: subdirectories containing SKILL.md (vercel-labs/skills format)
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
      .filter(
        entry =>
          // Flat format: .md files in the skills/ directory
          (entry.type === 'file' && entry.name.endsWith('.md')) ||
          // vercel-labs format: subdirectories (each contains a SKILL.md)
          entry.type === 'dir'
      )
      .map(entry => (entry.type === 'dir' ? entry.name : entry.name.replace(/\.md$/, '')));
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Failed to list')) {
        throw error;
      }
      if (error.message.includes('403')) {
        throw new Error(`GitHub API rate limit reached or forbidden for ${source.name}`);
      }
    }
    throw new Error(
      `Error listing skills from "${source.name}": ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
