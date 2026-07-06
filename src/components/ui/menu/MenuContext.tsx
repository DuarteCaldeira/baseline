import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';

import type {
	MenuContentStateContextValue,
	MenuContextValue,
	MenuControllerContextValue,
} from './Menu.types';

const MenuControllerContext = createContext<MenuControllerContextValue | null>(
	null
);
const MenuContentStateContext =
	createContext<MenuContentStateContextValue | null>(null);

type MenuProviderProps = {
	value: MenuContextValue;
	children: ReactNode;
};

const splitMenuContext = (
	value: MenuContextValue
): {
	controller: MenuControllerContextValue;
	contentState: MenuContentStateContextValue;
} => {
	const {
		activeSubmenu,
		setActiveSubmenu,
		highlightedId,
		setHighlightedId,
		hasPeerSubmenus,
		registerSubmenuClose,
		unregisterSubmenuClose,
		closePeerSubmenus,
		...controller
	} = value;

	return {
		controller,
		contentState: {
			activeSubmenu,
			setActiveSubmenu,
			highlightedId,
			setHighlightedId,
			hasPeerSubmenus,
			registerSubmenuClose,
			unregisterSubmenuClose,
			closePeerSubmenus,
		},
	};
};

export const MenuProvider = ({ value, children }: MenuProviderProps) => {
	const { controller, contentState } = useMemo(
		() => splitMenuContext(value),
		[value]
	);

	return (
		<MenuControllerContext.Provider value={controller}>
			<MenuContentStateContext.Provider value={contentState}>
				{children}
			</MenuContentStateContext.Provider>
		</MenuControllerContext.Provider>
	);
};

export const useMenuControllerContext = (): MenuControllerContextValue => {
	const context = useContext(MenuControllerContext);
	if (!context) {
		throw new Error('Menu components must be used within a Menu.');
	}
	return context;
};

export const useMenuContentStateContext = (): MenuContentStateContextValue => {
	const context = useContext(MenuContentStateContext);
	if (!context) {
		throw new Error('Menu components must be used within a Menu.');
	}
	return context;
};

export const useMenuContext = (): MenuContextValue => ({
	...useMenuControllerContext(),
	...useMenuContentStateContext(),
});

export const useOptionalMenuContext = (): MenuContextValue | null => {
	const controller = useContext(MenuControllerContext);
	const contentState = useContext(MenuContentStateContext);

	if (!controller || !contentState) return null;

	return {
		...controller,
		...contentState,
	};
};
