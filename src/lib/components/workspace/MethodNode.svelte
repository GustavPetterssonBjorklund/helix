<script lang="ts">
    import type { MethodNode } from "$lib/types";
    import { CodeXml } from "@lucide/svelte";
    export let node: MethodNode;
</script>

<div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-2xl overflow-hidden border border-slate-700 min-w-[200px]">
    <!-- Header -->
    <div class="bg-gradient-to-r from-purple-600 via-purple-500 to-violet-600 px-4 py-3 flex items-center justify-between">
        <div class="font-bold text-lg text-white tracking-wide">{node.name}</div>
        <div class="text-[10px] font-bold text-white bg-white/20 backdrop-blur-sm rounded px-2 py-1 uppercase tracking-wider border border-white/30">
            Method
        </div>
    </div>

    <!-- Content -->
    <div class="p-4 space-y-3">
        <!-- Parameters Section -->
        <div class="space-y-2">
            <div class="flex items-center gap-2 text-sm font-semibold text-purple-300">
                <CodeXml class="w-4 h-4" />
                Parameters
            </div>
            <div class="pl-6">
                {#if node.parameters && node.parameters.length > 0}
                    <div class="text-sm text-gray-300 font-mono">
                        <span class="text-gray-500">(</span>
                        {#each node.parameters as param, i}
                            <span class="text-cyan-400">{param}</span>{#if i < node.parameters.length - 1}<span class="text-gray-500">, </span>{/if}
                        {/each}
                        <span class="text-gray-500">)</span>
                    </div>
                {:else}
                    <div class="text-sm text-gray-500 italic">No parameters</div>
                {/if}
            </div>
        </div>

        <!-- Return Type Section -->
        <div class="space-y-2">
            <div class="text-sm font-semibold text-emerald-300">
                Returns
            </div>
            <div class="pl-6">
                <div class="text-sm text-gray-300 font-mono">
                    <span class="text-orange-400">{node.returnType}</span>
                </div>
            </div>
        </div>
    </div>
</div>