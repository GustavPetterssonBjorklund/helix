<script lang="ts">
	import { onMount } from 'svelte';

	export let open: boolean = false;
	export let showCloseButton: boolean = true;
	export let closeOnBackdropClick: boolean = true;
	export let closeOnEscape: boolean = true;

	function closeModal() {
		open = false;
	}

	function handleBackdropClick(event: MouseEvent) {
		if (closeOnBackdropClick && event.target === event.currentTarget) {
			closeModal();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (closeOnEscape && event.key === 'Escape') {
			closeModal();
		}
	}

	// Prevent body scroll when modal is open
	function setBodyScrollLock(lock: boolean) {
		if (typeof document !== 'undefined') {
			document.body.style.overflow = lock ? 'hidden' : '';
		}
	}

	onMount(() => {
		// Prevent body scroll when modal is open
		setBodyScrollLock(true);

		return () => setBodyScrollLock(false);
	});

	$: setBodyScrollLock(open);
</script>

<svelte:window on:keydown={handleKeydown} />
{#if open}
	<div
		class="modal-backdrop"
		on:click={handleBackdropClick}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		tabindex="0"
		on:keydown={() => null}
	>
		<div class="modal-content">
			<div class="modal-header">
				<h2 id="modal-title" class="modal-title">
					<slot name="header"></slot>
				</h2>
				{#if showCloseButton}
					<button class="close-button" on:click={closeModal} aria-label="Stäng dialog">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					</button>
				{/if}
			</div>
			<div class="modal-body">
				<slot></slot>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 50;
		animation: fadeIn 0.2s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.modal-content {
		background-color: #1f2937;
		padding: 0;
		border-radius: 0.5rem;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
		width: 90%;
		max-width: 500px;
		color: #f9fafb;
		position: relative;
		animation: slideUp 0.3s ease-out;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
	}

	.modal-header {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		padding: 1rem;
		border-bottom: 1px solid #374151;
		position: relative;
	}

	.modal-title {
		grid-column: 2;
		text-align: center;
		font-size: 1.25rem;
		font-weight: 600;
		color: #f9fafb;
	}

	.modal-body {
		padding: 1.5rem;
		overflow-y: auto;
	}

	@keyframes slideUp {
		from {
			transform: translateY(20px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.close-button {
		grid-column: 3;
		justify-self: end;
		background: none;
		border: none;
		color: #9ca3af;
		cursor: pointer;
		padding: 0.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.25rem;
		transition: all 0.2s;
	}

	.close-button:hover {
		color: #f9fafb;
		background-color: rgba(255, 255, 255, 0.1);
	}

	.close-button:focus {
		outline: 2px solid #3b82f6;
		outline-offset: 2px;
	}
</style>
