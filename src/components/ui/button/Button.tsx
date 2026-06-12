import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

import type { LucideIcon } from 'lucide-react';

import { Icon } from '@/components/ui/icon';
import { Spinner } from '@/components/ui/spinner';
import type { SpinnerSize } from '@/components/ui/spinner';
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
	iconOnly?: boolean;
	isLoading?: boolean;
};

export type ButtonProps = BaseProps & (WithChildren | IconOnly);

const ICON_SIZE: Record<NonNullable<BaseProps['size']>, 'sm' | 'md' | 'lg'> = {
	sm: 'sm',
	md: 'md',
	lg: 'lg',
};

const SPINNER_SIZE: Record<NonNullable<BaseProps['size']>, SpinnerSize> = {
	sm: 'sm',
	md: 'md',
	lg: 'lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			variant = 'primary',
			size = 'md',
			iconOnly,
			isLoading = false,
			disabled,
			children,
			icon: IconComponent,
			...rest
		},
		ref
	) => {
		const isDisabled = disabled || isLoading;
		const buttonProps = { ...rest } as ButtonHTMLAttributes<HTMLButtonElement>;
		delete buttonProps.className;

		return (
			<button
				ref={ref}
				className={cn(
					styles.button,
					styles[`button--${variant}`],
					styles[`button--${size}`],
					(iconOnly || (!children && IconComponent)) &&
						styles['button--icon-only'],
					isDisabled && styles['button--disabled'],
					isLoading && styles['button--loading']
				)}
				disabled={isDisabled}
				aria-busy={isLoading || undefined}
				{...buttonProps}
			>
				{isLoading ? (
					<Spinner size={SPINNER_SIZE[size ?? 'md']} />
				) : (
					IconComponent && (
						<Icon icon={IconComponent} size={ICON_SIZE[size ?? 'md']} />
					)
				)}
				{children}
			</button>
		);
	}
);

Button.displayName = 'Button';
