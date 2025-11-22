import { writable } from 'svelte/store';

export const googleLoading = writable(false);
export const googleError = writable<string | null>(null);

export type GoogleUser = {
	getId: () => string;
	getBasicProfile: () => {
		getName: () => string;
		getEmail: () => string;
		getImageUrl: () => string;
	};
};

export const googleUser = writable<GoogleUser | null>(null);

export function throwGoogleStateError(message: string) {
	googleError.set(message);
	throw new Error(message);
}

// Bindable callback for when an error occurs
export const onGoogleStateError: (message: string) => void = throwGoogleStateError;
