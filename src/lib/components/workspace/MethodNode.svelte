<script lang="ts">
    import type { MethodNode } from "$lib/types";
    export let node: MethodNode;
</script>

<div class="text-xs text-white">
    {node.methodName}({node.parameters.join(", ")}): {node.returnType}
</div>
