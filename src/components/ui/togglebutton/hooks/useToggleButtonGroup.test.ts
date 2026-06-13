import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useToggleButtonGroupState } from './useToggleButtonGroup';

describe('useToggleButtonGroupState', () => {
	it('selects a single value in single mode', () => {
		const onChange = vi.fn();
		const { result } = renderHook(() =>
			useToggleButtonGroupState({ type: 'single', onChange })
		);

		act(() => result.current.select('left'));

		expect(result.current.isSelected('left')).toBe(true);
		expect(result.current.isSelected('right')).toBe(false);
		expect(onChange).toHaveBeenCalledWith('left');
	});

	it('replaces the selected value in single mode', () => {
		const { result } = renderHook(() =>
			useToggleButtonGroupState({
				type: 'single',
				defaultValue: 'left',
			})
		);

		act(() => result.current.select('right'));

		expect(result.current.isSelected('left')).toBe(false);
		expect(result.current.isSelected('right')).toBe(true);
	});

	it('toggles values independently in multiple mode', () => {
		const onChange = vi.fn();
		const { result } = renderHook(() =>
			useToggleButtonGroupState({ type: 'multiple', onChange })
		);

		act(() => result.current.select('bold'));
		act(() => result.current.select('italic'));

		expect(result.current.isSelected('bold')).toBe(true);
		expect(result.current.isSelected('italic')).toBe(true);
		expect(onChange).toHaveBeenLastCalledWith(['bold', 'italic']);
	});

	it('deselects a value when selected again in multiple mode', () => {
		const { result } = renderHook(() =>
			useToggleButtonGroupState({
				type: 'multiple',
				defaultValue: ['bold', 'italic'],
			})
		);

		act(() => result.current.select('bold'));

		expect(result.current.isSelected('bold')).toBe(false);
		expect(result.current.isSelected('italic')).toBe(true);
	});

	it('uses the controlled value when provided', () => {
		const { result } = renderHook(() =>
			useToggleButtonGroupState({
				type: 'single',
				value: 'center',
			})
		);

		expect(result.current.isSelected('center')).toBe(true);
		expect(result.current.isSelected('left')).toBe(false);
	});
});
