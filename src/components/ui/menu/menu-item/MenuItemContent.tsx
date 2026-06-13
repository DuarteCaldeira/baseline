import type { ReactNode } from 'react';

import { Stack } from '@/components/layout/stack';
import { Icon } from '@/components/ui/icon';

import type { MenuItemProps } from '../Menu.types';

type MenuItemContentProps = {
	icon?: MenuItemProps['icon'];
	destructive?: boolean;
	children: ReactNode;
};

export const MenuItemContent = ({
	icon,
	destructive,
	children,
}: MenuItemContentProps) => (
	<Stack direction="row" gap="2" align="center">
		{icon && (
			<Icon
				icon={icon}
				size="sm"
				variant={destructive ? 'error' : 'muted'}
				aria-hidden
			/>
		)}
		<span>{children}</span>
	</Stack>
);
