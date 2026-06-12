import type { MenuContextValue } from './Menu.types';

export const MENU_CONTENT_DEFAULTS: Pick<
	MenuContextValue,
	| 'highlightedId'
	| 'setHighlightedId'
	| 'hasPeerSubmenus'
	| 'registerSubmenuClose'
	| 'unregisterSubmenuClose'
	| 'closePeerSubmenus'
	| 'activeSubmenu'
	| 'setActiveSubmenu'
> = {
	highlightedId: null,
	setHighlightedId: () => {},
	hasPeerSubmenus: () => false,
	registerSubmenuClose: () => {},
	unregisterSubmenuClose: () => {},
	closePeerSubmenus: () => {},
	activeSubmenu: null,
	setActiveSubmenu: () => {},
};
