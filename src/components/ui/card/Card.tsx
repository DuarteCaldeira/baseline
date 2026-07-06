import type { HTMLAttributes, ReactNode } from 'react';

import { Stack } from '@/components/layout/stack';
import type { StackAs } from '@/components/layout/stack';
import type { StackSpacing, StackSpacingValue } from '@/components/layout/stack';
import { cn } from '@/utils/cn';

import styles from './Card.module.scss';

export type CardProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
	as?: StackAs;
	children: ReactNode;
	fill?: boolean;
	overflowHidden?: boolean;
	gap?: StackSpacing;
	padding?: StackSpacingValue;
};

export const Card = ({
	as = 'section',
	children,
	className,
	fill = false,
	overflowHidden = false,
	gap = 'lg',
	padding = 'lg',
	...rest
}: CardProps) => (
	<Stack
		as={as}
		gap={gap}
		padding={padding}
		height={fill ? 'full' : undefined}
		className={cn(
			styles.card,
			fill && styles['card--fill'],
			overflowHidden && styles['card--overflow-hidden'],
			className
		)}
		{...rest}
	>
		{children}
	</Stack>
);
