import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

import { Icon } from '@/components/ui/icon';
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
	/** Square padding for icon-only buttons rendered as children. */
	iconOnly?: boolean;
};

export type ButtonProps = BaseProps & (WithChildren | IconOnly);

const ICON_SIZE: Record<NonNullable<BaseProps['size']>, 'sm' | 'md' | 'lg'> = {
	sm: 'sm',
	md: 'md',
	lg: 'lg',
};

export const Button = ({
	variant = 'primary',
	size = 'md',
	iconOnly,
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
			(iconOnly || (!children && IconComponent)) &&
				styles['button--icon-only'],
			disabled && styles['button--disabled'],
			className
		)}
		disabled={disabled}
		{...rest}
	>
		{IconComponent && (
			<Icon icon={IconComponent} size={ICON_SIZE[size ?? 'md']} />
		)}
		{children}
	</button>
);
