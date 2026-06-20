import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/utils/cn';

import styles from './Overlay.module.scss';

type OverlayProps = Omit<HTMLAttributes<HTMLDivElement>, 'className'> & {
	center?: boolean;
	blur?: boolean;
	subtle?: boolean;
	slowEnter?: boolean;
	closing?: boolean;
	children?: ReactNode;
};

export const Overlay = ({
	center,
	blur,
	subtle,
	slowEnter,
	closing,
	children,
	...rest
}: OverlayProps) => (
	<div
		className={cn(
			styles.overlay,
			center && styles['overlay--center'],
			blur && styles['overlay--blur'],
			subtle && styles['overlay--subtle'],
			slowEnter && styles['overlay--slow-enter'],
			closing && styles['overlay--closing']
		)}
		{...rest}
	>
		{children}
	</div>
);
