import { useLayoutEffect } from 'react';
import type { ReactNode } from 'react';

import { FloatingPortal } from '@/components/patterns/floating-portal';
import { useFloatingPosition } from '@/hooks/useFloatingPosition';
import { useMounted } from '@/hooks/useMounted';
import { cn } from '@/utils/cn';

import styles from '../Menu.module.scss';
import type { MenuAlign, MenuContextValue } from '../Menu.types';
import { hasOpenChildSubmenu, setFloatingPositionVars } from '../Menu.utils';
import { MenuProvider, useMenuContext } from '../MenuContext';
import { useMenuContentState } from '../hooks/useMenuContentState';

type MenuContentPanelProps = {
	children: ReactNode;
	align: MenuAlign;
	variant: 'dropdown' | 'submenu';
};

export const MenuContentPanel = ({
	children,
	align,
	variant,
}: MenuContentPanelProps) => {
	const mounted = useMounted();
	const parentContext = useMenuContext();
	const { menuId, isOpen, triggerRef, contentRef, handleContentKeyDown } =
		parentContext;

	const isDropdown = variant === 'dropdown';
	const isSubmenu = variant === 'submenu';
	const isPortaled = isDropdown || isSubmenu;

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

	useLayoutEffect(() => {
		const element = contentRef.current;
		if (!element || !isPortaled || !position || !('width' in position)) return;
		setFloatingPositionVars(element, position);
	}, [contentRef, isPortaled, position]);

	if (isPortaled && !isOpen) return null;

	const contentContext: MenuContextValue = {
		...parentContext,
		inContent: true,
		...contentState,
	};

	const panel = (
		<MenuProvider value={contentContext}>
			<div
				ref={contentRef}
				role="menu"
				id={`${menuId}-content`}
				aria-labelledby={`${menuId}-trigger`}
				className={cn(
					styles['menu__content'],
					isPortaled && styles['menu__content--floating'],
					isPortaled && styles[`menu__content--placement-${placement}`]
				)}
				onKeyDown={handleContentKeyDown}
				onMouseEnter={isSubmenu ? parentContext.cancelSubmenuClose : undefined}
				onMouseLeave={
					isSubmenu
						? () => {
								if (hasOpenChildSubmenu(contentRef.current)) return;
								parentContext.scheduleSubmenuClose();
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
			<FloatingPortal mounted={mounted} isOpen={isOpen}>
				{panel}
			</FloatingPortal>
		);
	}

	return panel;
};
