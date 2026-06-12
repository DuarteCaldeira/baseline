import { type ReactNode, useState } from 'react';

import { vi } from 'vitest';

import { MENU_CONTENT_DEFAULTS } from './Menu.constants';
import type { MenuContextValue } from './Menu.types';
import { MenuProvider } from './MenuContext';

export const createMenuContext = (
	overrides: Partial<MenuContextValue> = {}
): MenuContextValue =>
	({
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
	}) as MenuContextValue;

export const createMenuWrapper = (context: MenuContextValue) => {
	const Wrapper = ({ children }: { children: ReactNode }) => (
		<MenuProvider value={context}>{children}</MenuProvider>
	);

	return Wrapper;
};

export const StatefulMenuWrapper = ({
	children,
	overrides = {},
}: {
	children: ReactNode;
	overrides?: Partial<MenuContextValue>;
}) => {
	const [highlightedId, setHighlightedId] = useState<string | null>(null);

	return (
		<MenuProvider
			value={createMenuContext({
				highlightedId,
				setHighlightedId,
				...overrides,
			})}
		>
			{children}
		</MenuProvider>
	);
};
