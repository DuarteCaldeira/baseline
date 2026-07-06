import { useCallback, useEffect, useRef, useState } from 'react';

import type {
	ActiveSubmenu,
	MenuContentStateContextValue,
} from '../Menu.types';

type UseMenuContentStateOptions = {
	isDropdown: boolean;
	isOpen: boolean;
	parentContext: MenuContentStateContextValue;
};

export const useMenuContentState = ({
	isDropdown,
	isOpen,
	parentContext,
}: UseMenuContentStateOptions) => {
	const [activeSubmenu, setActiveSubmenu] = useState<ActiveSubmenu | null>(
		null
	);
	const [localHighlightedId, setLocalHighlightedId] = useState<string | null>(
		null
	);
	const submenuRegistryRef = useRef<Map<string, () => void>>(new Map());

	const hasPeerSubmenus = useCallback(
		() => submenuRegistryRef.current.size > 0,
		[]
	);

	const registerSubmenuClose = useCallback(
		(id: string, closeSubmenu: () => void) => {
			submenuRegistryRef.current.set(id, closeSubmenu);
		},
		[]
	);

	const unregisterSubmenuClose = useCallback((id: string) => {
		submenuRegistryRef.current.delete(id);
	}, []);

	const closePeerSubmenus = useCallback((keepMenuId: string | null = null) => {
		submenuRegistryRef.current.forEach((closeSubmenu, id) => {
			if (keepMenuId && id === keepMenuId) return;
			closeSubmenu();
		});
	}, []);

	useEffect(() => {
		if (!isDropdown || isOpen) return;
		setLocalHighlightedId(null);
	}, [isDropdown, isOpen]);

	return {
		activeSubmenu: isDropdown ? activeSubmenu : parentContext.activeSubmenu,
		setActiveSubmenu: isDropdown
			? setActiveSubmenu
			: parentContext.setActiveSubmenu,
		highlightedId: isDropdown
			? localHighlightedId
			: parentContext.highlightedId,
		setHighlightedId: isDropdown
			? setLocalHighlightedId
			: parentContext.setHighlightedId,
		hasPeerSubmenus,
		registerSubmenuClose,
		unregisterSubmenuClose,
		closePeerSubmenus,
	};
};
