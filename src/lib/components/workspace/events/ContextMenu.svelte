<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import CreateNodeModal from '../modals/CreateNodeModal.svelte';

	export let x = 0;
	export let y = 0;
	export let open = false;
	export let onClose: () => void;

	export let showCreateNodeModal = false;

	let menuEl: HTMLDivElement;

	function handleClickOutside(e: MouseEvent) {
		if (!menuEl) return;
		if (!menuEl.contains(e.target as Node)) {
			onClose?.();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose?.();
		}
	}

	onMount(() => {
		if (!browser) return;

		document.addEventListener('mousedown', handleClickOutside);
		document.addEventListener('keydown', handleKeydown);
	});

	onDestroy(() => {
		if (!browser) return;

		document.removeEventListener('mousedown', handleClickOutside);
		document.removeEventListener('keydown', handleKeydown);
	});
</script>

{#if open}
	<div
		data-context-menu="true"
		bind:this={menuEl}
		class="fixed z-50 min-w-[160px] rounded-md border border-slate-700 bg-slate-900/95 text-sm text-slate-100 shadow-lg backdrop-blur-sm"
		style={`top:${y}px;left:${x}px;`}
	>
		<button
			class="w-full px-3 py-2 text-left hover:bg-slate-800"
			on:click={() => {
				showCreateNodeModal = true;
				onClose();
			}}
		>
			Create Node
		</button>
		<button
			class="w-full px-3 py-2 text-left hover:bg-slate-800"
			on:click={() => {
				console.log('Action 2');
				onClose();
			}}
		>
			Action 2
		</button>
		<button
			class="w-full px-3 py-2 text-left text-red-300 hover:bg-red-900/40"
			on:click={() => {
				console.log('Delete');
				onClose();
			}}
		>
			Delete
		</button>
	</div>
{/if}

{#if showCreateNodeModal}
	<div data-context-menu="true">
		<CreateNodeModal
			on:close={() => (showCreateNodeModal = false)}
			bind:open={showCreateNodeModal}
		/>
	</div>
{/if}
