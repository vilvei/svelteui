import { writable } from 'svelte/store';

export const api = writable('');
export const accessToken = writable('');
// has only the payload part of the token.
export const payloadToken = writable('');
export const auth = writable({});
