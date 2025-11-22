<script lang="ts">
    export let x = 0;
    export let y = 0;
    export let scale = 1;

    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    export let onChange: (update: { x: number; y: number }) => void = () => {};

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
        x += dx / effectiveScale;
        y += dy / effectiveScale;

        lastX = event.clientX;
        lastY = event.clientY;

        event.stopPropagation();
        onChange({ x, y });
    }

    function onPointerUp(event: PointerEvent) {
        dragging = false;

        const target = event.currentTarget as HTMLElement;
        target.releasePointerCapture(event.pointerId);
        onChange({ x, y });
    }    
</script>

<div
    class="absolute"
    style={`transform: translate(${x}px, ${y}px);`}
    on:pointerdown={onPointerDown}
    on:pointermove={onPointerMove}
    on:pointerup={onPointerUp}
>
    <slot />
</div>
