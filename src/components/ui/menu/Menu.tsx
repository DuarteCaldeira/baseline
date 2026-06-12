import { cloneElement, isValidElement, useEffect, useId } from 'react';
import type { KeyboardEvent, MouseEvent, ReactElement, Ref } from 'react';

import { ChevronRight } from 'lucide-react';

import { Stack } from '@/components/layout/stack';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Link } from '@/components/ui/link';
import { cn } from '@/utils/cn';

import { MENU_CONTENT_DEFAULTS } from './Menu.constants';
import styles from './Menu.module.scss';
import type {
	MenuContentProps,
	MenuContextValue,
	MenuItemProps,
	MenuLabelProps,
	MenuProps,
	MenuSubContentProps,
	MenuSubProps,
	MenuSubTriggerProps,
	MenuTriggerChildProps,
	MenuTriggerProps,
} from './Menu.types';
import {
	buildTriggerProps,
	getMenuItemDataAttrs,
	isActivationKey,
	mergeRefs,
	pickInheritedContentState,
} from './Menu.utils';
import { MenuContentPanel } from './MenuContentPanel';
import {
	MenuProvider,
	useMenuContext,
	useOptionalMenuContext,
} from './MenuContext';
import { MenuItemContent } from './MenuItemContent';
import { useMenu } from './hooks/useMenu';
import { useMenuItemHighlight } from './hooks/useMenuItemHighlight';

export type {
	MenuAlign,
	MenuChildrenProps,
	MenuContentProps,
	MenuItemProps,
	MenuLabelProps,
	MenuProps,
	MenuSubContentProps,
	MenuSubProps,
	MenuSubTriggerProps,
	MenuTriggerProps,
	MenuVariant,
} from './Menu.types';

export const Menu = ({ variant = 'dropdown', children }: MenuProps) => {
	const parent = useOptionalMenuContext();
	const menuId = useId();
	const inMenubar = parent?.variant === 'menubar' || parent?.inMenubar === true;

	const menu = useMenu({
		variant,
		menuId,
		parentMenuId: parent?.menuId ?? null,
		activeSubmenu: parent?.activeSubmenu ?? MENU_CONTENT_DEFAULTS.activeSubmenu,
		setActiveSubmenu:
			parent?.setActiveSubmenu ?? MENU_CONTENT_DEFAULTS.setActiveSubmenu,
	});

	const context: MenuContextValue = {
		menuId,
		parentMenuId: parent?.menuId ?? null,
		variant,
		inMenubar,
		inContent: false,
		closeAll: parent?.closeAll ?? menu.close,
		...MENU_CONTENT_DEFAULTS,
		...menu,
	};

	if (variant === 'menubar') {
		return (
			<MenuProvider value={context}>
				<nav
					ref={context.menubarRef}
					role="menubar"
					aria-label="Menu"
					className={styles['menu--menubar']}
					onKeyDown={context.handleMenubarKeyDown}
				>
					{children}
				</nav>
			</MenuProvider>
		);
	}

	return (
		<MenuProvider value={context}>
			<div
				ref={context.containerRef}
				className={cn(styles.menu, styles['menu--dropdown'])}
			>
				{children}
			</div>
		</MenuProvider>
	);
};

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
	}, [
		menu.close,
		menuId,
		parent.inContent,
		parent.registerSubmenuClose,
		parent.unregisterSubmenuClose,
	]);

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

export const MenuTrigger = ({ children }: MenuTriggerProps) => {
	const context = useMenuContext();
	const triggerProps = buildTriggerProps(context);

	if (typeof children === 'string' || !isValidElement(children)) {
		return (
			<Button
				ref={context.triggerRef as Ref<HTMLButtonElement>}
				type="button"
				variant="ghost"
				size="sm"
				{...triggerProps}
			>
				{children}
			</Button>
		);
	}

	const child = children as ReactElement<MenuTriggerChildProps>;

	return cloneElement(child, {
		...triggerProps,
		ref: mergeRefs(context.triggerRef, child.props.ref),
		onClick: (event: MouseEvent<HTMLElement>) => {
			child.props.onClick?.(event);
			if (event.defaultPrevented) return;
			triggerProps.onClick(event);
		},
		onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
			child.props.onKeyDown?.(event);
			if (event.defaultPrevented) return;
			triggerProps.onKeyDown(event);
		},
		disabled: child.props.disabled,
		'data-disabled': child.props.disabled ? 'true' : undefined,
	});
};

