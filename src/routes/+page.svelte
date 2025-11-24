<script lang="ts">
	import Workspace from '$lib/components/workspace/Workspace.svelte';
	import ContainerGroup from '$lib/components/workspace/ContainerGroup.svelte';
	import NodeRenderer from '$lib/components/workspace/NodeRenderer.svelte';
	import NodeDetailsModal from '$lib/components/workspace/modals/NodeDetailsModal.svelte';

	// Google stuff
	import SetDriveFileButton from '$lib/components/google-auth/SetDriveFileButton.svelte';

	import type { WorkspaceState, AnyNode, ContainerNode } from '$lib/types';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import * as googleState from '$lib/stores/googleState';
	import { nodes, setNodes } from '$lib/stores/nodes';
	import { get } from 'svelte/store';

	export let data: PageData;
	const { session } = data;

	let x = 0;
	let y = 0;
	let scale = 1;
	let nodeModalOpen = false;
	let selectedNode: AnyNode | null = null;

	/* Workspace data */
	let workspaceLoading = false;

	/**
	 * Load workspace state from Google Drive for the given fileId.
	 * Sets `workspaceLoading` while the request is in-flight so the
	 * `Workspace` component shows the embedded loader.
	 */
	async function loadWorkspaceFromDrive(fileIdToLoad: string | null) {
		if (!fileIdToLoad) return;

		workspaceLoading = true;
		try {
			const response = await fetch(`/api/drive/get-workspace?fileId=${fileIdToLoad}`);
			console.log('Fetch workspace response:', response);
			if (response.ok) {
				const data = await response.json();
				if (data.state) {
					setNodes(data.state.nodes);
				}
			}
		} catch (err) {
			console.error('Failed to load workspace from drive', err);
		} finally {
			workspaceLoading = false;
		}
	}

	function updateNode({ id, x, y, width, height }: { id: string; x: number; y: number; width?: number; height?: number }) {
		nodes.update((current) => 
			current.map((n) => {
				if (n.id !== id) return n;
				if (n.type === 'container' && width !== undefined && height !== undefined) {
					return { ...n, x, y, width, height };
				}
				return { ...n, x, y };
			})
		);
	}

	function handleNodeDoubleClick(node: AnyNode) {
		selectedNode = node;
		nodeModalOpen = true;
	}

	$: if (!nodeModalOpen && selectedNode) {
		selectedNode = null;
	}

	/* Save to Google Drive */
	let fileId: string | null = null;
	let saving = false;
	let saveError: string | null = null;
	let saveOk = false;

	googleState.googleDriveFileId.subscribe((id) => {
		if (typeof localStorage !== 'undefined' && id) {
			fileId = id;
			localStorage.setItem('helixWorkspaceFileId', id);
			// When the user selects a file, fetch the workspace for it.
			loadWorkspaceFromDrive(id);
		}
	});

	if (typeof localStorage !== 'undefined') {
		fileId = localStorage.getItem('helixWorkspaceFileId');
	}

	async function saveWorkspace() {
		if (!session?.accessToken) {
			saveError = 'You must sign in with Google Drive first.';
			return;
		}

		saving = true;
		saveError = null;
		saveOk = false;

		const state: WorkspaceState = {
			nodes: get(nodes)
		};

		try {
			const res = await fetch('/api/drive/save-workspace', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					fileId,
					state
				})
			});

			if (!res.ok) {
				const text = await res.text();
				throw new Error(text || `Save failed with ${res.status}`);
			}

			const data = (await res.json()) as { fileId?: string };

			if (data.fileId) {
				fileId = data.fileId;
				if (typeof localStorage !== 'undefined') {
					localStorage.setItem('helixWorkspaceFileId', fileId);
				}
			}

			saveOk = true;
		} catch (err) {
			console.error(err);
			saveError = err instanceof Error ? err.message : 'Unknown error';
		} finally {
			saving = false;
		}
	}

	onMount(async () => {
		// If we have a persisted file id, load its workspace
		await loadWorkspaceFromDrive(fileId);
	});

	// Separate containers from other nodes for rendering
	$: containers = $nodes.filter((n): n is ContainerNode => n.type === 'container');
	$: topLevelNodes = $nodes.filter((n) => {
		// A node is top-level if it's not inside any container
		return !containers.some(c => c.children.some(child => child.id === n.id));
	});
</script>

<div class="flex min-h-screen w-full flex-col bg-slate-950">
	<!-- Top bar -->
	<div
		class="flex items-center justify-between border-b border-slate-800 px-4 py-2 text-sm text-slate-100"
	>
		<div class="flex items-center gap-3">
			<span class="font-semibold">Helix Workspace</span>
			{#if session?.user?.email}
				<span class="text-xs text-slate-400">Signed in as {session.user.email}</span>
			{/if}
		</div>

		<div class="flex items-center gap-3">
			<!-- Set Drive file button -->
			<SetDriveFileButton bind:fileId {session} />
			<!-- Sign in / out -->
			{#if session}
				<form method="POST" action="/auth/signout">
					<button
						type="submit"
						class="rounded border border-slate-600 px-3 py-1 text-xs font-medium text-slate-100 hover:bg-slate-800"
					>
						Sign out
					</button>
				</form>
			{:else}
				<form method="POST" action="/auth/signin/google">
					<button
						type="submit"
						class="rounded bg-sky-600 px-3 py-1 text-xs font-medium text-white hover:bg-sky-500"
					>
						Sign in with Google Drive
					</button>
				</form>
			{/if}

			<!-- Save button -->
			<button
				class="rounded bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
				on:click={saveWorkspace}
				disabled={saving || !session?.accessToken}
			>
				{#if saving}
					Saving…
				{:else}
					Save workspace
				{/if}
			</button>

			{#if saveOk}
				<span class="text-xs text-emerald-300">Saved</span>
			{/if}
			{#if saveError}
				<span class="text-xs text-red-400">Error: {saveError}</span>
			{/if}
		</div>
	</div>

	<!-- Workspace area -->
	<div class="h-screen w-full">
		<!-- Drawer with all nodes listed -->
		<div
			class="absolute right-0 top-12 z-10 h-[calc(100vh-3rem)] w-64 overflow-y-auto border-l border-slate-800 bg-slate-900 p-4"
		>
			<h2 class="mb-4 text-sm font-semibold text-slate-200">All Nodes</h2>
			<div class="space-y-2">
				{#each $nodes as node (node.id)}
					<div
						class="rounded border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-100 hover:bg-slate-700"
					>
						<div class="font-semibold">{node.name}</div>
						<div class="text-slate-400">({node.type})</div>
					</div>
				{/each}
			</div>
		</div>

		<Workspace bind:x bind:y let:scale loading={workspaceLoading}>
			{#each containers as container (container.id)}
				<ContainerGroup {container} {scale} onChange={updateNode}>
					{#each container.children as node (node.id)}
						<NodeRenderer
							{node}
							{scale}
							onChange={updateNode}
							onDoubleClick={handleNodeDoubleClick}
						/>
					{/each}
				</ContainerGroup>
			{/each}
			<!-- Render all top-level nodes (not in any container) -->
			{#each topLevelNodes as node (node.id)}
				<NodeRenderer
					{node}
					{scale}
					onChange={updateNode}
					onDoubleClick={handleNodeDoubleClick}
				/>
			{/each}
		</Workspace>
	</div>

	<NodeDetailsModal bind:open={nodeModalOpen} node={selectedNode} />
</div>