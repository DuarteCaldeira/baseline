import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useMediaQuery } from './useMediaQuery';

describe('useMediaQuery', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('returns whether the query currently matches', () => {
		vi.stubGlobal(
			'matchMedia',
			vi.fn().mockImplementation((query: string) => ({
				matches: query === '(max-width: 40rem)',
				media: query,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				dispatchEvent: vi.fn(),
			}))
		);

		const { result } = renderHook(() => useMediaQuery('(max-width: 40rem)'));

		expect(result.current).toBe(true);
	});

	it('returns false when the query does not match', () => {
		vi.stubGlobal(
			'matchMedia',
			vi.fn().mockImplementation((query: string) => ({
				matches: false,
				media: query,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				dispatchEvent: vi.fn(),
			}))
		);

		const { result } = renderHook(() => useMediaQuery('(min-width: 80rem)'));

		expect(result.current).toBe(false);
	});

	it('subscribes to query changes and updates the result', () => {
		const state = { matches: false };
		let onChange: (() => void) | undefined;

		vi.stubGlobal(
			'matchMedia',
			vi.fn().mockImplementation((query: string) => ({
				get matches() {
					return state.matches;
				},
				media: query,
				addEventListener: vi.fn((event: string, handler: () => void) => {
					if (event === 'change') onChange = handler;
				}),
				removeEventListener: vi.fn(),
				dispatchEvent: vi.fn(),
			}))
		);

		const { result } = renderHook(() => useMediaQuery('(max-width: 40rem)'));

		expect(result.current).toBe(false);

		act(() => {
			state.matches = true;
			onChange?.();
		});

		expect(result.current).toBe(true);
	});

	it('unsubscribes on unmount', () => {
		const removeEventListener = vi.fn();

		vi.stubGlobal(
			'matchMedia',
			vi.fn().mockImplementation((query: string) => ({
				matches: false,
				media: query,
				addEventListener: vi.fn(),
				removeEventListener,
				dispatchEvent: vi.fn(),
			}))
		);

		const { unmount } = renderHook(() => useMediaQuery('(max-width: 40rem)'));

		unmount();

		expect(removeEventListener).toHaveBeenCalledWith(
			'change',
			expect.any(Function)
		);
	});
});
