<script lang="ts">
    export let scale = 1;
    export let x = 0;
    export let y = 0;
    export let loading = false;
    
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
        if (loading) return;
        isPanning = true;
        lastX = event.clientX;
        lastY = event.clientY;
        (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    }
    
    function onPointerMove(event: PointerEvent) {
        if (!isPanning || loading) return;
        
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
        if (loading) return;
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
    class:cursor-wait={loading}
    class:cursor-grab={!loading && !isPanning}
    class:cursor-grabbing={!loading && isPanning}
    on:pointerdown={onPointerDown}
    on:pointermove={onPointerMove}
    on:pointerup={onPointerUp}
    on:pointercancel={onPointerUp}
    on:wheel={onWheel}
>
    <!-- Dotted grid layer -->
    <div
        class="bg-dots pointer-events-none absolute inset-0"
        class:opacity-50={loading}
        style={`
            background-size: ${gridSize}px ${gridSize}px;
            background-position: ${gridOffsetX}px ${gridOffsetY}px;
            min-height: 400px;
        `}
    ></div>
    
    <!-- Content layer -->
    <div
        class="absolute inset-0 origin-top-left transition-opacity duration-200"
        class:opacity-40={loading}
        style={`transform: translate(${x}px, ${y}px) scale(${scale});`}
    >
        <div class="p-8">
            <slot {scale} {x} {y} />
        </div>
    </div>
    
    <!-- Loading overlay -->
    {#if loading}
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div class="flex flex-col items-center gap-3">
                <div class="spinner"></div>
                <span class="text-sm text-slate-400">Loading...</span>
            </div>
        </div>
    {/if}
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
    
    .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(255, 255, 255, 0.1);
        border-top-color: rgba(255, 255, 255, 0.8);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }
    
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
</style>