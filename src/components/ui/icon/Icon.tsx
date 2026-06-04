import type { LucideIcon, LucideProps } from 'lucide-react';

import type { Size } from '@/types/common';
import { cn } from '@/utils/cn';

import styles from './Icon.module.scss';

export type IconVariant =
	| 'default'
	| 'muted'
	| 'subtle'
	| 'primary'
	| 'success'
	| 'warning'
	| 'error'
	| 'info';

export type IconProps = Pick<LucideProps, 'strokeWidth' | 'absoluteStrokeWidth'> & {
	icon: LucideIcon;
	size?: Size;
	variant?: IconVariant;
	/** Accessible label. When provided the icon is announced by screen readers;
	 *  when omitted it is treated as decorative (aria-hidden). */
	label?: string;
	className?: string;
};

const SIZE_MAP: Record<Size, number> = {
	sm: 16,
	md: 20,
	lg: 24,
};

export const Icon = ({
	icon: IconComponent,
	size = 'md',
	variant = 'default',
	label,
	className,
	...rest
}: IconProps) => (
	<span
		className={cn(styles.icon, styles[`icon--${variant}`], className)}
		role={label ? 'img' : undefined}
		aria-label={label}
		aria-hidden={!label ? true : undefined}
	>
		<IconComponent size={SIZE_MAP[size]} {...rest} />
	</span>
);
