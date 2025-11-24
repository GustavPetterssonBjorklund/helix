<script lang="ts">
	import Modal from '$lib/components/generic/Modal.svelte';
	import ButtonStandard from '$lib/components/generic/ButtonStandard.svelte';
	import type { AnyNode } from '$lib/types';
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
	$: if (node?.kind === 'class') {
		primaryName = node.className;
	} else if (node?.kind === 'method') {
		primaryName = node.methodName;
		methodReturnType = node.returnType;
		methodParameters = node.parameters.join(', ');
	} else if (node?.kind === 'property') {
		primaryName = node.propertyName;
		propertyType = node.propertyType;
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

		if (node.kind === 'class') {
			updateNode({ ...node, className: trimmedName });
		} else if (node.kind === 'method') {
			updateNode({
				...node,
				methodName: trimmedName,
				returnType: methodReturnType.trim() || 'void',
				parameters: parseParameters(methodParameters)
			});
		} else if (node.kind === 'property') {
			updateNode({
				...node,
				propertyName: trimmedName,
				propertyType: propertyType.trim() || 'string'
			});
		}

		open = false;
	}
</script>

{#if node}
	<Modal bind:open>
		<h2 slot="header">
			{#if node.kind === 'class'}
				Edit class node
			{:else if node.kind === 'method'}
				Edit method node
			{:else if node.kind === 'property'}
				Edit property node
			{/if}
		</h2>

		<div class="space-y-4 text-sm text-slate-100">
			<div>
				<label class="mb-1 block font-semibold" for={primaryInputId}>
					{#if node.kind === 'class'}
						Class name
					{:else if node.kind === 'method'}
						Method name
					{:else}
						Property name
					{/if}
				</label>
				<input
					class="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2"
					type="text"
					bind:value={primaryName}
					id={primaryInputId}
				/>
			</div>

			{#if node.kind === 'method'}
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
			{:else if node.kind === 'property'}
				<div>
					<label class="mb-1 block font-semibold" for={propertyTypeInputId}>Property type</label>
					<input
						class="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2"
						type="text"
						bind:value={propertyType}
						id={propertyTypeInputId}
					/>
				</div>
			{:else if node.kind === 'class'}
				<div class="rounded border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300">
					<div class="mb-1 font-semibold text-slate-200">Methods</div>
					{#if node.methods.length === 0}
						<div class="italic text-slate-500">No methods yet</div>
					{:else}
						<ul class="list-disc pl-4">
							{#each node.methods as method}
								<li>{method.methodName}()</li>
							{/each}
						</ul>
					{/if}
					<div class="mt-3 mb-1 font-semibold text-slate-200">Properties</div>
					{#if node.properties.length === 0}
						<div class="italic text-slate-500">No properties yet</div>
					{:else}
						<ul class="list-disc pl-4">
							{#each node.properties as property}
								<li>{property.propertyName}</li>
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
