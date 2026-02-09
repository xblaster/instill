import inquirer from 'inquirer';

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
