import { writable } from 'svelte/store';

export const googleLoading = writable(false);
export const googleError = writable<string | null>(null);
export const googleDriveFileId = writable<string | null>(null);

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

export function setGoogleFileId(fileId: string) {
	googleDriveFileId.set(fileId);
}

export const onGoogleStateError = writable<(message: string) => void>(throwGoogleStateError);
export const onGoogleFileIdChange = writable<(fileId: string) => void>(setGoogleFileId);
