import { describe, expect, it } from 'vitest';

import {
	focusMenuItem,
	getMenuItems,
	getMenubarItems,
	isActivationKey,
	moveFocus,
} from './Menu.keyboard.utils';

describe('Menu.keyboard.utils', () => {
	it('collects enabled menu and menubar items', () => {
		const container = document.createElement('div');
		const enabled = document.createElement('button');
		const disabled = document.createElement('button');
		const menubarItem = document.createElement('button');

		enabled.dataset.menuItem = 'true';
		disabled.dataset.menuItem = 'true';
		disabled.dataset.disabled = 'true';
		menubarItem.dataset.menuMenubarItem = 'true';

		container.append(enabled, disabled, menubarItem);

		expect(getMenuItems(container)).toEqual([enabled]);
		expect(getMenubarItems(container)).toEqual([menubarItem]);
	});

	it.each(['Enter', ' '])('treats %s as an activation key', (key) => {
		expect(isActivationKey({ key })).toBe(true);
	});

	it('focuses boundary menu items and moves focus cyclically', () => {
		const container = document.createElement('div');
		const first = document.createElement('button');
		const second = document.createElement('button');
		const third = document.createElement('button');

		first.dataset.menuItem = 'true';
		second.dataset.menuItem = 'true';
		third.dataset.menuItem = 'true';
		container.append(first, second, third);
		document.body.append(container);

		focusMenuItem(container, 'first');
		expect(document.activeElement).toBe(first);

		focusMenuItem(container, 'last');
		expect(document.activeElement).toBe(third);

		const items = [first, second, third];
		first.focus();

		moveFocus(items, first, 1);
		expect(document.activeElement).toBe(second);

		moveFocus(items, third, 1);
		expect(document.activeElement).toBe(first);

		container.remove();
	});
});
