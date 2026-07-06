import { createElement } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/utils/cn';

import styles from './Typography.module.scss';

export type HeadingAs = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type HeadingSize = 'sm' | 'md' | 'lg' | 'xl';
export type HeadingTone = 'default' | 'muted' | 'inherit';

export type HeadingProps = Omit<HTMLAttributes<HTMLHeadingElement>, 'children'> & {
	as?: HeadingAs;
	children: ReactNode;
	size?: HeadingSize;
	tone?: HeadingTone;
};

const DEFAULT_SIZE_BY_LEVEL: Record<HeadingAs, HeadingSize> = {
	h1: 'xl',
	h2: 'lg',
	h3: 'md',
	h4: 'sm',
	h5: 'sm',
	h6: 'sm',
};

export const Heading = ({
	as: Component = 'h2',
	children,
	size,
	tone = 'default',
	className,
	...rest
}: HeadingProps) =>
	createElement(
		Component,
		{
			className: cn(
				styles.heading,
				styles[`heading--${size ?? DEFAULT_SIZE_BY_LEVEL[Component]}`],
				styles[`heading--tone-${tone}`],
				className
			),
			...rest,
		},
		children
	);
