<script lang="ts">
    import NodeComponent from "./NodeComponent.svelte";
    import ClassNodeComponent from "./ClassNode.svelte";
    import MethodNodeComponent from "./MethodNode.svelte";
    import PropertyNodeComponent from "./PropertyNode.svelte";

    import type { AnyNode } from "$lib/types";

    export let node: AnyNode;
    export let scale = 1;
    export let onChange = (_n: AnyNode) => {};
    export let onDoubleClick: (node: AnyNode) => void = () => {};

    function handleDoubleClick() {
        onDoubleClick(node);
    }
</script>

<NodeComponent {node} {scale} {onChange} doubleClick={handleDoubleClick}>
    {#if node.type === "class"}
        <ClassNodeComponent {node} />
    {:else if node.type === "method"}
        <MethodNodeComponent {node} />
    {:else if node.type === "property"}
        <PropertyNodeComponent {node} />
    {/if}
</NodeComponent>
