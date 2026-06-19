import type { Ref } from 'react';

import { ChevronRight } from 'lucide-react';

import { Stack } from '@/components/layout/stack';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

import styles from '../Menu.module.scss';
import type { MenuSubTriggerProps } from '../Menu.types';
import { buildTriggerProps } from '../Menu.utils';
import { useMenuContext } from '../MenuContext';
import { MenuItemContent } from '../menu-item/MenuItemContent';
import { useMenuItemHighlight } from '../hooks/useMenuItemHighlight';

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
				gap="sm"
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
