import { type ReactNode, useState } from 'react';

import { vi } from 'vitest';

import { MENU_CONTENT_DEFAULTS } from './Menu.constants';
import type { MenuContextValue } from './Menu.types';
import { MenuProvider } from './MenuContext';

export const createMenuContext = (
	overrides: Partial<MenuContextValue> = {}
): MenuContextValue => ({
	menuId: 'menu-1',
	parentMenuId: null,
	variant: 'dropdown',
	inMenubar: false,
	inContent: true,
	isOpen: true,
	open: vi.fn(),
	close: vi.fn(),
	closeAll: vi.fn(),
	toggle: vi.fn(),
	containerRef: { current: null },
	triggerRef: { current: null },
	contentRef: { current: null },
	menubarRef: { current: null },
	handleTriggerKeyDown: vi.fn(),
	handleContentKeyDown: vi.fn(),
	handleMenubarKeyDown: vi.fn(),
	scheduleSubmenuClose: vi.fn(),
	cancelSubmenuClose: vi.fn(),
	...MENU_CONTENT_DEFAULTS,
	...overrides,
});

export const createMenuWrapper = (context: MenuContextValue) => {
	const Wrapper = ({ children }: { children: ReactNode }) => (
		<MenuProvider value={context}>{children}</MenuProvider>
	);

	return Wrapper;
};

export const StatefulMenuWrapper = ({ children }: { children: ReactNode }) => {
	const [highlightedId, setHighlightedId] = useState<string | null>(null);
	const context = createMenuContext({ highlightedId, setHighlightedId });

	return <MenuProvider value={context}>{children}</MenuProvider>;
};
