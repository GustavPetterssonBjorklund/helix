<script lang="ts">
    import type { PropertyNode } from "$lib/types";
    export let node: PropertyNode;
</script>

<div class="text-xs text-white">
    {node.propertyName}: {node.propertyType}
</div>
