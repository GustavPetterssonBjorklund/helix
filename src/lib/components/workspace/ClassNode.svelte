<script lang="ts">
    import type { ClassNode } from "$lib/types";
    export let node: ClassNode;
</script>

<div class="p-2 text-white">
    <div class="font-bold">{node.className}</div>
</div>
