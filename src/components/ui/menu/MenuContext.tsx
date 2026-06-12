import { createContext, useContext } from 'react';

import type { MenuContextValue } from './Menu.types';

const MenuContext = createContext<MenuContextValue | null>(null);

export const MenuProvider = MenuContext.Provider;

export const useMenuContext = (): MenuContextValue => {
	const context = useContext(MenuContext);
	if (!context) {
		throw new Error('Menu components must be used within a Menu.');
	}
	return context;
};

export const useOptionalMenuContext = (): MenuContextValue | null =>
	useContext(MenuContext);
