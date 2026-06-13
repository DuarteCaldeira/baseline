import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { setupFakeTimers } from '@/test-utils/setupFakeTimers';

import { useTooltip } from './useTooltip';

setupFakeTimers();

describe('useTooltip', () => {
	it('starts closed', () => {
		const { result } = renderHook(() => useTooltip());
		expect(result.current.isOpen).toBe(false);
	});

	it('opens after the open delay on show trigger', () => {
		const { result } = renderHook(() => useTooltip());

		act(() => {
			result.current
				.getTriggerProps()
				.onMouseEnter?.({} as React.MouseEvent<HTMLElement>);
		});

		expect(result.current.isOpen).toBe(false);

		act(() => {
			vi.advanceTimersByTime(200);
		});

		expect(result.current.isOpen).toBe(true);
	});

	it('closes after the close delay on hide trigger', () => {
		const { result } = renderHook(() => useTooltip());

		act(() => {
			result.current
				.getTriggerProps()
				.onFocus?.({} as React.FocusEvent<HTMLElement>);
			vi.advanceTimersByTime(200);
		});

		expect(result.current.isOpen).toBe(true);

		act(() => {
			result.current
				.getTriggerProps()
				.onBlur?.({} as React.FocusEvent<HTMLElement>);
			vi.runAllTimers();
		});

		expect(result.current.isOpen).toBe(false);
	});

	it('sets aria-describedby when open', () => {
		const { result } = renderHook(() => useTooltip());

		act(() => {
			result.current
				.getTriggerProps()
				.onMouseEnter?.({} as React.MouseEvent<HTMLElement>);
			vi.advanceTimersByTime(200);
		});

		expect(result.current.getTriggerProps()['aria-describedby']).toBe(
			result.current.tooltipId
		);
	});

	it('does not set aria-describedby when closed', () => {
		const { result } = renderHook(() => useTooltip());

		expect(
			result.current.getTriggerProps()['aria-describedby']
		).toBeUndefined();
	});

	it('preserves an existing aria-describedby when open', () => {
		const { result } = renderHook(() => useTooltip());

		act(() => {
			result.current
				.getTriggerProps()
				.onFocus?.({} as React.FocusEvent<HTMLElement>);
			vi.advanceTimersByTime(200);
		});

		const triggerProps = result.current.getTriggerProps({
			'aria-describedby': 'existing-id',
		});

		expect(triggerProps['aria-describedby']).toBe(
			`existing-id ${result.current.tooltipId}`
		);
	});

	it('closes on Escape when open', () => {
		const { result } = renderHook(() => useTooltip());

		act(() => {
			result.current
				.getTriggerProps()
				.onFocus?.({} as React.FocusEvent<HTMLElement>);
			vi.advanceTimersByTime(200);
		});

		expect(result.current.isOpen).toBe(true);

		act(() => {
			document.dispatchEvent(
				new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
			);
		});

		expect(result.current.isOpen).toBe(false);
	});

	it('merges existing event handlers', () => {
		const onMouseEnter = vi.fn();
		const { result } = renderHook(() => useTooltip());

		act(() => {
			result.current
				.getTriggerProps({ onMouseEnter })
				.onMouseEnter?.({} as React.MouseEvent<HTMLElement>);
			vi.advanceTimersByTime(200);
		});

		expect(onMouseEnter).toHaveBeenCalledOnce();
		expect(result.current.isOpen).toBe(true);
	});
});
