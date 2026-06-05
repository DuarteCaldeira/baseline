import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { useTooltip } from './useTooltip';

describe('useTooltip', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('starts closed', () => {
		const { result } = renderHook(() => useTooltip());
		expect(result.current.isOpen).toBe(false);
	});

	it('opens after the open delay on show trigger', () => {
		const { result } = renderHook(() => useTooltip({ openDelay: 200 }));

		act(() => {
			result.current.getTriggerProps().onMouseEnter?.(
				{} as React.MouseEvent<HTMLElement>
			);
		});

		expect(result.current.isOpen).toBe(false);

		act(() => {
			vi.advanceTimersByTime(200);
		});

		expect(result.current.isOpen).toBe(true);
	});

	it('closes after the close delay on hide trigger', () => {
		const { result } = renderHook(() =>
			useTooltip({ openDelay: 0, closeDelay: 100 })
		);

		act(() => {
			result.current.getTriggerProps().onFocus?.(
				{} as React.FocusEvent<HTMLElement>
			);
			vi.runAllTimers();
		});

		expect(result.current.isOpen).toBe(true);

		act(() => {
			result.current.getTriggerProps().onBlur?.(
				{} as React.FocusEvent<HTMLElement>
			);
			vi.advanceTimersByTime(100);
		});

		expect(result.current.isOpen).toBe(false);
	});

	it('sets aria-describedby when open', () => {
		const { result } = renderHook(() => useTooltip({ openDelay: 0 }));

		act(() => {
			result.current.getTriggerProps().onMouseEnter?.(
				{} as React.MouseEvent<HTMLElement>
			);
			vi.runAllTimers();
		});

		expect(result.current.getTriggerProps()['aria-describedby']).toBe(
			result.current.tooltipId
		);
	});

	it('does not set aria-describedby when closed', () => {
		const { result } = renderHook(() => useTooltip());

		expect(result.current.getTriggerProps()['aria-describedby']).toBeUndefined();
	});

	it('preserves an existing aria-describedby when open', () => {
		const { result } = renderHook(() => useTooltip({ openDelay: 0 }));

		act(() => {
			result.current.getTriggerProps().onFocus?.(
				{} as React.FocusEvent<HTMLElement>
			);
			vi.runAllTimers();
		});

		const triggerProps = result.current.getTriggerProps({
			'aria-describedby': 'existing-id',
		});

		expect(triggerProps['aria-describedby']).toBe(
			`existing-id ${result.current.tooltipId}`
		);
	});

	it('closes on Escape when open', () => {
		const { result } = renderHook(() => useTooltip({ openDelay: 0 }));

		act(() => {
			result.current.getTriggerProps().onFocus?.(
				{} as React.FocusEvent<HTMLElement>
			);
			vi.runAllTimers();
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
		const { result } = renderHook(() => useTooltip({ openDelay: 0 }));

		act(() => {
			result.current
				.getTriggerProps({ onMouseEnter })
				.onMouseEnter?.({} as React.MouseEvent<HTMLElement>);
			vi.runAllTimers();
		});

		expect(onMouseEnter).toHaveBeenCalledOnce();
		expect(result.current.isOpen).toBe(true);
	});
});
