import type { RequestHandler } from '@sveltejs/kit';
import type { WorkspaceState } from '$lib/types';

export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.auth();
	if (!session?.accessToken) return new Response('Unauthorized', { status: 401 });

	// Body from client: { state: WorkspaceState, fileId?: string }
	const { state, fileId } = (await request.json()) as {
		state: WorkspaceState;
		fileId?: string;
	};

	const metadata = {
		name: 'workspace.helix',
		mimeType: 'application/json'
	};

	const content = JSON.stringify(state, null, 2); // pretty, or just JSON.stringify(state)
	const boundary = 'multipart_boundary_' + crypto.randomUUID();

	const body =
		`--${boundary}\r\n` +
		'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
		JSON.stringify(metadata) +
		'\r\n' +
		`--${boundary}\r\n` +
		'Content-Type: application/json\r\n\r\n' +
		content +
		'\r\n' +
		`--${boundary}--`;

	const isUpdate = !!fileId;

	const method = isUpdate ? 'PATCH' : 'POST';

	const url = isUpdate
		? `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`
		: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

	const response = await fetch(url, {
		method,
		headers: {
			Authorization: `Bearer ${session.accessToken}`,
			'Content-Type': `multipart/related; boundary=${boundary}`
		},
		body
	});
	if (!response.ok)
		return new Response('Failed to save workspace to Drive', {
			status: response.status
		});

	const text = await response.text();

	return new Response(text, { status: response.status });
};
