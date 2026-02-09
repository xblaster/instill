import { commandr } from '../commandr.js';
import { LIBRARY_PATH } from '../core/discovery.js';
import { join } from 'node:path';
const CLAUDE_FILE = 'CLAUDE.md';
const START_MARKER = '<!-- INSTILL_START -->';
const END_MARKER = '<!-- INSTILL_END -->';
export class ClaudeAdapter {
    async installSkills(skills) {
        let combinedContent = '';
        for (const skill of skills) {
            const content = await commandr.readFile(join(LIBRARY_PATH, `${skill}.md`));
            combinedContent += `
### ${skill}
${content}
`;
        }
        const managedBlock = `${START_MARKER}
${combinedContent}${END_MARKER}`;
        let currentContent = '';
        try {
            currentContent = await commandr.readFile(CLAUDE_FILE);
        }
        catch {
            // File doesn't exist, will be created
        }
        const startIdx = currentContent.indexOf(START_MARKER);
        const endIdx = currentContent.indexOf(END_MARKER);
        let newContent;
        if (startIdx !== -1 && endIdx !== -1) {
            newContent =
                currentContent.substring(0, startIdx) +
                    managedBlock +
                    currentContent.substring(endIdx + END_MARKER.length);
        }
        else {
            newContent = currentContent ? `${currentContent}

${managedBlock}` : managedBlock;
        }
        await commandr.writeFile(CLAUDE_FILE, newContent);
    }
    async removeSkills(skills) {
        // Note: Claude adapter uses managed block replacement in installSkills.
        // removeSkills is a no-op if we always overwrite with the full current selection.
        // But for compliance with the interface, we'll just ignore it since installSkills
        // handles the "truth".
    }
    async purgeAll() {
        try {
            let content = await commandr.readFile(CLAUDE_FILE);
            const startIdx = content.indexOf(START_MARKER);
            const endIdx = content.indexOf(END_MARKER);
            if (startIdx !== -1 && endIdx !== -1) {
                const newContent = content.substring(0, startIdx).trim() + content.substring(endIdx + END_MARKER.length);
                await commandr.writeFile(CLAUDE_FILE, newContent);
            }
        }
        catch {
            // Ignore if file doesn't exist
        }
    }
}
//# sourceMappingURL=claude.js.map