import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useControllableBoolean } from './useControllableBoolean';

describe('useControllableBoolean', () => {
	it('starts false by default', () => {
		const { result } = renderHook(() => useControllableBoolean());

		expect(result.current.value).toBe(false);
	});

	it('toggles the uncontrolled value', () => {
		const onChange = vi.fn();
		const { result } = renderHook(() => useControllableBoolean({ onChange }));

		act(() => result.current.toggle());

		expect(result.current.value).toBe(true);
		expect(onChange).toHaveBeenCalledWith(true);
	});

	it('respects the controlled value', () => {
		const { result } = renderHook(() =>
			useControllableBoolean({ value: true })
		);

		expect(result.current.value).toBe(true);
	});
});
