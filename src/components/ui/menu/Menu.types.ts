import type {
	ComponentProps,
	KeyboardEvent,
	ReactNode,
	RefObject,
} from 'react';

import type { LucideIcon } from 'lucide-react';

import type { Link } from '@/components/ui/link';

export type MenuVariant = 'dropdown' | 'menubar' | 'submenu';

export type MenuAlign = 'start' | 'end';

export type MenuChildrenProps = {
	children: ReactNode;
};

export type MenuProps = MenuChildrenProps & {
	variant?: MenuVariant;
	'aria-label'?: string;
};

export type MenuTriggerProps = MenuChildrenProps;

export type MenuContentProps = MenuChildrenProps & {
	align?: MenuAlign;
};

export type MenuSubProps = MenuChildrenProps;

export type MenuSubTriggerProps = MenuChildrenProps & {
	icon?: LucideIcon;
	disabled?: boolean;
};

export type MenuSubContentProps = MenuChildrenProps;

export type MenuItemProps = MenuChildrenProps & {
	icon?: LucideIcon;
	disabled?: boolean;
	destructive?: boolean;
	onClick?: () => void;
	href?: ComponentProps<typeof Link>['href'];
	external?: boolean;
};

export type MenuLabelProps = MenuChildrenProps;

export type ActiveSubmenu = {
	menuId: string;
	parentMenuId: string;
};

export type MenuControllerContextValue = {
	menuId: string;
	parentMenuId: string | null;
	variant: MenuVariant;
	inMenubar: boolean;
	inContent: boolean;
	isOpen: boolean;
	open: () => void;
	close: () => void;
	closeAll: () => void;
	toggle: () => void;
	scheduleSubmenuClose: () => void;
	cancelSubmenuClose: () => void;
	containerRef: RefObject<HTMLDivElement | null>;
	triggerRef: RefObject<HTMLElement | null>;
	contentRef: RefObject<HTMLDivElement | null>;
	menubarRef: RefObject<HTMLDivElement | null>;
	handleTriggerKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
	handleContentKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
	handleMenubarKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
};

export type MenuContentStateContextValue = {
	activeSubmenu: ActiveSubmenu | null;
	setActiveSubmenu: (submenu: ActiveSubmenu | null) => void;
	highlightedId: string | null;
	setHighlightedId: (id: string | null) => void;
	hasPeerSubmenus: () => boolean;
	registerSubmenuClose: (menuId: string, close: () => void) => void;
	unregisterSubmenuClose: (menuId: string) => void;
	closePeerSubmenus: (keepMenuId?: string | null) => void;
};

export type MenuContextValue = MenuControllerContextValue &
	MenuContentStateContextValue;

export type UseMenuOptions = Pick<
	MenuContentStateContextValue,
	'activeSubmenu' | 'setActiveSubmenu'
> & {
	variant: MenuVariant;
	menuId: string;
	parentMenuId: string | null;
};

export type UseMenuReturn = Pick<
	MenuControllerContextValue,
	| 'isOpen'
	| 'open'
	| 'close'
	| 'toggle'
	| 'containerRef'
	| 'triggerRef'
	| 'contentRef'
	| 'menubarRef'
	| 'handleTriggerKeyDown'
	| 'handleContentKeyDown'
	| 'handleMenubarKeyDown'
	| 'scheduleSubmenuClose'
	| 'cancelSubmenuClose'
>;

export type MenuTriggerChildProps = {
	ref?: React.Ref<HTMLElement>;
	id?: string;
	onClick?: (event: React.MouseEvent<HTMLElement>) => void;
	onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
	className?: string;
	disabled?: boolean;
	'aria-haspopup'?: 'menu';
	'aria-expanded'?: boolean;
	'aria-controls'?: string;
	'data-menu-menubar-item'?: string;
	'data-disabled'?: string;
};
