import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Loader2 } from 'lucide-react';

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

type BaseProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
	variant?: 'primary' | 'secondary' | 'ghost';
	size?: 'sm' | 'md' | 'lg';
	/** Square padding for icon-only buttons rendered as children. */
	iconOnly?: boolean;
	/** Shows a spinner and prevents interaction while an action is in progress. */
	loading?: boolean;
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
	loading = false,
	disabled,
	children,
	icon: IconComponent,
	...rest
}: ButtonProps) => {
	const isDisabled = disabled || loading;
	const buttonProps = { ...rest } as ButtonHTMLAttributes<HTMLButtonElement>;
	delete buttonProps.className;

	return (
		<button
			className={cn(
				styles.button,
				styles[`button--${variant}`],
				styles[`button--${size}`],
				(iconOnly || (!children && IconComponent)) &&
					styles['button--icon-only'],
				isDisabled && styles['button--disabled'],
				loading && styles['button--loading']
			)}
			disabled={isDisabled}
			aria-busy={loading || undefined}
			{...buttonProps}
		>
			{loading ? (
				<span className={styles['button__spinner']} aria-hidden="true">
					<Icon icon={Loader2} size={ICON_SIZE[size ?? 'md']} />
				</span>
			) : (
				IconComponent && (
					<Icon icon={IconComponent} size={ICON_SIZE[size ?? 'md']} />
				)
			)}
			{children}
		</button>
	);
};
