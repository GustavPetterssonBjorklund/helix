<script lang="ts">
    import type { ClassNode } from "$lib/types";
    export let node: ClassNode;
</script>

<div class="p-2 text-white">
    <div class="font-bold">{node.className}</div>
    <div class="mt-1 space-y-1">
        <div class="underline">Methods:</div>
        {#each node.methods as method}
            <div class="ml-2 text-xs">{method.methodName}()</div>
        {/each}
    </div>
    <div class="mt-1 space-y-1">
        <div class="underline">Properties:</div>
        {#each node.properties as property}
            <div class="ml-2 text-xs">{property.propertyName}</div>
        {/each}
    </div>
</div>
