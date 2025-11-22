<script lang="ts">
    import NodeComponent from "./NodeComponent.svelte";
    import ClassNodeComponent from "./ClassNode.svelte";
    import MethodNodeComponent from "./MethodNode.svelte";
    import PropertyNodeComponent from "./PropertyNode.svelte";

    import type { AnyNode } from "$lib/types";

    export let node: AnyNode;
    export let scale = 1;
    export let onChange = (_n: AnyNode) => {};
</script>

<NodeComponent {node} {scale} {onChange}>
    {#if node.kind === "class"}
        <ClassNodeComponent {node} />
    {:else if node.kind === "method"}
        <MethodNodeComponent {node} />
    {:else if node.kind === "property"}
        <PropertyNodeComponent {node} />
    {/if}
</NodeComponent>
