import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useAccordion } from './useAccordion';

describe('useAccordion', () => {
	it('opens the default item in single mode', () => {
		const { result } = renderHook(() =>
			useAccordion({ type: 'single', defaultValue: 'a' })
		);

		expect(result.current.isOpen('a')).toBe(true);
		expect(result.current.isOpen('b')).toBe(false);
	});

	it('allows only one open item in single mode', () => {
		const { result } = renderHook(() =>
			useAccordion({ type: 'single', defaultValue: 'a' })
		);

		act(() => {
			result.current.toggle('b');
		});

		expect(result.current.isOpen('a')).toBe(false);
		expect(result.current.isOpen('b')).toBe(true);
	});

	it('allows multiple open items in multiple mode', () => {
		const { result } = renderHook(() =>
			useAccordion({ type: 'multiple', defaultValue: ['a'] })
		);

		act(() => {
			result.current.toggle('b');
		});

		expect(result.current.isOpen('a')).toBe(true);
		expect(result.current.isOpen('b')).toBe(true);
	});

	it('closes an open item when toggled again', () => {
		const { result } = renderHook(() =>
			useAccordion({ type: 'single', defaultValue: 'a' })
		);

		act(() => {
			result.current.toggle('a');
		});

		expect(result.current.isOpen('a')).toBe(false);
	});

	it('reflects controlled value without mutating internal state', () => {
		const { result, rerender } = renderHook(
			(props: { value: string }) =>
				useAccordion({ type: 'single', value: props.value }),
			{ initialProps: { value: 'a' } }
		);

		expect(result.current.isOpen('a')).toBe(true);

		act(() => {
			result.current.toggle('b');
		});

		expect(result.current.isOpen('b')).toBe(false);

		rerender({ value: 'b' });

		expect(result.current.isOpen('b')).toBe(true);
	});

	it('calls onChange with an empty string when the last panel closes in single mode', () => {
		const onChange = vi.fn();
		const { result } = renderHook(() =>
			useAccordion({ type: 'single', defaultValue: 'a', onChange })
		);

		act(() => {
			result.current.toggle('a');
		});

		expect(onChange).toHaveBeenCalledWith('');
	});

	it('calls onChange with an array in multiple mode', () => {
		const onChange = vi.fn();
		const { result } = renderHook(() =>
			useAccordion({ type: 'multiple', defaultValue: ['a'], onChange })
		);

		act(() => {
			result.current.toggle('b');
		});

		expect(onChange).toHaveBeenCalledWith(['a', 'b']);
	});
});
