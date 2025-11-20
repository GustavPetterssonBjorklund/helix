import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/core/providers/google';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';

export const { handle, signIn, signOut } = SvelteKitAuth({
	providers: [
		Google({
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			authorization: {
				params: {
					scope: ['openid', 'email', 'profile', 'https://www.googleapis.com/auth/drive.file'].join(
						' '
					)
					// you can add these later if drive.file works:
					// access_type: 'offline',
					// prompt: 'consent'
				}
			}
		})
	],
	callbacks: {
		async jwt({ token, account }) {
			if (account) {
				token.accessToken = account.access_token;
			}
			return token;
		},
		async session({ session, token }) {
			session.accessToken = token.accessToken;
			return session;
		}
	}
});
