import { useEffect, useId } from 'react';

import styles from '../Menu.module.scss';
import type { MenuContextValue, MenuSubProps } from '../Menu.types';
import { pickInheritedContentState } from '../Menu.utils';
import {
	MenuProvider,
	useMenuContentStateContext,
	useMenuControllerContext,
} from '../MenuContext';
import { useMenu } from '../hooks/useMenu';

export const MenuSub = ({ children }: MenuSubProps) => {
	const parentController = useMenuControllerContext();
	const parentContentState = useMenuContentStateContext();
	const parent = { ...parentController, ...parentContentState };
	const menuId = useId();

	const menu = useMenu({
		variant: 'submenu',
		menuId,
		parentMenuId: parentController.menuId,
		activeSubmenu: parentContentState.activeSubmenu,
		setActiveSubmenu: parentContentState.setActiveSubmenu,
	});

	useEffect(() => {
		if (!parentController.inContent) return;
		parentContentState.registerSubmenuClose(menuId, menu.close);
		return () => parentContentState.unregisterSubmenuClose(menuId);
	}, [menu.close, menuId, parentController.inContent, parentContentState]);

	const context: MenuContextValue = {
		menuId,
		parentMenuId: parentController.menuId,
		variant: 'submenu',
		inMenubar: false,
		inContent: parentController.inContent,
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
