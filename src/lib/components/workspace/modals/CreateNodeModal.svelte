<script lang="ts">
	import Modal from '$lib/components/generic/Modal.svelte';
	import NodeRenderer from '$lib/components/workspace/NodeRenderer.svelte';

	import type { AnyNode } from '$lib/types';

	export let open = false;
	export let node: AnyNode | null = null;
	export let scale = 1;
	export let onChange = (_n: AnyNode) => {};

	type NodeKind = 'class' | 'method' | 'property';

	let selectedKind: NodeKind = 'class';
	let draftNode: AnyNode | null = null;

	function createDefaultNode(kind: NodeKind): AnyNode {
		switch (kind) {
			case 'class':
				return {
					id: crypto.randomUUID(),
					kind: 'class',
					name: 'NewClass',
					x: node?.x ?? 0,
					y: node?.y ?? 0,
					properties: [],
					methods: []
				};
			case 'method':
				return {
					id: crypto.randomUUID(),
					kind: 'method',
					methodName: 'newMethod',
					returnType: 'void',
					x: node?.x ?? 0,
					y: node?.y ?? 0
				};
			case 'property':
				return {
					id: crypto.randomUUID(),
					kind: 'property',
					propertyName: 'newProperty',
					propertyType: 'string',
					x: node?.x ?? 0,
					y: node?.y ?? 0
				};
		}
	}

	// Reset draft when modal opens
	$: if (open) {
		if (node) {
			selectedKind = node.kind as NodeKind;
			draftNode = structuredClone(node) as AnyNode;
		} else if (!draftNode) {
			draftNode = createDefaultNode(selectedKind);
		}
	}

	function handleKindChange(kind: NodeKind) {
		selectedKind = kind;

		const id = draftNode?.id ?? node?.id ?? crypto.randomUUID();
		const x = draftNode?.x ?? node?.x ?? 0;
		const y = draftNode?.y ?? node?.y ?? 0;

		const base = createDefaultNode(kind);
		draftNode = { ...base, id, x, y };
	}

	function updateDraft(patch: Partial<AnyNode>) {
		if (!draftNode) return;
		draftNode = { ...draftNode, ...patch } as AnyNode;
	}

	function handleConfirm() {
		if (!draftNode) return;
		onChange(draftNode);
		open = false;
	}

	function handleCancel() {
		open = false;
		draftNode = node ? (structuredClone(node) as AnyNode) : null;
	}
</script>

<Modal bind:open={open}>
	<h2 slot="header" class="text-lg font-semibold text-slate-100">
		{node ? 'Edit Node' : 'Create Node'}
	</h2>

	<div class="flex flex-col gap-4 p-4 text-sm text-slate-100">
		<!-- Node type dropdown -->
		<div class="space-y-1">
			<label class="text-xs font-medium uppercase tracking-wide text-slate-400">
				Node type
			</label>
			<div class="relative">
				<select
					class="w-full rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 pr-8 text-sm text-slate-100 shadow-sm outline-none ring-0 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/60"
					bind:value={selectedKind}
					on:change={(e) =>
						handleKindChange((e.currentTarget as HTMLSelectElement).value as NodeKind)}
				>
					<option value="class">Class</option>
					<option value="method">Method</option>
					<option value="property">Property</option>
				</select>
				<div class="pointer-events-none absolute inset-y-0 right-2 flex items-center text-slate-500">
					<span class="text-xs">⌄</span>
				</div>
			</div>
		</div>

		{#if draftNode}
			<!-- Fields for the selected node type -->
			{#if draftNode.kind === 'class'}
				<div class="space-y-2">
					<div class="space-y-1">
						<label class="text-xs font-medium uppercase tracking-wide text-slate-400">
							Class name
						</label>
						<input
							class="w-full rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/60"
							type="text"
							bind:value={(draftNode as any).name}
							on:input={(e) =>
								updateDraft({ name: (e.currentTarget as HTMLInputElement).value } as any)}
						/>
					</div>
					<p class="text-xs text-slate-400">
						Properties and methods can be edited later from the workspace.
					</p>
				</div>
			{:else if draftNode.kind === 'method'}
				<div class="space-y-3">
					<div class="space-y-1">
						<label class="text-xs font-medium uppercase tracking-wide text-slate-400">
							Method name
						</label>
						<input
							class="w-full rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/60"
							type="text"
							bind:value={(draftNode as any).methodName}
							on:input={(e) =>
								updateDraft({
									methodName: (e.currentTarget as HTMLInputElement).value
								} as any)}
						/>
					</div>
					<div class="space-y-1">
						<label class="text-xs font-medium uppercase tracking-wide text-slate-400">
							Return type
						</label>
						<input
							class="w-full rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/60"
							type="text"
							bind:value={(draftNode as any).returnType}
							on:input={(e) =>
								updateDraft({
									returnType: (e.currentTarget as HTMLInputElement).value
								} as any)}
						/>
					</div>
				</div>
			{:else if draftNode.kind === 'property'}
				<div class="space-y-3">
					<div class="space-y-1">
						<label class="text-xs font-medium uppercase tracking-wide text-slate-400">
							Property name
						</label>
						<input
							class="w-full rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/60"
							type="text"
							bind:value={(draftNode as any).propertyName}
							on:input={(e) =>
								updateDraft({
									propertyName: (e.currentTarget as HTMLInputElement).value
								} as any)}
						/>
					</div>
					<div class="space-y-1">
						<label class="text-xs font-medium uppercase tracking-wide text-slate-400">
							Property type
						</label>
						<input
							class="w-full rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/60"
							type="text"
							bind:value={(draftNode as any).propertyType}
							on:input={(e) =>
								updateDraft({
									propertyType: (e.currentTarget as HTMLInputElement).value
								} as any)}
						/>
					</div>
				</div>
			{/if}

			<!-- Preview using NodeRenderer -->
			<div class="space-y-2">
				<div class="flex items-center justify-between">
					<span class="text-xs font-medium uppercase tracking-wide text-slate-400">
						Preview
					</span>
					<span
						class="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-400"
					>
						{draftNode.kind}
					</span>
				</div>
				<div class="rounded-lg border border-slate-800 bg-slate-950/80 p-3">
					<div class="pointer-events-none origin-top-left scale-[0.75] transform">
						<NodeRenderer node={draftNode} {scale} onChange={() => {}} />
					</div>
				</div>
			</div>
		{/if}

		<!-- Actions -->
		<div class="mt-2 flex justify-end gap-2">
			<button
				type="button"
				class="rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800"
				on:click={handleCancel}
			>
				Cancel
			</button>
			<button
				type="button"
				class="rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-950"
				on:click={handleConfirm}
			>
				{node ? 'Save' : 'Create'}
			</button>
		</div>
	</div>
</Modal>
