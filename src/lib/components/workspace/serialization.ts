import type { WorkspaceState } from '$lib/types';

export function serializeWorkspace(state: WorkspaceState): string {
	return JSON.stringify(state);
}

export function deserializeWorkspace(data: string): WorkspaceState {
	const parsed = JSON.parse(data);
	return parsed as WorkspaceState;
}
