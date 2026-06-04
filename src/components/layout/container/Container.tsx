import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/utils/cn';

import styles from './Container.module.scss';

export type ContainerProps = HTMLAttributes<HTMLDivElement> & {
	children: ReactNode;
	size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
};

export const Container = ({
	children,
	size = 'lg',
	className,
	...rest
}: ContainerProps) => (
	<div
		className={cn(styles.container, styles[`container--${size}`], className)}
		{...rest}
	>
		{children}
	</div>
);
