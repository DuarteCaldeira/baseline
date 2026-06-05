import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useMultiSelect } from './useMultiSelect';

describe('useMultiSelect', () => {
	it('starts with an empty selection by default', () => {
		const { result } = renderHook(() => useMultiSelect({}));

		expect(result.current.selectedValues).toEqual([]);
	});

	it('toggles values on and off', () => {
		const { result } = renderHook(() => useMultiSelect({}));

		act(() => result.current.toggleValue('react'));
		expect(result.current.selectedValues).toEqual(['react']);

		act(() => result.current.toggleValue('react'));
		expect(result.current.selectedValues).toEqual([]);
	});

	it('removes a single value', () => {
		const { result } = renderHook(() =>
			useMultiSelect({ defaultValue: ['react', 'typescript'] })
		);

		act(() => result.current.removeValue('react'));

		expect(result.current.selectedValues).toEqual(['typescript']);
	});

	it('calls onChange when the selection changes', () => {
		const onChange = vi.fn();
		const { result } = renderHook(() => useMultiSelect({ onChange }));

		act(() => result.current.toggleValue('react'));

		expect(onChange).toHaveBeenCalledWith(['react']);
	});
});
