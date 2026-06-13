import type { MenuContentProps } from '../Menu.types';
import { MenuContentPanel } from './MenuContentPanel';
import { useMenuContext } from '../MenuContext';

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
