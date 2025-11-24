<script lang="ts">
    import type { PropertyNode } from "$lib/types";
    import { Tag } from "@lucide/svelte";
    export let node: PropertyNode;
</script>

<div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-2xl overflow-hidden border border-slate-700 min-w-[200px]">
    <!-- Header -->
    <div class="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 px-4 py-3 flex items-center justify-between">
        <div class="font-bold text-lg text-white tracking-wide">{node.name}</div>
        <div class="text-[10px] font-bold text-white bg-white/20 backdrop-blur-sm rounded px-2 py-1 uppercase tracking-wider border border-white/30">
            Property
        </div>
    </div>

    <!-- Content -->
    <div class="p-4 space-y-3">
        <!-- Type Section -->
        <div class="space-y-2">
            <div class="flex items-center gap-2 text-sm font-semibold text-emerald-300">
                <Tag class="w-4 h-4" />
                Type
            </div>
            <div class="pl-6">
                <div class="text-sm text-gray-300 font-mono">
                    <span class="text-cyan-400">{node.dataType}</span>
                </div>
            </div>
        </div>
    </div>
</div>