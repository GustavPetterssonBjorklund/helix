<script lang="ts">
	import ButtonStandard from '$lib/components/generic/ButtonStandard.svelte';
	import Modal from '$lib/components/generic/Modal.svelte';
	import * as googleState from '$lib/stores/googleState';

	export let fileId: string | null = null;
	export let loading = false;
	export let session: { accessToken?: string } | null = null;

	let showModal = false;

	const handleClick = () => {
		if (!session?.accessToken) {
			googleState.googleError.set('You must be signed in to set the Drive file.');
			return;
		}
		showModal = true;
	};
</script>

<ButtonStandard on:click={handleClick} disabled={loading}>
	{#if loading}
		Working...
	{:else}
		Set Drive File
	{/if}
</ButtonStandard>

{#if showModal}
	<Modal bind:open={showModal}>
		<h2 slot="header">Set Google Drive File</h2>
		<div>
			<p>This feature is under development.</p>
		</div>
		<div>
			<ButtonStandard on:click={() => (showModal = false)}>Close</ButtonStandard>
		</div>
	</Modal>
{/if}
