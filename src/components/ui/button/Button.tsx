import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/utils/cn';

import styles from './Button.module.scss';

type WithChildren = {
	children: ReactNode;
	icon?: LucideIcon;
};

type IconOnly = {
	children?: never;
	icon: LucideIcon;
	/** Required when no children — provides the accessible name for screen readers. */
	'aria-label': string;
};

type BaseProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: 'primary' | 'secondary' | 'ghost';
	size?: 'sm' | 'md' | 'lg';
};

export type ButtonProps = BaseProps & (WithChildren | IconOnly);

const ICON_SIZE: Record<NonNullable<BaseProps['size']>, number> = {
	sm: 14,
	md: 16,
	lg: 18,
};

export const Button = ({
	variant = 'primary',
	size = 'md',
	disabled,
	children,
	icon: IconComponent,
	className,
	...rest
}: ButtonProps) => (
	<button
		className={cn(
			styles.button,
			styles[`button--${variant}`],
			styles[`button--${size}`],
			!children && IconComponent && styles['button--icon-only'],
			disabled && styles['button--disabled'],
			className
		)}
		disabled={disabled}
		{...rest}
	>
		{IconComponent && (
			<IconComponent size={ICON_SIZE[size ?? 'md']} aria-hidden="true" />
		)}
		{children}
	</button>
);
