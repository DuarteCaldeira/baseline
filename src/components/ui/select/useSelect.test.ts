import { type KeyboardEvent } from 'react';

import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useSelect } from './useSelect';

const keyDown = (
	handler: (event: KeyboardEvent<HTMLElement>) => void,
	key: string
) => {
	const event = {
		key,
		preventDefault: vi.fn(),
	} as unknown as KeyboardEvent<HTMLElement>;

	handler(event);
	return event;
};

describe('useSelect', () => {
	it('starts closed with the initial active index', () => {
		const { result } = renderHook(() =>
			useSelect({ optionsCount: 3, initialActiveIndex: 1 })
		);

		expect(result.current.isOpen).toBe(false);
		expect(result.current.activeIndex).toBe(1);
	});

	it('opens and closes the listbox', () => {
		const trigger = document.createElement('button');
		document.body.appendChild(trigger);
		trigger.focus();

		const { result } = renderHook(() => useSelect({ optionsCount: 3 }));

		act(() => {
			(
				result.current.triggerRef as { current: HTMLButtonElement | null }
			).current = trigger;
			result.current.open(2);
		});

		expect(result.current.isOpen).toBe(true);
		expect(result.current.activeIndex).toBe(2);

		act(() => {
			result.current.close();
		});

		expect(result.current.isOpen).toBe(false);
		expect(document.activeElement).toBe(trigger);

		trigger.remove();
	});

	it('does not open when disabled', () => {
		const { result } = renderHook(() =>
			useSelect({ optionsCount: 3, isDisabled: true })
		);

		act(() => {
			result.current.open();
		});

		expect(result.current.isOpen).toBe(false);
	});

	it('opens on ArrowDown and moves the active index', () => {
		const { result } = renderHook(() =>
			useSelect({ optionsCount: 3, initialActiveIndex: 0 })
		);

		act(() => {
			keyDown(result.current.handleTriggerKeyDown, 'ArrowDown');
		});

		expect(result.current.isOpen).toBe(true);
		expect(result.current.activeIndex).toBe(0);

		act(() => {
			keyDown(result.current.handleTriggerKeyDown, 'ArrowDown');
		});

		expect(result.current.activeIndex).toBe(1);
	});

	it('closes on Escape', () => {
		const { result } = renderHook(() => useSelect({ optionsCount: 3 }));

		act(() => {
			result.current.open();
		});

		act(() => {
			keyDown(result.current.handleTriggerKeyDown, 'Escape');
		});

		expect(result.current.isOpen).toBe(false);
	});

	it('calls onOptionConfirm without closing when closeOnSelect is false', () => {
		const onOptionConfirm = vi.fn();
		const { result } = renderHook(() =>
			useSelect({
				optionsCount: 3,
				closeOnSelect: false,
				onOptionConfirm,
			})
		);

		act(() => {
			result.current.open(1);
		});

		act(() => {
			keyDown(result.current.handleTriggerKeyDown, 'Enter');
		});

		expect(onOptionConfirm).toHaveBeenCalledWith(1);
		expect(result.current.isOpen).toBe(true);
	});

	it('closes on pointer-down outside the container', () => {
		const container = document.createElement('div');
		document.body.appendChild(container);

		const { result } = renderHook(() => useSelect({ optionsCount: 3 }));

		act(() => {
			(
				result.current.containerRef as { current: HTMLDivElement | null }
			).current = container;
			result.current.open();
		});

		act(() => {
			document.dispatchEvent(new Event('pointerdown', { bubbles: true }));
		});

		expect(result.current.isOpen).toBe(false);

		container.remove();
	});
});
