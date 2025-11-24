<script lang="ts">
	import type { AnyNode, ClassNode } from "$lib/types";
	import Modal from "$lib/components/generic/Modal.svelte";
	import ButtonStandard from "$lib/components/generic/ButtonStandard.svelte";
	import { createNode } from "$lib/stores/nodes";

	export let open = false;


	// Type to select which kind of node to create, and which options to show
	let type: AnyNode["kind"] = "class";

	// Top level
	let className = "";
	let methodName = "";
	let propertyName = "";

	function submitNode() {
		let newNode: AnyNode;
		if (type === "class") {
			newNode = {
				id: crypto.randomUUID(),
				kind: "class",
				className,
				methods: [],
				properties: [],
				x: 0,
				y: 0
			} as ClassNode;
		} else if (type === "method") {
			newNode = {
				id: crypto.randomUUID(),
				kind: "method",
				methodName,
				parameters: [],
				returnType: "void",
				x: 0,
				y: 0
			};
		} else if (type === "property") {
			newNode = {
				id: crypto.randomUUID(),
				kind: "property",
				propertyName,
				propertyType: "string",
				x: 0,
				y: 0
			};
		} else {
			return;
		}
		// Let store handle propagation, etc.
		createNode(newNode);
		open = false;
	}
</script>

<Modal bind:open>
	<!-- Modal title -->
	<h2 slot="header">Create Node</h2>

	<!-- Modal content -->
	<div class=bg-dark-800>
		<label for="node-type" class="block mb-2 font-medium">Node Type:</label>
		<select
			id="node-type"
			bind:value={type}
			class="w-full p-2 border border-gray-700 rounded bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
		>
			<option value="class">Class</option>
			<option value="method">Method</option>
			<option value="property">Property</option>
		</select>

		{#if type === "class"}
			<div class="mt-4">
				<label for="class-name" class="block mb-2 font-medium">Class Name:</label>
				<input
					type="text"
					id="class-name"
					bind:value={className}
					class="w-full p-2 border border-gray-700 rounded bg-gray-900 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>
		{:else if type === "method"}
			<div class="mt-4">
				<label for="method-name" class="block mb-2 font-medium">Method Name:</label>
				<input
					type="text"
					id="method-name"
					bind:value={methodName}
					class="w-full p-2 border border-gray-700 rounded bg-gray-900 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>
		{:else if type === "property"}
			<div class="mt-4">
				<label for="property-name" class="block mb-2 font-medium">Property Name:</label>
				<input
					type="text"
					id="property-name"
					bind:value={propertyName}
					class="w-full p-2 border border-gray-700 rounded bg-gray-900 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>
		{/if}
		<ButtonStandard class="mt-6 w-full" on:click={submitNode}>Create Node</ButtonStandard>
	</div>
</Modal>

