import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { TabItem } from './Tabs.types';
import { useTabs } from './useTabs';

const items: TabItem[] = [
	{ id: 'a', label: 'Tab A', content: null },
	{ id: 'b', label: 'Tab B', content: null },
	{ id: 'c', label: 'Tab C', content: null, disabled: true },
];

describe('useTabs', () => {
	it('selects the first tab by default', () => {
		const { result } = renderHook(() => useTabs({ items }));
		expect(result.current.activeId).toBe('a');
	});

	it('respects defaultValue', () => {
		const { result } = renderHook(() => useTabs({ items, defaultValue: 'b' }));
		expect(result.current.activeId).toBe('b');
	});

	it('updates the active tab when select is called', () => {
		const { result } = renderHook(() => useTabs({ items }));

		act(() => result.current.select('b'));
		expect(result.current.activeId).toBe('b');
	});

	it('does not select a disabled tab', () => {
		const { result } = renderHook(() => useTabs({ items }));

		act(() => result.current.select('c'));
		expect(result.current.activeId).toBe('a');
	});

	it('calls onChange when the active tab changes', () => {
		const onChange = vi.fn();
		const { result } = renderHook(() => useTabs({ items, onChange }));

		act(() => result.current.select('b'));
		expect(onChange).toHaveBeenCalledWith('b');
	});

	it('uses the controlled value when provided', () => {
		const { result, rerender } = renderHook(
			({ value }) => useTabs({ items, value }),
			{ initialProps: { value: 'a' } }
		);

		expect(result.current.activeId).toBe('a');

		rerender({ value: 'b' });
		expect(result.current.activeId).toBe('b');
	});

	it('does not update internal state when controlled', () => {
		const onChange = vi.fn();
		const { result } = renderHook(() =>
			useTabs({ items, value: 'a', onChange })
		);

		act(() => result.current.select('b'));
		expect(result.current.activeId).toBe('a');
		expect(onChange).toHaveBeenCalledWith('b');
	});
});
