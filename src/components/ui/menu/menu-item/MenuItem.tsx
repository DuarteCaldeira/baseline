import { memo } from 'react';
import type { KeyboardEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Link } from '@/components/ui/link';

import { isActivationKey } from '../Menu.keyboard.utils';
import type { MenuItemProps } from '../Menu.types';
import { getMenuItemDataAttrs } from '../Menu.utils';
import { useMenuContext } from '../MenuContext';
import { useMenuItemHighlight } from '../hooks/useMenuItemHighlight';
import { MenuItemContent } from './MenuItemContent';

const MenuItemInner = ({
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
			onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
				if (!isActivationKey(event)) return;
				event.preventDefault();
				handleSelect();
			}}
		>
			{content}
		</Button>
	);
};

export const MenuItem = memo(MenuItemInner);
