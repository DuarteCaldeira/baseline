import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useControllableState } from './useControllableState';

describe('useControllableState', () => {
	it('uses the default value when uncontrolled', () => {
		const { result } = renderHook(() =>
			useControllableState({ defaultValue: 'left' })
		);

		expect(result.current.value).toBe('left');
	});

	it('updates the uncontrolled value', () => {
		const onChange = vi.fn();
		const { result } = renderHook(() =>
			useControllableState({ defaultValue: 'left', onChange })
		);

		act(() => result.current.setValue('right'));

		expect(result.current.value).toBe('right');
		expect(onChange).toHaveBeenCalledWith('right');
	});

	it('uses the controlled value when provided', () => {
		const { result } = renderHook(() =>
			useControllableState({ value: 'center', defaultValue: 'left' })
		);

		expect(result.current.value).toBe('center');
	});

	it('does not mutate internal state when controlled', () => {
		const onChange = vi.fn();
		const { result, rerender } = renderHook(
			({ value }: { value: string }) =>
				useControllableState({ value, onChange }),
			{ initialProps: { value: 'left' } }
		);

		act(() => result.current.setValue('right'));

		expect(onChange).toHaveBeenCalledWith('right');
		expect(result.current.value).toBe('left');

		rerender({ value: 'right' });

		expect(result.current.value).toBe('right');
	});
});