export const MenuSubTrigger = ({
	children,
	icon,
	disabled,
}: MenuSubTriggerProps) => {
	const context = useMenuContext();
	const { highlightData, onMouseEnter, onMouseLeave } = useMenuItemHighlight(
		disabled,
		{
			keepSubmenuMenuId: context.menuId,
			isSubmenuTrigger: true,
		}
	);

	const handleMouseEnter = () => {
		if (disabled) return;
		onMouseEnter?.();
		context.cancelSubmenuClose();
		context.open();
	};

	const handleMouseLeave = () => {
		onMouseLeave?.();
		context.scheduleSubmenuClose();
	};

	return (
		<Button
			type="button"
			variant="ghost"
			size="sm"
			ref={context.triggerRef as Ref<HTMLButtonElement>}
			role="menuitem"
			data-menu-item="true"
			data-menu-submenu-trigger="true"
			data-disabled={disabled ? 'true' : undefined}
			data-highlighted={highlightData}
			data-submenu-open={context.isOpen ? 'true' : undefined}
			disabled={disabled}
			tabIndex={-1}
			{...buildTriggerProps(context, { stopPropagation: true })}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<Stack
				direction="row"
				gap="2"
				align="center"
				justify="between"
				className={styles['menu__submenu-trigger-inner']}
			>
				<MenuItemContent icon={icon}>{children}</MenuItemContent>
				<Icon icon={ChevronRight} size="sm" variant="muted" aria-hidden />
			</Stack>
		</Button>
	);
};

export const MenuContent = ({
	children,
	align = 'start',
}: MenuContentProps) => {
	const { variant } = useMenuContext();
	return (
		<MenuContentPanel
			align={align}
			variant={variant === 'submenu' ? 'submenu' : 'dropdown'}
		>
			{children}
		</MenuContentPanel>
	);
};

export const MenuSubContent = ({ children }: MenuSubContentProps) => (
	<MenuContentPanel align="start" variant="submenu">
		{children}
	</MenuContentPanel>
);

export const MenuItem = ({
	children,
	icon,
	disabled,
	destructive,
	onClick,
	href,
	external,
}: MenuItemProps) => {
	const { inContent, inMenubar, closeAll } = useMenuContext();
	const { highlightData, onMouseEnter, onMouseLeave } =
		useMenuItemHighlight(disabled);

	const itemAttrs = getMenuItemDataAttrs({
		inContent,
		inMenubar,
		disabled,
		destructive,
		highlighted: highlightData === 'true',
		tabIndex: inContent ? -1 : 0,
	});

	const handleSelect = () => {
		if (disabled) return;
		onClick?.();
		if (inContent) closeAll();
	};

	const content = (
		<MenuItemContent icon={icon} destructive={destructive}>
			{children}
		</MenuItemContent>
	);

	if (href) {
		return (
			<Link
				href={href}
				external={external}
				variant="inherit"
				{...itemAttrs}
				onClick={handleSelect}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
			>
				{content}
			</Link>
		);
	}

	return (
		<Button
			type="button"
			variant="ghost"
			size="sm"
			{...itemAttrs}
			disabled={disabled}
			onClick={handleSelect}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onKeyDown={(event) => {
				if (!isActivationKey(event)) return;
				event.preventDefault();
				handleSelect();
			}}
		>
			{content}
		</Button>
	);
};

export const MenuLabel = ({ children }: MenuLabelProps) => (
	<p role="presentation" className={styles['menu__label']}>
		{children}
	</p>
);

export const MenuSeparator = () => (
	<hr role="separator" className={styles['menu__separator']} />
);
