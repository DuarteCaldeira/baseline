import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/utils/cn';

import styles from './Stack.module.scss';

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	direction?: 'row' | 'column';
	gap?: '1' | '2' | '3' | '4' | '6' | '8';
	align?: 'start' | 'center' | 'end' | 'stretch';
	justify?: 'start' | 'center' | 'end' | 'between' | 'around';
	wrap?: boolean;
}

export function Stack({
	children,
	direction = 'column',
	gap = '4',
	align,
	justify,
	wrap,
	className,
	style,
	...rest
}: StackProps) {
	const inlineStyle: CSSProperties = {
		'--stack-direction': direction,
		'--stack-align': align,
		'--stack-justify':
			justify === 'between'
				? 'space-between'
				: justify === 'around'
					? 'space-around'
					: justify,
		'--stack-wrap': wrap ? 'wrap' : 'nowrap',
		...style,
	} as CSSProperties;

	return (
		<div
			className={cn(styles.stack, styles[`stack--gap-${gap}`], className)}
			style={inlineStyle}
			{...rest}
		>
			{children}
		</div>
	);
}
