import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
	StatefulMenuWrapper,
	createMenuContext,
	createMenuWrapper,
} from '../menu.test-utils';
import { useMenuItemHighlight } from './useMenuItemHighlight';

describe('useMenuItemHighlight', () => {
	it('sets and clears highlight while inside menu content', () => {
		const { result } = renderHook(() => useMenuItemHighlight(), {
			wrapper: StatefulMenuWrapper,
		});

		expect(result.current.highlightData).toBeUndefined();
		expect(result.current.onMouseEnter).toBeDefined();

		act(() => {
			result.current.onMouseEnter?.();
		});

		expect(result.current.highlightData).toBe('true');

		act(() => {
			result.current.onMouseLeave?.();
		});

		expect(result.current.highlightData).toBeUndefined();
	});

	it('does not expose highlight handlers outside menu content', () => {
		const { result } = renderHook(() => useMenuItemHighlight(), {
			wrapper: createMenuWrapper(createMenuContext({ inContent: false })),
		});

		expect(result.current.onMouseEnter).toBeUndefined();
		expect(result.current.onMouseLeave).toBeUndefined();
	});

	it('ignores highlight changes when the item is disabled', () => {
		const setHighlightedId = vi.fn();

		const { result } = renderHook(() => useMenuItemHighlight(true), {
			wrapper: createMenuWrapper(createMenuContext({ setHighlightedId })),
		});

		expect(result.current.onMouseEnter).toBeUndefined();

		act(() => {
			result.current.onMouseLeave?.();
		});

		expect(setHighlightedId).not.toHaveBeenCalled();
	});

	it('closes peer submenus before highlighting a submenu trigger', () => {
		const closePeerSubmenus = vi.fn();
		const setHighlightedId = vi.fn();

		const { result } = renderHook(
			() =>
				useMenuItemHighlight(false, {
					isSubmenuTrigger: true,
					keepSubmenuMenuId: 'share-submenu',
				}),
			{
				wrapper: createMenuWrapper(
					createMenuContext({ closePeerSubmenus, setHighlightedId })
				),
			}
		);

		act(() => {
			result.current.onMouseEnter?.();
		});

		expect(closePeerSubmenus).toHaveBeenCalledWith('share-submenu');
		expect(setHighlightedId).toHaveBeenCalledOnce();
	});

	it('closes peer submenus when sibling submenus exist', () => {
		const closePeerSubmenus = vi.fn();
		const hasPeerSubmenus = vi.fn(() => true);

		const { result } = renderHook(() => useMenuItemHighlight(), {
			wrapper: createMenuWrapper(
				createMenuContext({ closePeerSubmenus, hasPeerSubmenus })
			),
		});

		act(() => {
			result.current.onMouseEnter?.();
		});

		expect(hasPeerSubmenus).toHaveBeenCalled();
		expect(closePeerSubmenus).toHaveBeenCalledWith(null);
	});
});
