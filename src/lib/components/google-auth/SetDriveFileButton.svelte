<script lang="ts">
	import ButtonStandard from '$lib/components/generic/ButtonStandard.svelte';
	import Modal from '$lib/components/generic/Modal.svelte';
	import * as googleState from '$lib/stores/googleState';
	import { get } from 'svelte/store';

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

	function extractFileIdFromUrl(url: string): string | null {
		const regex = /\/d\/([a-zA-Z0-9_-]{10,})/;
		const match = url.match(regex);
		return match ? match[1] : null;
	}
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
		<h2 slot="header">Set Google Drive File</h2>
		<div class="mb-4 flex flex-col gap-4">
			<input
				type="text"
				placeholder="Enter Google Drive File ID"
				bind:value={fileId}
				class="w-full rounded border border-slate-600 bg-slate-800 p-2 text-slate-100"
			/>
			<ButtonStandard
				fullWidth={true}
				on:click={() => {
					// Extract file ID if a full URL is provided
					const extractedId = extractFileIdFromUrl(fileId || '');
					if (extractedId) {
						googleState.setGoogleFileId(extractedId);
					}
					showModal = false;
				}}
				variant="primary"
				>Submit
			</ButtonStandard>
			<ButtonStandard fullWidth={true} on:click={() => (showModal = false)} variant="secondary"
				>Close</ButtonStandard
			>
		</div>
	</Modal>
{/if}
