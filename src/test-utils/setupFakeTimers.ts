import { afterEach, beforeEach, vi } from 'vitest';

/** Registers file- or suite-level fake timer hooks for Vitest. */
export const setupFakeTimers = () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});
};
