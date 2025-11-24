<script lang="ts">
    import type { AnyNode, ClassNode } from '$lib/types';
    import Modal from '$lib/components/generic/Modal.svelte';
    import ButtonStandard from '$lib/components/generic/ButtonStandard.svelte';
    import { createNode } from '$lib/stores/nodes';
    import { Box, CodeXml, Tag } from '@lucide/svelte';

    export let open = false;
    export let initialX = 0;
    export let initialY = 0;

    // Type to select which kind of node to create, and which options to show
    let type: AnyNode['type'] = 'class';
    let name = '';
    let propertyType = 'string';
    let returnType = 'void';

    function submitNode() {
        let newNode: AnyNode;
        
        if (type === 'class') {
            newNode = {
                id: crypto.randomUUID(),
                type: 'class',
                name: name,
                methods: [],
                properties: [],
                x: initialX,
                y: initialY
            } as ClassNode;
        } else if (type === 'method') {
            newNode = {
                id: crypto.randomUUID(),
                type: 'method',
                name: name,
                parameters: [],
                returnType: returnType,
                x: initialX,
                y: initialY
            };
        } else if (type === 'property') {
            newNode = {
                id: crypto.randomUUID(),
                type: 'property',
                name: name,
                dataType: propertyType,
                x: initialX,
                y: initialY
            };
        } else {
            return;
        }

        createNode(newNode);
        open = false;
        
        // Reset form
        name = '';
        propertyType = 'string';
        returnType = 'void';
    }
</script>

<Modal bind:open>
    <!-- Modal title -->
    <h2 slot="header" class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Create Node</h2>

    <!-- Modal content -->
    <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-lg">
        <label for="node-type" class="mb-2 block font-semibold text-gray-200">Node Type</label>
        <select
            id="node-type"
            bind:value={type}
            class="w-full rounded-lg border-2 border-gray-700 bg-slate-800/50 p-3 text-gray-100 shadow-inner transition-all hover:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none cursor-pointer"
        >
            <option value="class">Class</option>
            <option value="method">Method</option>
            <option value="property">Property</option>
        </select>

        {#if type === 'class'}
            <div class="mt-6 space-y-4">
                <div class="relative">
                    <label for="class-name" class="mb-2 block font-semibold text-gray-200 flex items-center gap-2">
                        <Box class="w-4 h-4 text-blue-400" /> Class Name
                    </label>
                    <input
                        type="text"
                        id="class-name"
                        bind:value={name}
                        class="w-full rounded-lg border-2 border-gray-700 bg-slate-800/50 p-3 text-gray-100 placeholder-gray-500 shadow-inner transition-all hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                        placeholder="e.g., UserRepository"
                    />
                </div>
            </div>
        {:else if type === 'method'}
            <div class="mt-6 space-y-4">
                <div class="relative">
                    <label for="method-name" class="mb-2 block font-semibold text-gray-200 flex items-center gap-2">
                        <CodeXml class="w-4 h-4 text-purple-400" /> Method Name
                    </label>
                    <input
                        type="text"
                        id="method-name"
                        bind:value={name}
                        class="w-full rounded-lg border-2 border-gray-700 bg-slate-800/50 p-3 text-gray-100 placeholder-gray-500 shadow-inner transition-all hover:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none"
                        placeholder="e.g., fetchUserData"
                    />
                </div>
                <div class="relative">
                    <label for="return-type" class="mb-2 block font-semibold text-gray-200">Return Type</label>
                    <input
                        type="text"
                        id="return-type"
                        bind:value={returnType}
                        class="w-full rounded-lg border-2 border-gray-700 bg-slate-800/50 p-3 text-gray-100 placeholder-gray-500 shadow-inner transition-all hover:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none"
                        placeholder="e.g., Promise<User>, string, void"
                    />
                </div>
            </div>
        {:else if type === 'property'}
            <div class="mt-6 space-y-4">
                <div class="relative">
                    <label for="property-name" class="mb-2 block font-semibold text-gray-200 flex items-center gap-2">
                        <Tag class="w-4 h-4 text-emerald-400" /> Property Name
                    </label>
                    <input
                        type="text"
                        id="property-name"
                        bind:value={name}
                        class="w-full rounded-lg border-2 border-gray-700 bg-slate-800/50 p-3 text-gray-100 placeholder-gray-500 shadow-inner transition-all hover:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                        placeholder="e.g., userId"
                    />
                </div>
                <div class="relative">
                    <label for="property-type" class="mb-2 block font-semibold text-gray-200">Property Type</label>
                    <input
                        type="text"
                        id="property-type"
                        bind:value={propertyType}
                        class="w-full rounded-lg border-2 border-gray-700 bg-slate-800/50 p-3 text-gray-100 placeholder-gray-500 shadow-inner transition-all hover:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                        placeholder="e.g., string, number, Date"
                    />
                </div>
            </div>
        {/if}

        <ButtonStandard class="mt-8" on:click={submitNode} variant="primary" fullWidth={true}>
            <span class="font-semibold">Create Node</span>
        </ButtonStandard>
    </div>
</Modal>