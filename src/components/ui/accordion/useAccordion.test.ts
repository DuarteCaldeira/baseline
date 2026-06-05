import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

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
});
