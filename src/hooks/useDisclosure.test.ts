import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useDisclosure } from './useDisclosure';

describe('useDisclosure', () => {
	it('starts closed by default', () => {
		const { result } = renderHook(() => useDisclosure());
		expect(result.current.isOpen).toBe(false);
	});

	it('starts open when defaultOpen is true', () => {
		const { result } = renderHook(() => useDisclosure(true));
		expect(result.current.isOpen).toBe(true);
	});

	it('open() sets isOpen to true', () => {
		const { result } = renderHook(() => useDisclosure());
		act(() => result.current.open());
		expect(result.current.isOpen).toBe(true);
	});

	it('close() sets isOpen to false', () => {
		const { result } = renderHook(() => useDisclosure(true));
		act(() => result.current.close());
		expect(result.current.isOpen).toBe(false);
	});

	it('toggle() flips isOpen from false to true', () => {
		const { result } = renderHook(() => useDisclosure());
		act(() => result.current.toggle());
		expect(result.current.isOpen).toBe(true);
	});

	it('toggle() flips isOpen from true to false', () => {
		const { result } = renderHook(() => useDisclosure(true));
		act(() => result.current.toggle());
		expect(result.current.isOpen).toBe(false);
	});

	it('toggle() can be called multiple times consecutively', () => {
		const { result } = renderHook(() => useDisclosure());
		act(() => result.current.toggle());
		act(() => result.current.toggle());
		act(() => result.current.toggle());
		expect(result.current.isOpen).toBe(true);
	});

	it('open() is a stable reference', () => {
		const { result, rerender } = renderHook(() => useDisclosure());
		const first = result.current.open;
		rerender();
		expect(result.current.open).toBe(first);
	});

	it('close() is a stable reference', () => {
		const { result, rerender } = renderHook(() => useDisclosure());
		const first = result.current.close;
		rerender();
		expect(result.current.close).toBe(first);
	});
});
