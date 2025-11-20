export const POST = async ({ locals }) => {
	const session = await locals.auth();
	if (!session?.accessToken) return new Response('Unauthorized', { status: 401 });

	const metadata = {
		name: 'untitled-helix.helix',
		mimetype: 'text/plain'
	};

	const content = 'Hello, Helix!';
	const boundary = 'multipart_boundary_' + crypto.randomUUID();

	const body =
		`--${boundary}\r\n` +
		'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
		JSON.stringify(metadata) +
		'\r\n' +
		`--${boundary}\r\n` +
		'Content-Type: text/plain\r\n\r\n' +
		content +
		'\r\n' +
		`--${boundary}--`;

	const response = await fetch(
		'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${session.accessToken}`,
				'Content-Type': `multipart/related; boundary=${boundary}`
			},
			body
		}
	);

	return new Response(await response.text(), { status: response.status });
};
