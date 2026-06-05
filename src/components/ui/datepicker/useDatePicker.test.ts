import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useDatePicker } from './useDatePicker';
import { startOfDay } from './DatePicker.utils';

describe('useDatePicker', () => {
	it('starts closed with no selected date by default', () => {
		const { result } = renderHook(() => useDatePicker({}));

		expect(result.current.isOpen).toBe(false);
		expect(result.current.selectedDate).toBeUndefined();
	});

	it('opens and closes the calendar', () => {
		const trigger = document.createElement('button');
		document.body.appendChild(trigger);
		trigger.focus();

		const { result } = renderHook(() => useDatePicker({}));

		act(() => {
			result.current.triggerRef.current = trigger;
			result.current.open();
		});

		expect(result.current.isOpen).toBe(true);

		act(() => {
			result.current.close();
		});

		expect(result.current.isOpen).toBe(false);
		expect(document.activeElement).toBe(trigger);

		trigger.remove();
	});

	it('selects a date and closes the calendar', () => {
		const onChange = vi.fn();
		const date = new Date(2024, 5, 15);
		const { result } = renderHook(() =>
			useDatePicker({ defaultValue: date, onChange })
		);

		act(() => {
			result.current.open();
		});

		const nextDate = new Date(2024, 5, 20);

		act(() => {
			result.current.selectDate(nextDate);
		});

		expect(onChange).toHaveBeenCalledWith(startOfDay(nextDate));
		expect(result.current.selectedDate).toEqual(startOfDay(nextDate));
		expect(result.current.isOpen).toBe(false);
	});

	it('respects min and max when disabling dates', () => {
		const min = new Date(2024, 5, 10);
		const max = new Date(2024, 5, 20);
		const { result } = renderHook(() => useDatePicker({ min, max }));

		expect(result.current.isDisabled(new Date(2024, 5, 9))).toBe(true);
		expect(result.current.isDisabled(new Date(2024, 5, 15))).toBe(false);
		expect(result.current.isDisabled(new Date(2024, 5, 21))).toBe(true);
	});

	it('does not open when disabled', () => {
		const { result } = renderHook(() => useDatePicker({ disabled: true }));

		act(() => {
			result.current.open();
		});

		expect(result.current.isOpen).toBe(false);
	});

	it('navigates months', () => {
		const date = new Date(2024, 5, 15);
		const { result } = renderHook(() =>
			useDatePicker({ defaultValue: date })
		);

		const initialMonth = result.current.viewDate.getMonth();

		act(() => {
			result.current.navigateMonth(1);
		});

		expect(result.current.viewDate.getMonth()).toBe((initialMonth + 1) % 12);
	});
});
