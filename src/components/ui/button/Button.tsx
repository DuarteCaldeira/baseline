import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/utils/cn';

import styles from './Button.module.scss';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: 'primary' | 'secondary' | 'ghost';
	size?: 'sm' | 'md' | 'lg';
	children: ReactNode;
};

export const Button = ({
	variant = 'primary',
	size = 'md',
	disabled,
	children,
	className,
	...rest
}: ButtonProps) => (
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
