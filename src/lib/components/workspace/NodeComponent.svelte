<script lang="ts">
	import DraggableWrapper from './DraggableWrapper.svelte';
	import type { AnyNode } from '$lib/types';

	export let node: AnyNode;
	export let scale = 1;
	export let onChange: (node: AnyNode) => void;
</script>

<DraggableWrapper
	x={node.x}
	y={node.y}
	scale={scale}
	onChange={(e) => onChange({ ...node, x: e.x, y: e.y })}
>
	<div class="cursor-pointer rounded bg-slate-700 px-2 py-1 text-xs text-white shadow">
		<slot />
	</div>
</DraggableWrapper>
