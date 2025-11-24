import { writable } from 'svelte/store';
import type { AnyNode } from '$lib/types';

export const nodes = writable<AnyNode[]>([]);
export const nodesLoaded = writable<boolean>(false);
export const nodesLoading = writable<boolean>(false);
export const updateLoading = writable<boolean>(false);

export function createNode(node: AnyNode) {
	updateLoading.set(true);
	nodes.update((n) => [...n, node]);
	updateLoading.set(false);
}
export function setNodes(newNodes: AnyNode[]) {
	nodesLoading.set(true);
	nodes.set(newNodes);
	nodesLoading.set(false);
	nodesLoaded.set(true);
}

export function resetNodes() {
	nodes.set([]);
	nodesLoaded.set(false);
	nodesLoading.set(false);
}

export function updateNode(updatedNode: AnyNode) {
	updateLoading.set(true);
	nodes.update((n) =>
		n.map((node) => (node.id === updatedNode.id ? { ...node, ...updatedNode } : node))
	);
	updateLoading.set(false);
}
