import {writable} from 'svelte/store';
import type {Writable} from 'svelte/store';

export const stringInput: Writable<string> = writable('');
export const isDark: Writable<boolean> = writable(true);
export const theme: Writable<string> = writable('monokai');
