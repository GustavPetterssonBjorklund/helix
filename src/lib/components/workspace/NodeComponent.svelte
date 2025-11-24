<script lang="ts">
    import DraggableWrapper from './DraggableWrapper.svelte';
    import type { AnyNode } from '$lib/types';
    
    export let node: AnyNode;
    export let scale = 1;
    export let onChange: (node: AnyNode) => void;
    
	export let doubleClick: () => void = () => {};

	function handleDoubleClick() {
		doubleClick();
	}

    $: x = node.x;
    $: y = node.y;
</script>

<DraggableWrapper
    {x}
    {y}
    {scale}
    onChange={(e: { x: number; y: number }) => onChange({ ...node, x: e.x, y: e.y })}
    onDoubleClick={handleDoubleClick}
>
    <div
        class="cursor-pointer rounded bg-slate-700 px-2 py-1 text-xs text-white shadow"
        role="button"
		tabindex="0"
    >
        <slot />
    </div>
</DraggableWrapper>
