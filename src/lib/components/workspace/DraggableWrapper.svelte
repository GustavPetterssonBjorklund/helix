<script lang="ts">
    export let x = 0;
    export let y = 0;
    export let scale = 1;
    
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const DOUBLE_CLICK_DELAY = 300;
    const DOUBLE_CLICK_DISTANCE = 5;
    let lastPointerUpTime = 0;
    let lastPointerUpX = 0;
    let lastPointerUpY = 0;
    
    // Track internal position separately from props
    let internalX = x;
    let internalY = y;
    
    // Sync internal position when props change (but not while dragging)
    $: if (!dragging) {
        internalX = x;
        internalY = y;
    }
    
    export let onChange: (update: { x: number; y: number }) => void = () => {};
    export let onDoubleClick: () => void = () => {};
    
    function onPointerDown(event: PointerEvent) {
        dragging = true;
        lastX = event.clientX;
        lastY = event.clientY;
        const target = event.currentTarget as HTMLElement;
        target.setPointerCapture(event.pointerId);
        event.stopPropagation();
    }
    
    function onPointerMove(event: PointerEvent) {
        if (!dragging) return;
        const dx = event.clientX - lastX;
        const dy = event.clientY - lastY;
        const effectiveScale = scale === 0 ? 1 : scale;
        
        internalX += dx / effectiveScale;
        internalY += dy / effectiveScale;
        
        lastX = event.clientX;
        lastY = event.clientY;
        event.stopPropagation();
        onChange({ x: internalX, y: internalY });
    }
    
    function onPointerUp(event: PointerEvent) {
        dragging = false;
        const target = event.currentTarget as HTMLElement;
        target.releasePointerCapture(event.pointerId);
        onChange({ x: internalX, y: internalY });
        detectDoubleClick(event);
    }

    function detectDoubleClick(event: PointerEvent) {
        if (event.button !== 0) {
            lastPointerUpTime = 0;
            return;
        }

        const timeSinceLast = event.timeStamp - lastPointerUpTime;
        const distanceX = Math.abs(event.clientX - lastPointerUpX);
        const distanceY = Math.abs(event.clientY - lastPointerUpY);
        const isNearby = distanceX <= DOUBLE_CLICK_DISTANCE && distanceY <= DOUBLE_CLICK_DISTANCE;

        if (timeSinceLast <= DOUBLE_CLICK_DELAY && isNearby) {
            lastPointerUpTime = 0;
            onDoubleClick();
            return;
        }

        lastPointerUpTime = event.timeStamp;
        lastPointerUpX = event.clientX;
        lastPointerUpY = event.clientY;
    }
</script>

<div
    class="absolute"
    style="transform: translate({internalX}px, {internalY}px);"
    on:pointerdown={onPointerDown}
    on:pointermove={onPointerMove}
    on:pointerup={onPointerUp}
>
    <slot />
</div>
