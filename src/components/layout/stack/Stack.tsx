import { createElement, forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/utils/cn';

import styles from './Stack.module.scss';

export type StackAs =
	| 'div'
	| 'span'
	| 'ul'
	| 'ol'
	| 'li'
	| 'nav'
	| 'section'
	| 'article'
	| 'aside'
	| 'header'
	| 'footer'
	| 'main'
	| 'form'
	| 'fieldset';

export type StackHeight =
	| 'full'
	| 'screen'
	| 'auto'
	| 'fit-content'
	| 'min-content'
	| 'max-content';

export type StackWidth =
	| 'full'
	| 'screen'
	| 'auto'
	| 'fit-content'
	| 'min-content'
	| 'max-content'
	| '1/2'
	| '1/3'
	| '1/4'
	| '2/3'
	| '3/4';

type StackProps = HTMLAttributes<HTMLElement> & {
	as?: StackAs;
	children: ReactNode;
	direction?: 'row' | 'column';
	gap?: '0' | '1' | '2' | '3' | '4' | '6' | '8' | '10';
	align?: 'start' | 'center' | 'end' | 'stretch';
	justify?: 'start' | 'center' | 'end' | 'between' | 'around';
	wrap?: boolean;
	width?: StackWidth;
	height?: StackHeight;
};

export const Stack = forwardRef<HTMLElement, StackProps>(
	(
		{
			as: Component = 'div',
			children,
			direction = 'column',
			gap = '4',
			align,
			justify,
			wrap,
			width = 'full',
			height,
			className,
			...rest
		},
		ref
	) => {
		const widthKey = width?.replace('/', '_');

		return createElement(
			Component,
			{
				ref,
				className: cn(
					styles.stack,
					styles[`stack--direction-${direction}`],
					styles[`stack--gap-${gap}`],
					align && styles[`stack--align-${align}`],
					justify && styles[`stack--justify-${justify}`],
					wrap ? styles['stack--wrap'] : styles['stack--nowrap'],
					width && styles[`stack--width-${widthKey}`],
					height && styles[`stack--height-${height}`],
					className
				),
				...rest,
			},
			children
		);
	}
);

Stack.displayName = 'Stack';
