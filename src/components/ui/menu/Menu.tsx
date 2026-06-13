import { useId } from 'react';

import { cn } from '@/utils/cn';

import { MENU_CONTENT_DEFAULTS } from './Menu.constants';
import styles from './Menu.module.scss';
import type { MenuContextValue, MenuProps } from './Menu.types';
import { MenuProvider, useOptionalMenuContext } from './MenuContext';
import { useMenu } from './hooks/useMenu';

export type { MenuAlign, MenuVariant } from './Menu.types';

export const Menu = ({
	variant = 'dropdown',
	children,
	'aria-label': ariaLabel = 'Menu',
}: MenuProps) => {
	const parent = useOptionalMenuContext();
	const menuId = useId();
	const inMenubar = parent?.variant === 'menubar' || parent?.inMenubar === true;

	const menu = useMenu({
		variant,
		menuId,
		parentMenuId: parent?.menuId ?? null,
		activeSubmenu: parent?.activeSubmenu ?? MENU_CONTENT_DEFAULTS.activeSubmenu,
		setActiveSubmenu:
			parent?.setActiveSubmenu ?? MENU_CONTENT_DEFAULTS.setActiveSubmenu,
	});

	const context: MenuContextValue = {
		menuId,
		parentMenuId: parent?.menuId ?? null,
		variant,
		inMenubar,
		inContent: false,
		closeAll: parent?.closeAll ?? menu.close,
		...MENU_CONTENT_DEFAULTS,
		...menu,
	};

	if (variant === 'menubar') {
		return (
			<MenuProvider value={context}>
				<nav
					ref={context.menubarRef}
					role="menubar"
					aria-label={ariaLabel}
					className={styles['menu--menubar']}
					onKeyDown={context.handleMenubarKeyDown}
				>
					{children}
				</nav>
			</MenuProvider>
		);
	}

	return (
		<MenuProvider value={context}>
			<div
				ref={context.containerRef}
				className={cn(styles.menu, styles['menu--dropdown'])}
			>
				{children}
			</div>
		</MenuProvider>
	);
};

export { MenuSub, MenuSubTrigger, MenuSubContent } from './menu-sub';
export { MenuTrigger } from './menu-trigger';
export { MenuContent } from './menu-content';
export { MenuItem } from './menu-item';
export { MenuLabel, MenuSeparator } from './menu-section';
