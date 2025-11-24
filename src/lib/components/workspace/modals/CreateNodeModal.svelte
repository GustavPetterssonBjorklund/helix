<script lang="ts">
	import type { AnyNode, ClassNode } from '$lib/types';
	import Modal from '$lib/components/generic/Modal.svelte';
	import ButtonStandard from '$lib/components/generic/ButtonStandard.svelte';
	import { createNode } from '$lib/stores/nodes';

	export let open = false;

	export let initialX = 0;
	export let initialY = 0;

	// Type to select which kind of node to create, and which options to show
	let type: AnyNode['kind'] = 'class';

	// Top level
	let className = '';
	let methodName = '';
	let propertyName = '';

	function submitNode() {
		let newNode: AnyNode;

		if (type === 'class') {
			newNode = {
				id: crypto.randomUUID(),
				kind: 'class',
				className,
				methods: [],
				properties: [],
				x: initialX,
				y: initialY
			} as ClassNode;
		} else if (type === 'method') {
			newNode = {
				id: crypto.randomUUID(),
				kind: 'method',
				methodName,
				parameters: [],
				returnType: 'void',
				x: initialX,
				y: initialY
			};
		} else if (type === 'property') {
			newNode = {
				id: crypto.randomUUID(),
				kind: 'property',
				propertyName,
				propertyType: 'string',
				x: initialX,
				y: initialY
			};
		} else {
			return;
		}

		createNode(newNode);
		open = false;
	}
</script>

<Modal bind:open>
	<!-- Modal title -->
	<h2 slot="header">Create Node</h2>

	<!-- Modal content -->
	<div class="bg-dark-800">
		<label for="node-type" class="mb-2 block font-medium">Node Type:</label>
		<select
			id="node-type"
			bind:value={type}
			class="w-full rounded border border-gray-700 bg-gray-900 p-2 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
		>
			<option value="class">Class</option>
			<option value="method">Method</option>
			<option value="property">Property</option>
		</select>

		{#if type === 'class'}
			<div class="mt-4">
				<label for="class-name" class="mb-2 block font-medium">Class Name:</label>
				<input
					type="text"
					id="class-name"
					bind:value={className}
					class="w-full rounded border border-gray-700 bg-gray-900 p-2 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				/>
			</div>
		{:else if type === 'method'}
			<div class="mt-4">
				<label for="method-name" class="mb-2 block font-medium">Method Name:</label>
				<input
					type="text"
					id="method-name"
					bind:value={methodName}
					class="w-full rounded border border-gray-700 bg-gray-900 p-2 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				/>
			</div>
		{:else if type === 'property'}
			<div class="mt-4">
				<label for="property-name" class="mb-2 block font-medium">Property Name:</label>
				<input
					type="text"
					id="property-name"
					bind:value={propertyName}
					class="w-full rounded border border-gray-700 bg-gray-900 p-2 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				/>
			</div>
		{/if}
		<ButtonStandard class="mt-6 w-full" on:click={submitNode}>Create Node</ButtonStandard>
	</div>
</Modal>
