<script lang="ts">
    import type { ClassNode } from "$lib/types";
    import { CodeXml, Tag } from "@lucide/svelte";
    export let node: ClassNode;
</script>

<div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-2xl overflow-hidden border border-slate-700 min-w-[240px]">
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 px-4 py-3 flex items-center justify-between">
        <div class="font-bold text-lg text-white tracking-wide">{node.name}</div>
        <div class="text-[10px] font-bold text-white bg-white/20 backdrop-blur-sm rounded px-2 py-1 uppercase tracking-wider border border-white/30">
            Class
        </div>
    </div>

    <!-- Content -->
    <div class="p-4 space-y-4">
        <!-- Methods Section -->
        <div class="space-y-2">
            <div class="flex items-center gap-2 text-sm font-semibold text-blue-300">
                <CodeXml class="w-4 h-4" />
                Methods
            </div>
            <div class="space-y-1 pl-6">
                {#if node.methods && node.methods.length > 0}
                    {#each node.methods as method}
                        <div class="text-sm text-gray-300 font-mono hover:text-blue-300 transition-colors">
                            <span class="text-purple-400">{method.name}</span><span class="text-gray-500">()</span>
                        </div>
                    {/each}
                {:else}
                    <div class="text-sm text-gray-500 italic">No methods</div>
                {/if}
            </div>
        </div>

        <!-- Properties Section -->
        <div class="space-y-2">
            <div class="flex items-center gap-2 text-sm font-semibold text-emerald-300">
                <Tag class="w-4 h-4" />
                Properties
            </div>
            <div class="space-y-1 pl-6">
                {#if node.properties && node.properties.length > 0}
                    {#each node.properties as property}
                        <div class="text-sm text-gray-300 font-mono hover:text-emerald-300 transition-colors">
                            <span class="text-cyan-400">{property.name}</span>
                        </div>
                    {/each}
                {:else}
                    <div class="text-sm text-gray-500 italic">No properties</div>
                {/if}
            </div>
        </div>
    </div>
</div>