import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { createMenuContext } from '../Menu.test-utils';
import { useMenuContentState } from './useMenuContentState';

describe('useMenuContentState', () => {
	it('tracks and closes peer submenus', () => {
		const { result } = renderHook(() =>
			useMenuContentState({
				isDropdown: true,
				isOpen: true,
				parentContext: createMenuContext({ inContent: false }),
			})
		);

		const closeShare = vi.fn();
		const closeMore = vi.fn();

		act(() => {
			result.current.registerSubmenuClose('share', closeShare);
			result.current.registerSubmenuClose('more', closeMore);
		});

		expect(result.current.hasPeerSubmenus()).toBe(true);

		act(() => {
			result.current.closePeerSubmenus('share');
		});

		expect(closeShare).not.toHaveBeenCalled();
		expect(closeMore).toHaveBeenCalledOnce();

		act(() => {
			result.current.closePeerSubmenus();
		});

		expect(closeShare).toHaveBeenCalledOnce();
	});

	it('clears local highlight when a dropdown panel closes', () => {
		const { result, rerender } = renderHook(
			({ isOpen }) =>
				useMenuContentState({
					isDropdown: true,
					isOpen,
					parentContext: createMenuContext({ inContent: false }),
				}),
			{ initialProps: { isOpen: true } }
		);

		act(() => {
			result.current.setHighlightedId('item-1');
		});

		expect(result.current.highlightedId).toBe('item-1');

		rerender({ isOpen: false });

		expect(result.current.highlightedId).toBeNull();
	});

	it('inherits highlight state from the parent for submenu panels', () => {
		const setHighlightedId = vi.fn();
		const parentContext = createMenuContext({
			inContent: false,
			highlightedId: 'parent-item',
			setHighlightedId,
		});

		const { result } = renderHook(() =>
			useMenuContentState({
				isDropdown: false,
				isOpen: true,
				parentContext,
			})
		);

		expect(result.current.highlightedId).toBe('parent-item');

		act(() => {
			result.current.setHighlightedId('nested-item');
		});

		expect(setHighlightedId).toHaveBeenCalledWith('nested-item');
	});
});
