import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { FloatingPortal } from '@/components/patterns/floating-portal';
import { useFloatingPosition } from '@/hooks/useFloatingPosition';
import { useMounted } from '@/hooks/useMounted';
import { cn } from '@/utils/cn';

import styles from '../Menu.module.scss';
import type { MenuAlign, MenuContextValue } from '../Menu.types';
import { hasOpenChildSubmenu, setFloatingPositionVars } from '../Menu.utils';
import {
	MenuProvider,
	useMenuContentStateContext,
	useMenuControllerContext,
} from '../MenuContext';
import { useMenuContentState } from '../hooks/useMenuContentState';

type MenuContentPanelProps = {
	children: ReactNode;
	align: MenuAlign;
	variant: 'dropdown' | 'submenu';
};

const MENU_EXIT_ANIMATION_MS = 200;

export const MenuContentPanel = ({
	children,
	align,
	variant,
}: MenuContentPanelProps) => {
	const mounted = useMounted();
	const controller = useMenuControllerContext();
	const inheritedContentState = useMenuContentStateContext();
	const parentContext = { ...controller, ...inheritedContentState };
	const { menuId, isOpen, triggerRef, contentRef, handleContentKeyDown } =
		controller;

	const isDropdown = variant === 'dropdown';
	const isSubmenu = variant === 'submenu';
	const isPortaled = isDropdown || isSubmenu;
	const wasOpenRef = useRef(isOpen);
	const [isClosing, setIsClosing] = useState(false);
	const shouldRender = isOpen || isClosing || wasOpenRef.current;

	const { position, placement } = useFloatingPosition({
		isOpen: isPortaled && isOpen,
		triggerRef,
		floatingRef: contentRef,
		preferredPlacement: isSubmenu ? 'right' : 'bottom',
		align,
		gap: isSubmenu ? 0 : undefined,
	});

	const contentState = useMenuContentState({
		isDropdown,
		isOpen,
		parentContext,
	});

	useEffect(() => {
		if (isOpen) {
			wasOpenRef.current = true;
			setIsClosing(false);
			return;
		}

		if (!wasOpenRef.current) return;

		setIsClosing(true);
		const timeout = window.setTimeout(() => {
			wasOpenRef.current = false;
			setIsClosing(false);
		}, MENU_EXIT_ANIMATION_MS);

		return () => window.clearTimeout(timeout);
	}, [isOpen]);

	useLayoutEffect(() => {
		const element = contentRef.current;
		if (!element || !isPortaled || !position || !('width' in position)) return;
		setFloatingPositionVars(element, position);
	}, [contentRef, isPortaled, position]);

	if (isPortaled && !shouldRender) return null;

	const contentContext: MenuContextValue = {
		...controller,
		...contentState,
		inContent: true,
	};

	const panel = (
		<MenuProvider value={contentContext}>
			<div
				ref={contentRef}
				role="menu"
				id={`${menuId}-content`}
				aria-labelledby={`${menuId}-trigger`}
				aria-hidden={!isOpen}
				data-state={isOpen ? 'open' : 'closing'}
				className={cn(
					styles['menu__content'],
					isPortaled && styles['menu__content--floating'],
					isPortaled && styles[`menu__content--placement-${placement}`]
				)}
				onKeyDown={handleContentKeyDown}
				onMouseEnter={isSubmenu ? controller.cancelSubmenuClose : undefined}
				onMouseLeave={
					isSubmenu
						? () => {
								if (hasOpenChildSubmenu(contentRef.current)) return;
								controller.scheduleSubmenuClose();
							}
						: undefined
				}
				tabIndex={-1}
			>
				{children}
			</div>
		</MenuProvider>
	);

	if (isPortaled && mounted) {
		return (
			<FloatingPortal mounted={mounted} isOpen={shouldRender}>
				{panel}
			</FloatingPortal>
		);
	}

	return panel;
};
