import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('returns the initial value immediately', () => {
		const { result } = renderHook(() => useDebounce('hello', 300));

		expect(result.current).toBe('hello');
	});

	it('updates after the delay elapses', () => {
		const { result, rerender } = renderHook(
			({ value, delay }) => useDebounce(value, delay),
			{ initialProps: { value: 'a', delay: 300 } }
		);

		rerender({ value: 'ab', delay: 300 });

		expect(result.current).toBe('a');

		act(() => {
			vi.advanceTimersByTime(300);
		});

		expect(result.current).toBe('ab');
	});

	it('resets the timer when the value changes before the delay', () => {
		const { result, rerender } = renderHook(
			({ value }) => useDebounce(value, 300),
			{ initialProps: { value: 'a' } }
		);

		rerender({ value: 'ab' });

		act(() => {
			vi.advanceTimersByTime(200);
		});

		rerender({ value: 'abc' });

		act(() => {
			vi.advanceTimersByTime(200);
		});

		expect(result.current).toBe('a');

		act(() => {
			vi.advanceTimersByTime(100);
		});

		expect(result.current).toBe('abc');
	});

	it('uses the latest delay when delayMs changes', () => {
		const { result, rerender } = renderHook(
			({ value, delay }) => useDebounce(value, delay),
			{ initialProps: { value: 'a', delay: 300 } }
		);

		rerender({ value: 'b', delay: 100 });

		act(() => {
			vi.advanceTimersByTime(100);
		});

		expect(result.current).toBe('b');
	});
});
