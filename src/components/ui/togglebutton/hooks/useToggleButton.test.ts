import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useToggleButton } from './useToggleButton';

describe('useToggleButton', () => {
	it('starts unpressed by default', () => {
		const { result } = renderHook(() => useToggleButton({}));

		expect(result.current.pressed).toBe(false);
	});

	it('toggles pressed state in standalone mode', () => {
		const { result } = renderHook(() => useToggleButton({}));

		act(() => {
			result.current.toggle();
		});

		expect(result.current.pressed).toBe(true);

		act(() => {
			result.current.toggle();
		});

		expect(result.current.pressed).toBe(false);
	});

	it('calls onPressedChange when toggled', () => {
		const onPressedChange = vi.fn();
		const { result } = renderHook(() => useToggleButton({ onPressedChange }));

		act(() => {
			result.current.toggle();
		});

		expect(onPressedChange).toHaveBeenCalledWith(true);
	});

	it('does not toggle when disabled', () => {
		const onPressedChange = vi.fn();
		const { result } = renderHook(() =>
			useToggleButton({ disabled: true, onPressedChange })
		);

		act(() => {
			result.current.toggle();
		});

		expect(result.current.pressed).toBe(false);
		expect(onPressedChange).not.toHaveBeenCalled();
	});

	it('uses the controlled pressed value', () => {
		const { result } = renderHook(() => useToggleButton({ pressed: true }));

		expect(result.current.pressed).toBe(true);
	});
});
