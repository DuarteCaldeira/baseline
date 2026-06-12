import type { KeyboardEvent } from 'react';

import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useMenu } from './useMenu';

const keyDown = (
	handler: (event: KeyboardEvent<HTMLElement>) => void,
	key: string
) => {
	const event = {
		key,
		preventDefault: vi.fn(),
		stopPropagation: vi.fn(),
	} as unknown as KeyboardEvent<HTMLElement>;

	handler(event);
	return event;
};

const defaultOptions = {
	variant: 'dropdown' as const,
	menuId: 'menu-1',
	parentMenuId: null,
	activeSubmenu: null,
	setActiveSubmenu: vi.fn(),
};

describe('useMenu', () => {
	it('opens, closes, and returns focus to the trigger', () => {
		const trigger = document.createElement('button');
		document.body.append(trigger);

		const { result } = renderHook(() => useMenu(defaultOptions));

		expect(result.current.isOpen).toBe(false);

		act(() => {
			Object.defineProperty(result.current.triggerRef, 'current', {
				configurable: true,
				value: trigger,
			});
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

	it('toggles on activation keys from the trigger', () => {
		const { result } = renderHook(() => useMenu(defaultOptions));

		act(() => {
			keyDown(result.current.handleTriggerKeyDown, 'Enter');
		});
		expect(result.current.isOpen).toBe(true);

		act(() => {
			keyDown(result.current.handleTriggerKeyDown, 'Enter');
		});
		expect(result.current.isOpen).toBe(false);
	});

	it('tracks active submenu when opening a submenu', () => {
		const setActiveSubmenu = vi.fn();
		const { result } = renderHook(() =>
			useMenu({
				...defaultOptions,
				variant: 'submenu',
				menuId: 'submenu-1',
				parentMenuId: 'menu-1',
				setActiveSubmenu,
			})
		);

		act(() => {
			result.current.open();
		});

		expect(setActiveSubmenu).toHaveBeenCalledWith({
			menuId: 'submenu-1',
			parentMenuId: 'menu-1',
		});
	});
});
