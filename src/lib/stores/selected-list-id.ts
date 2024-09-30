import { writable } from 'svelte/store';

const selectedListId = writable<string | null>(null);

export default selectedListId;
