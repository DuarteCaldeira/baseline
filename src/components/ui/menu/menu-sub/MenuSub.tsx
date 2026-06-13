import { useEffect, useId } from 'react';

import styles from '../Menu.module.scss';
import type { MenuContextValue, MenuSubProps } from '../Menu.types';
import { pickInheritedContentState } from '../Menu.utils';
import { MenuProvider, useMenuContext } from '../MenuContext';
import { useMenu } from '../hooks/useMenu';

export const MenuSub = ({ children }: MenuSubProps) => {
	const parent = useMenuContext();
	const menuId = useId();

	const menu = useMenu({
		variant: 'submenu',
		menuId,
		parentMenuId: parent.menuId,
		activeSubmenu: parent.activeSubmenu,
		setActiveSubmenu: parent.setActiveSubmenu,
	});

	useEffect(() => {
		if (!parent.inContent) return;
		parent.registerSubmenuClose(menuId, menu.close);
		return () => parent.unregisterSubmenuClose(menuId);
	}, [menu.close, menuId, parent]);

	const context: MenuContextValue = {
		menuId,
		parentMenuId: parent.menuId,
		variant: 'submenu',
		inMenubar: false,
		inContent: parent.inContent,
		...pickInheritedContentState(parent),
		...menu,
	};

	return (
		<MenuProvider value={context}>
			<div
				ref={menu.containerRef}
				data-menu-submenu="true"
				className={styles['menu--submenu']}
			>
				{children}
			</div>
		</MenuProvider>
	);
};
