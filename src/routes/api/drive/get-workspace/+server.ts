import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals, url }) => {
	const session = await locals.auth();
	if (!session?.accessToken) return new Response('Unauthorized', { status: 401 });

	const { fileId } = Object.fromEntries(new URLSearchParams(url.search)) as {
		fileId: string;
	};

	const driveRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
		headers: {
			Authorization: `Bearer ${session.accessToken}`
		}
	});

	if (!driveRes.ok) {
		const err = await driveRes.text();
		console.error('Drive error:', err);
		return new Response('Failed to load workspace from Drive', {
			status: driveRes.status
		});
	}

	const text = await driveRes.text();

	let state;
	try {
		state = JSON.parse(text); // your file should be JSON like { containers: [...], nodes: {...} }
	} catch (e) {
		console.error('Invalid JSON in Drive workspace file:', e, text);
		return new Response('Workspace file is not valid JSON', { status: 500 });
	}

	// Important: return an object with `state` for the front-end
	return json({ state });
};
