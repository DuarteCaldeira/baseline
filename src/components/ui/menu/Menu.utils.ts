import type { MouseEvent, MutableRefObject, Ref } from 'react';

import type { ComputedFloatingPosition } from '@/utils/floatingPosition';

import type {
	MenuContentStateContextValue,
	MenuContextValue,
} from './Menu.types';

export const hasOpenChildSubmenu = (content: HTMLDivElement | null) =>
	content?.querySelector('[data-menu-submenu-trigger][aria-expanded="true"]') !=
	null;

type TriggerContext = Pick<
	MenuContextValue,
	'menuId' | 'inMenubar' | 'isOpen' | 'toggle' | 'handleTriggerKeyDown'
>;

export const buildTriggerProps = (
	context: TriggerContext,
	options?: { stopPropagation?: boolean }
) => ({
	id: `${context.menuId}-trigger`,
	'aria-haspopup': 'menu' as const,
	'aria-expanded': context.isOpen,
	'aria-controls': `${context.menuId}-content`,
	'data-menu-menubar-item': context.inMenubar ? 'true' : undefined,
	onClick: (event: MouseEvent<HTMLElement>) => {
		if (options?.stopPropagation) event.stopPropagation();
		context.toggle();
	},
	onKeyDown: context.handleTriggerKeyDown,
});

type MenuItemDataOptions = {
	inContent: boolean;
	inMenubar: boolean;
	disabled?: boolean;
	destructive?: boolean;
	highlighted?: boolean;
	tabIndex: number;
};

export const getMenuItemDataAttrs = ({
	inContent,
	inMenubar,
	disabled,
	destructive,
	highlighted,
	tabIndex,
}: MenuItemDataOptions) => ({
	role: 'menuitem' as const,
	'data-menu-item': inContent ? 'true' : undefined,
	'data-menu-menubar-item': inMenubar && !inContent ? 'true' : undefined,
	'data-disabled': disabled ? 'true' : undefined,
	'data-destructive': destructive ? 'true' : undefined,
	'data-highlighted': highlighted ? 'true' : undefined,
	tabIndex,
});

export const pickInheritedContentState = (
	parent: MenuContentStateContextValue & Pick<MenuContextValue, 'closeAll'>
): Pick<
	MenuContentStateContextValue & Pick<MenuContextValue, 'closeAll'>,
	| 'closeAll'
	| 'activeSubmenu'
	| 'setActiveSubmenu'
	| 'highlightedId'
	| 'setHighlightedId'
	| 'hasPeerSubmenus'
	| 'registerSubmenuClose'
	| 'unregisterSubmenuClose'
	| 'closePeerSubmenus'
> => ({
	closeAll: parent.closeAll,
	activeSubmenu: parent.activeSubmenu,
	setActiveSubmenu: parent.setActiveSubmenu,
	highlightedId: parent.highlightedId,
	setHighlightedId: parent.setHighlightedId,
	hasPeerSubmenus: parent.hasPeerSubmenus,
	registerSubmenuClose: parent.registerSubmenuClose,
	unregisterSubmenuClose: parent.unregisterSubmenuClose,
	closePeerSubmenus: parent.closePeerSubmenus,
});

export const mergeRefs = <T>(
	...refs: Array<Ref<T> | undefined>
): ((node: T | null) => void) => {
	return (node) => {
		refs.forEach((ref) => {
			if (!ref) return;
			if (typeof ref === 'function') {
				ref(node);
				return;
			}
			(ref as MutableRefObject<T | null>).current = node;
		});
	};
};

const FLOATING_STYLE_VARS = [
	'--menu-floating-top',
	'--menu-floating-left',
	'--menu-floating-width',
	'--menu-floating-max-height',
] as const;

export const setFloatingPositionVars = (
	element: HTMLElement,
	position: ComputedFloatingPosition | null
): void => {
	if (!position) {
		FLOATING_STYLE_VARS.forEach((name) => element.style.removeProperty(name));
		return;
	}

	element.style.setProperty('--menu-floating-top', `${position.top}px`);
	element.style.setProperty('--menu-floating-left', `${position.left}px`);
	element.style.setProperty('--menu-floating-width', `${position.width}px`);
	element.style.setProperty(
		'--menu-floating-max-height',
		`${position.maxHeight}px`
	);
};
