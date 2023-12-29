import { writable } from 'svelte/store';

const selectedListId = writable<number | null>(null);

export default selectedListId;
