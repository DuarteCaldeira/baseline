import type { MenuSubContentProps } from '../Menu.types';
import { MenuContentPanel } from '../menu-content';

export const MenuSubContent = ({ children }: MenuSubContentProps) => (
	<MenuContentPanel align="start" variant="submenu">
		{children}
	</MenuContentPanel>
);
