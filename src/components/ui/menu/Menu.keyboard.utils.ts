import type { KeyboardEvent } from 'react';

const MENU_ITEMS = '[data-menu-item]:not([data-disabled="true"])';
const MENUBAR_ITEMS = '[data-menu-menubar-item]:not([data-disabled="true"])';

const queryItems = (container: HTMLElement | null, selector: string): HTMLElement[] =>
	Array.from(container?.querySelectorAll<HTMLElement>(selector) ?? []);

const resolveFocusIndex = (
	items: HTMLElement[],
	index: number | 'first' | 'last'
): number => {
	if (index === 'first') return 0;
	if (index === 'last') return items.length - 1;
	return Math.max(0, Math.min(index, items.length - 1));
};

const focusItem = (
	container: HTMLElement | null,
	selector: string,
	index: number | 'first' | 'last'
): void => {
	const items = queryItems(container, selector);
	if (items.length === 0) return;
	items[resolveFocusIndex(items, index)]?.focus();
};

export const getMenuItems = (container: HTMLElement | null): HTMLElement[] =>
	queryItems(container, MENU_ITEMS);

export const getMenubarItems = (container: HTMLElement | null): HTMLElement[] =>
	queryItems(container, MENUBAR_ITEMS);

export const focusMenuItem = (
	container: HTMLElement | null,
	index: number | 'first' | 'last'
): void => focusItem(container, MENU_ITEMS, index);

export const focusMenubarItem = (
	container: HTMLElement | null,
	index: number | 'first' | 'last'
): void => focusItem(container, MENUBAR_ITEMS, index);

export const moveFocus = (
	items: HTMLElement[],
	current: HTMLElement,
	direction: 1 | -1
): void => {
	const currentIndex = items.indexOf(current);
	let nextIndex: number;
	if (currentIndex === -1) {
		nextIndex = direction === 1 ? 0 : items.length - 1;
	} else {
		nextIndex = (currentIndex + direction + items.length) % items.length;
	}

	items[nextIndex]?.focus();
};

export const isActivationKey = (
	event: Pick<KeyboardEvent<Element>, 'key'>
): boolean => event.key === 'Enter' || event.key === ' ';

export const runMenuKeyHandler = (
	event: KeyboardEvent<HTMLElement>,
	handlers: Partial<Record<string, () => void>>
): void => {
	handlers[event.key]?.();
};

export const openSubmenuFromKeyboard = (current: HTMLElement): boolean => {
	if (!current.hasAttribute('data-menu-submenu-trigger')) return false;
	current.dispatchEvent(
		new MouseEvent('mouseenter', { bubbles: true, cancelable: true })
	);
	return true;
};
