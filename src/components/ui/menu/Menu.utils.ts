import type { KeyboardEvent, MouseEvent, MutableRefObject, Ref } from 'react';

import type { ComputedFloatingPosition } from '@/utils/floatingPosition';

import type { MenuContextValue } from './Menu.types';

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
	parent: MenuContextValue
): Pick<
	MenuContextValue,
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

export const getMenuItems = (container: HTMLElement | null): HTMLElement[] =>
	Array.from(
		container?.querySelectorAll<HTMLElement>(
			'[data-menu-item]:not([data-disabled="true"])'
		) ?? []
	);

export const getMenubarItems = (container: HTMLElement | null): HTMLElement[] =>
	Array.from(
		container?.querySelectorAll<HTMLElement>(
			'[data-menu-menubar-item]:not([data-disabled="true"])'
		) ?? []
	);

const resolveFocusIndex = (
	items: HTMLElement[],
	index: number | 'first' | 'last'
): number => {
	if (index === 'first') return 0;
	if (index === 'last') return items.length - 1;
	return Math.max(0, Math.min(index, items.length - 1));
};

export const focusMenuItem = (
	container: HTMLElement | null,
	index: number | 'first' | 'last'
): void => {
	const items = getMenuItems(container);
	if (items.length === 0) return;
	items[resolveFocusIndex(items, index)]?.focus();
};

export const focusMenubarItem = (
	container: HTMLElement | null,
	index: number | 'first' | 'last'
): void => {
	const items = getMenubarItems(container);
	if (items.length === 0) return;
	items[resolveFocusIndex(items, index)]?.focus();
};

export const moveFocus = (
	items: HTMLElement[],
	current: HTMLElement,
	direction: 1 | -1
): void => {
	const currentIndex = items.indexOf(current);
	if (currentIndex === -1) {
		items[direction === 1 ? 0 : items.length - 1]?.focus();
		return;
	}

	const nextIndex = (currentIndex + direction + items.length) % items.length;
	items[nextIndex]?.focus();
};

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

export const isActivationKey = (
	event: Pick<KeyboardEvent<Element>, 'key'>
): boolean => event.key === 'Enter' || event.key === ' ';

export type MenuKeyboardContext = {
	event: KeyboardEvent<HTMLElement>;
	items: HTMLElement[];
	current: HTMLElement;
	contentElement: HTMLDivElement | null;
	close: () => void;
};

export const runMenuKeyHandler = (
	event: KeyboardEvent<HTMLElement>,
	handlers: Partial<Record<string, () => void>>
): void => {
	handlers[event.key]?.();
};

export const handleMenuListNavigation = (
	ctx: MenuKeyboardContext,
	direction: 1 | -1
): void => {
	ctx.event.preventDefault();
	moveFocus(ctx.items, ctx.current, direction);
};

export const handleMenuBoundaryFocus = (
	ctx: MenuKeyboardContext,
	boundary: 'first' | 'last'
): void => {
	ctx.event.preventDefault();
	focusMenuItem(ctx.contentElement, boundary);
};

export const handleMenuClose = (
	ctx: MenuKeyboardContext,
	options?: { stopPropagation?: boolean }
): void => {
	ctx.event.preventDefault();
	if (options?.stopPropagation) ctx.event.stopPropagation();
	ctx.close();
};

export const openSubmenuFromKeyboard = (current: HTMLElement): boolean => {
	if (!current.hasAttribute('data-menu-submenu-trigger')) return false;
	current.dispatchEvent(
		new MouseEvent('mouseenter', { bubbles: true, cancelable: true })
	);
	return true;
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
