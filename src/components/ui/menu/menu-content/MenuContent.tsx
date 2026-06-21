import type { MenuContentProps } from '../Menu.types';
import { useMenuContext } from '../MenuContext';
import { MenuContentPanel } from './MenuContentPanel';

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
