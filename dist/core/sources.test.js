import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { addRemoteSource, removeRemoteSource, listRemoteSources, loadRemoteSources } from './sources.js';
import * as discovery from './discovery.js';
import * as state from './state.js';
vi.mock('./discovery.js');
vi.mock('./state.js');
describe('sources module', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('loadRemoteSources', () => {
        it('returns empty array when state has no sources', async () => {
            vi.mocked(discovery.loadState).mockResolvedValueOnce(null);
            const sources = await loadRemoteSources();
            expect(sources).toEqual([]);
        });
        it('returns sources from state', async () => {
            const mockSources = [
                { url: 'https://github.com/user/repo1', type: 'github', name: 'repo1' },
            ];
            vi.mocked(discovery.loadState).mockResolvedValueOnce({
                last_updated: '2024-01-01T00:00:00Z',
                installed_skills: [],
                active_targets: [],
                sources: mockSources,
            });
            const sources = await loadRemoteSources();
            expect(sources).toEqual(mockSources);
        });
    });
    describe('addRemoteSource', () => {
        it('validates GitHub URL format', async () => {
            vi.mocked(discovery.loadState).mockResolvedValueOnce(null);
            await expect(addRemoteSource('https://gitlab.com/user/repo')).rejects.toThrow('Invalid repository URL');
        });
        it('accepts valid GitHub URLs', async () => {
            vi.mocked(discovery.loadState).mockResolvedValueOnce({
                last_updated: '2024-01-01T00:00:00Z',
                installed_skills: [],
                active_targets: [],
                sources: [],
            });
            const source = await addRemoteSource('https://github.com/user/instill-skills');
            expect(source.url).toBe('https://github.com/user/instill-skills');
            expect(source.type).toBe('github');
            expect(source.name).toBe('instill-skills');
        });
        it('extracts name from URL when not provided', async () => {
            vi.mocked(discovery.loadState).mockResolvedValueOnce({
                last_updated: '2024-01-01T00:00:00Z',
                installed_skills: [],
                active_targets: [],
                sources: [],
            });
            const source = await addRemoteSource('https://github.com/user/my-repo.git');
            expect(source.name).toBe('my-repo.git');
        });
        it('uses custom name when provided', async () => {
            vi.mocked(discovery.loadState).mockResolvedValueOnce({
                last_updated: '2024-01-01T00:00:00Z',
                installed_skills: [],
                active_targets: [],
                sources: [],
            });
            const source = await addRemoteSource('https://github.com/user/repo', 'custom-name');
            expect(source.name).toBe('custom-name');
        });
        it('rejects duplicate source names', async () => {
            const existingSources = [
                { url: 'https://github.com/user/repo1', type: 'github', name: 'repo1' },
            ];
            vi.mocked(discovery.loadState).mockResolvedValueOnce({
                last_updated: '2024-01-01T00:00:00Z',
                installed_skills: [],
                active_targets: [],
                sources: existingSources,
            });
            await expect(addRemoteSource('https://github.com/user/repo2', 'repo1')).rejects.toThrow('already exists');
        });
    });
    describe('removeRemoteSource', () => {
        it('returns false when source not found', async () => {
            vi.mocked(discovery.loadState).mockResolvedValueOnce({
                last_updated: '2024-01-01T00:00:00Z',
                installed_skills: [],
                active_targets: [],
                sources: [],
            });
            const removed = await removeRemoteSource('nonexistent');
            expect(removed).toBe(false);
        });
        it('removes source by name', async () => {
            const sources = [
                { url: 'https://github.com/user/repo1', type: 'github', name: 'repo1' },
                { url: 'https://github.com/user/repo2', type: 'github', name: 'repo2' },
            ];
            vi.mocked(discovery.loadState).mockResolvedValueOnce({
                last_updated: '2024-01-01T00:00:00Z',
                installed_skills: [],
                active_targets: [],
                sources,
            });
            const removed = await removeRemoteSource('repo1');
            expect(removed).toBe(true);
            // Check that saveState was called with only repo2
            const calls = vi.mocked(state.saveState).mock.calls;
            expect(calls.length).toBeGreaterThan(0);
            const callArgs = calls[0];
            if (callArgs && callArgs[2]) {
                expect(callArgs[0]).toEqual([]);
                expect(callArgs[1]).toEqual([]);
                const sources = callArgs[2];
                expect(sources.length).toBe(1);
                expect(sources[0]?.name).toBe('repo2');
            }
        });
    });
    describe('listRemoteSources', () => {
        it('returns all sources', async () => {
            const mockSources = [
                { url: 'https://github.com/user/repo1', type: 'github', name: 'repo1' },
                { url: 'https://github.com/user/repo2', type: 'github', name: 'repo2' },
            ];
            vi.mocked(discovery.loadState).mockResolvedValueOnce({
                last_updated: '2024-01-01T00:00:00Z',
                installed_skills: [],
                active_targets: [],
                sources: mockSources,
            });
            const sources = await listRemoteSources();
            expect(sources).toEqual(mockSources);
        });
    });
});
//# sourceMappingURL=sources.test.js.map