import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/utils/cn';

import styles from './Container.module.scss';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function Container({
	children,
	size = 'lg',
	className,
	...rest
}: ContainerProps) {
	return (
		<div
			className={cn(styles.container, styles[`container--${size}`], className)}
			{...rest}
		>
			{children}
		</div>
	);
}
