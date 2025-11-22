<script lang="ts">
	import type { Container } from '$lib/types';

	export let container: Container;
	export let scale = 1;

	export let onChange: (update: {
		id: string;
		x: number;
		y: number;
		width: number;
		height: number;
	}) => void = () => {};

	const MIN_WIDTH = 150;
	const MIN_HEIGHT = 100;

	let dragging = false;
	let resizing = false;

	let startX = 0;
	let startY = 0;
	let startLeft = 0;
	let startTop = 0;
	let startWidth = 0;
	let startHeight = 0;

	function startDrag(event: PointerEvent) {
		dragging = true;
		startX = event.clientX;
		startY = event.clientY;
		startLeft = container.x;
		startTop = container.y;

		// Track movement globally while dragging
		window.addEventListener('pointermove', onPointerMove);
		window.addEventListener('pointerup', endPointer);
		window.addEventListener('pointercancel', endPointer);

		event.stopPropagation();
		event.preventDefault();
	}

	function startResize(event: PointerEvent) {
		resizing = true;
		startX = event.clientX;
		startY = event.clientY;
		startWidth = container.width;
		startHeight = container.height;

		window.addEventListener('pointermove', onPointerMove);
		window.addEventListener('pointerup', endPointer);
		window.addEventListener('pointercancel', endPointer);

		event.stopPropagation();
		event.preventDefault();
	}

	function onPointerMove(event: PointerEvent) {
		if (!dragging && !resizing) return;

		const dx = event.clientX - startX;
		const dy = event.clientY - startY;
		const effectiveScale = scale === 0 ? 1 : scale;

		if (dragging) {
			const x = startLeft + dx / effectiveScale;
			const y = startTop + dy / effectiveScale;

			onChange({
				id: container.id,
				x,
				y,
				width: container.width,
				height: container.height
			});
		} else if (resizing) {
			const width = Math.max(MIN_WIDTH, startWidth + dx / effectiveScale);
			const height = Math.max(MIN_HEIGHT, startHeight + dy / effectiveScale);

			onChange({
				id: container.id,
				x: container.x,
				y: container.y,
				width,
				height
			});
		}

		event.preventDefault();
	}

	function endPointer(event: PointerEvent) {
		if (!dragging && !resizing) return;

		dragging = false;
		resizing = false;

		window.removeEventListener('pointermove', onPointerMove);
		window.removeEventListener('pointerup', endPointer);
		window.removeEventListener('pointercancel', endPointer);

		event.preventDefault();
	}
</script>

<div
	class="absolute overflow-visible rounded-xl border border-slate-700 bg-slate-900/90 shadow-md"
	style={`left:${container.x}px; top:${container.y}px; width:${container.width}px; height:${container.height}px;`}
>
	<!-- Only the header starts container drag -->
	<div
		class="flex h-8 cursor-move items-center justify-between border-b border-slate-800 bg-slate-900/80 px-3 text-xs text-slate-200 select-none"
		on:pointerdown={startDrag}
	>
		<span class="truncate">{container.title ?? 'Container'}</span>
	</div>

	<!-- Slot content: inner draggables live here and are free to handle their own pointer events -->
	<div class="relative h-[calc(100%-2rem)] w-full">
		<slot />
	</div>

	<!-- Resize handle -->
	<div
		class="absolute right-0 bottom-0 flex h-4 w-4 cursor-se-resize items-center justify-center select-none"
		on:pointerdown={startResize}
	>
		<div class="h-3 w-3 border-r border-b border-slate-500"></div>
	</div>
</div>
