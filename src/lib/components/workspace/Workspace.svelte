<script lang="ts">
	export let scale = 1;
	export let x = 0;
	export let y = 0;

	let isPanning = false;
	let lastX = 0;
	let lastY = 0;

	const MIN_SCALE = 0.1;
	const MAX_SCALE = 10;
	const BASE_GRID_SIZE = 40;

	// Reactive grid properties
	$: gridSize = BASE_GRID_SIZE * scale;
	$: gridOffsetX = x;
	$: gridOffsetY = y;

	function onPointerDown(event: PointerEvent) {
		isPanning = true;
		lastX = event.clientX;
		lastY = event.clientY;
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
	}

	function onPointerMove(event: PointerEvent) {
		if (!isPanning) return;
		const dx = event.clientX - lastX;
		const dy = event.clientY - lastY;

		x += dx;
		y += dy;
		lastX = event.clientX;
		lastY = event.clientY;
	}

	function onPointerUp(event: PointerEvent) {
		isPanning = false;
		(event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
	}

	function onWheel(event: WheelEvent) {
		event.preventDefault();

		const zoomSpeed = 0.001;
		const scaleAmount = -event.deltaY * zoomSpeed;
		const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale + scaleAmount));

		// Zoom towards cursor
		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
		const offsetX = event.clientX - rect.left;
		const offsetY = event.clientY - rect.top;

		const scaleRatio = newScale / scale;

		x = offsetX - (offsetX - x) * scaleRatio;
		y = offsetY - (offsetY - y) * scaleRatio;

		scale = newScale;
	}
</script>

<div
	class="relative h-full w-full touch-none overflow-hidden bg-black"
	on:pointerdown={onPointerDown}
	on:pointermove={onPointerMove}
	on:pointerup={onPointerUp}
	on:pointercancel={onPointerUp}
	on:wheel={onWheel}
>
	<!-- Dotted grid layer -->
	<div
		class="bg-dots pointer-events-none absolute inset-0"
		style={`
			background-size: ${gridSize}px ${gridSize}px;
			background-position: ${gridOffsetX}px ${gridOffsetY}px;
            min-height: 400px;
		`}
	></div>

	<!-- Content layer -->
	<div
		class="absolute inset-0 origin-top-left"
		style={`transform: translate(${x}px, ${y}px) scale(${scale});`}
	>
		<div class="p-8">
			<slot {scale} {x} {y} />
		</div>
	</div>
</div>

<style>
	.bg-dots {
		background-image: radial-gradient(
			circle,
			rgba(255, 255, 255, 0.18) 0,
			/* full dot color */ rgba(255, 255, 255, 0.18) 2px,
			/* sharp edge */ transparent 2px
		);
	}
</style>
