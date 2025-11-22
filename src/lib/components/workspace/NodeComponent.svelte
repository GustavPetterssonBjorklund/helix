<!-- Inline tiny node component -->
<script lang="ts">
	import type { Node } from '$lib/types';
	import DraggableWrapper from './DraggableWrapper.svelte';

	export let node: Node;
	export let scale = 1;

	export let onChange: (update: Node) => void = () => {};
</script>

<DraggableWrapper
	x={node.x}
	y={node.y}
	scale={scale}
	onChange={(e) => onChange({ ...node, x: e.x, y: e.y })}
>
	<div
		class="cursor-pointer rounded bg-slate-700 px-2 py-1 text-xs text-white shadow select-none"
	>
		<slot />
	</div>
</DraggableWrapper>
