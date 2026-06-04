import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/utils/cn';

import styles from './Button.module.scss';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'ghost';
	size?: 'sm' | 'md' | 'lg';
	children: ReactNode;
}

export function Button({
	variant = 'primary',
	size = 'md',
	disabled,
	children,
	className,
	...rest
}: ButtonProps) {
	return (
		<button
			className={cn(
				styles.button,
				styles[`button--${variant}`],
				styles[`button--${size}`],
				disabled && styles['button--disabled'],
				className
			)}
			disabled={disabled}
			{...rest}
		>
			{children}
		</button>
	);
}
