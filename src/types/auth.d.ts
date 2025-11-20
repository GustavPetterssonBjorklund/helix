// src/types/auth.d.ts
import type { DefaultSession } from '@auth/core/types';

declare module '@auth/core/types' {
	interface Session extends DefaultSession {
		accessToken?: string;
	}
}

declare module '@auth/core/jwt' {
	interface JWT {
		accessToken?: string;
		refreshToken?: string;
		expiresAt?: number;
	}
}
