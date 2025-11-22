<script lang="ts">
	import ButtonStandard from '$lib/components/generic/ButtonStandard.svelte';
	import Modal from '$lib/components/generic/Modal.svelte';
	import * as googleState from '$lib/stores/googleState';

	export let loading = false;

	let showModal = false;

	const handleClick = () => {
		showModal = true;
	};

</script>

<ButtonStandard on:click={handleClick} disabled={loading} variant="secondary">
	{#if loading}
		Working...
	{:else}
		Set Drive File
	{/if}
</ButtonStandard>

{#if showModal}
	<Modal bind:open={showModal}>
		<h2 slot="header">Create Node</h2>
	</Modal>
{/if}
