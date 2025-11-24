<script lang="ts">
	import Modal from '$lib/components/generic/Modal.svelte';
	import ButtonStandard from '$lib/components/generic/ButtonStandard.svelte';
	import type { AnyNode, ClassNode } from '$lib/types';
	import { updateNode } from '$lib/stores/nodes';

	export let open = false;
	export let node: AnyNode | null = null;

	let primaryName = '';
	let propertyType = '';
	let methodReturnType = '';
	let methodParameters = '';
	const instanceId =
		typeof crypto !== 'undefined' && 'randomUUID' in crypto
			? crypto.randomUUID()
			: Math.random().toString(36).slice(2);
	const primaryInputId = `${instanceId}-primary`;
	const returnTypeInputId = `${instanceId}-return`;
	const parameterInputId = `${instanceId}-params`;
	const propertyTypeInputId = `${instanceId}-property`;

	// Sync the form fields when a new node is selected
	$: if (node) {
		primaryName = node.name;
		
		if (node.type === 'method') {
			methodReturnType = node.returnType;
			methodParameters = node.parameters.join(', ');
		} else if (node.type === 'property') {
			propertyType = node.type || '';
		}
	}

	function parseParameters(value: string) {
		return value
			.split(',')
			.map((param) => param.trim())
			.filter(Boolean);
	}

	function saveChanges() {
		if (!node) return;

		const trimmedName = primaryName.trim();
		if (trimmedName.length === 0) {
			return;
		}

		if (node.type === 'class') {
			updateNode({ ...node, name: trimmedName });
		} else if (node.type === 'method') {
			updateNode({
				...node,
				name: trimmedName,
				returnType: methodReturnType.trim() || 'void',
				parameters: parseParameters(methodParameters)
			});
		} else if (node.type === 'property') {
			updateNode({
				...node,
				name: trimmedName
			});
		}

		open = false;
	}
</script>

{#if node}
	<Modal bind:open>
		<h2 slot="header">
			{#if node.type === 'class'}
				Edit class node
			{:else if node.type === 'method'}
				Edit method node
			{:else if node.type === 'property'}
				Edit property node
			{:else if node.type === 'container'}
				Edit container
			{/if}
		</h2>

		<div class="space-y-4 text-sm text-slate-100">
			<div>
				<label class="mb-1 block font-semibold" for={primaryInputId}>
					{#if node.type === 'class'}
						Class name
					{:else if node.type === 'method'}
						Method name
					{:else if node.type === 'property'}
						Property name
					{:else if node.type === 'container'}
						Container name
					{/if}
				</label>
				<input
					class="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2"
					type="text"
					bind:value={primaryName}
					id={primaryInputId}
				/>
			</div>

			{#if node.type === 'method'}
				<div>
					<label class="mb-1 block font-semibold" for={returnTypeInputId}>Return type</label>
					<input
						class="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2"
						type="text"
						bind:value={methodReturnType}
						id={returnTypeInputId}
					/>
				</div>
				<div>
					<label class="mb-1 block font-semibold" for={parameterInputId}
						>Parameters (comma separated)</label
					>
					<input
						class="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2"
						type="text"
						bind:value={methodParameters}
						placeholder="arg: string, another: number"
						id={parameterInputId}
					/>
				</div>
			{:else if node.type === 'property'}
				<div>
					<label class="mb-1 block font-semibold" for={propertyTypeInputId}>Property type</label>
					<input
						class="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2"
						type="text"
						bind:value={propertyType}
						id={propertyTypeInputId}
					/>
				</div>
			{:else if node.type === 'class'}
				<div class="rounded border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300">
					<div class="mb-1 font-semibold text-slate-200">Methods</div>
					{#if node.methods.length === 0}
						<div class="italic text-slate-500">No methods yet</div>
					{:else}
						<ul class="list-disc pl-4">
							{#each node.methods as method}
								<li>{method.name}()</li>
							{/each}
						</ul>
					{/if}
					<div class="mt-3 mb-1 font-semibold text-slate-200">Properties</div>
					{#if node.properties.length === 0}
						<div class="italic text-slate-500">No properties yet</div>
					{:else}
						<ul class="list-disc pl-4">
							{#each node.properties as property}
								<li>{property.name}</li>
							{/each}
						</ul>
					{/if}
				</div>
			{:else if node.type === 'container'}
				<div class="rounded border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300">
					<div class="mb-1 font-semibold text-slate-200">Children ({node.children.length})</div>
					{#if node.children.length === 0}
						<div class="italic text-slate-500">No children yet</div>
					{:else}
						<ul class="list-disc pl-4">
							{#each node.children as child}
								<li>{child.name} ({child.type})</li>
							{/each}
						</ul>
					{/if}
				</div>
			{/if}

			<div class="flex justify-end gap-2">
				<ButtonStandard variant="secondary" on:click={() => (open = false)}>Cancel</ButtonStandard>
				<ButtonStandard on:click={saveChanges}>Save changes</ButtonStandard>
			</div>
		</div>
	</Modal>
{/if}