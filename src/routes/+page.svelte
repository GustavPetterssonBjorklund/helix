<script>
  import {signIn, signOut} from "@auth/sveltekit/client"
  import {page} from "$app/stores";



  let files = [];
  
  function createFile() {
    fetch('/api/drive/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: 'New File from SvelteKit' })
    })
    .then(response => response.json())
    .then(data => {
      console.log('File created:', data);
    })
    .catch(error => {
      console.error('Error creating file:', error);
    });
  }
  
  function getDriveFiles() {
    fetch('/api/drive/list')
      .then(response => response.json())
      .then(data => {
        files = data.files;
        console.log('Fetched files:', data);
      })
      .catch(error => {
        console.error('Error fetching files:', error);
      });
  }
</script>
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p><p>
    {#if $page.data.session}
        <span>
            <small>Signed in as</small><br/>
            <strong>{$page.data.session.user?.name ?? "User"}</strong>
        </span>
        <button on:click={() => signOut()} class="button">Sign out</button>
        <button on:click={getDriveFiles} class="button">Get Google Drive Files</button>
        <button on:click={createFile} class="button">Create Google Drive File</button>
        {#if files.length > 0}
            <h2>Your Google Drive Files:</h2>
            <ul>
                {#each files as file}
                    <li>{file.name} (ID: {file.id})</li>
                {/each}
            </ul>
        {/if}
    {:else}
        <span>You are not signed in</span>
        <button on:click={() => signIn("google")}>
            Sign In with Google
        </button>
    {/if}
</p>