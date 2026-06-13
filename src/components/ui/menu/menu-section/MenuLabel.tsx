import styles from '../Menu.module.scss';
import type { MenuLabelProps } from '../Menu.types';

export const MenuLabel = ({ children }: MenuLabelProps) => (
	<p role="presentation" className={styles['menu__label']}>
		{children}
	</p>
);
