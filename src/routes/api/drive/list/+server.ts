export const GET = async ({ locals }) => {
	const session = await locals.auth();
	if (!session?.accessToken) return new Response('Unauthorized', { status: 401 });

	const response = await fetch('https://www.googleapis.com/drive/v3/files', {
		headers: {
			Authorization: `Bearer ${session.accessToken}`
		}
	});

	return new Response(await response.text(), { status: response.status });
};
