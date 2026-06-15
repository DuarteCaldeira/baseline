import { createElement, forwardRef } from 'react';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

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

export type StackSize =
	| 'full'
	| 'screen'
	| 'auto'
	| 'fit-content'
	| 'min-content'
	| 'max-content';

type StackProps = HTMLAttributes<HTMLElement> & {
	as?: StackAs;
	children: ReactNode;
	direction?: 'row' | 'column';
	gap?: '1' | '2' | '3' | '4' | '6' | '8' | '10';
	align?: 'start' | 'center' | 'end' | 'stretch';
	justify?: 'start' | 'center' | 'end' | 'between' | 'around';
	wrap?: boolean;
	width?: StackSize;
	height?: StackSize;
};

const resolveJustify = (justify: StackProps['justify']): string | undefined => {
	if (justify === 'between') return 'space-between';
	if (justify === 'around') return 'space-around';
	return justify;
};

const resolveWidth = (value: StackSize): string => {
	if (value === 'full') return '100%';
	if (value === 'screen') return '100vw';
	return value;
};

const resolveHeight = (value: StackSize): string => {
	if (value === 'full') return '100%';
	if (value === 'screen') return '100vh';
	return value;
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
			width,
			height,
			className,
			style,
			...rest
		},
		ref
	) => {
		const inlineStyle: CSSProperties = {
			'--stack-direction': direction,
			'--stack-align': align,
			'--stack-justify': resolveJustify(justify),
			'--stack-wrap': wrap ? 'wrap' : 'nowrap',
			...(width && { '--stack-width': resolveWidth(width) }),
			...(height && { '--stack-height': resolveHeight(height) }),
			...style,
		} as CSSProperties;

		return createElement(
			Component,
			{
				ref,
				className: cn(styles.stack, styles[`stack--gap-${gap}`], className),
				style: inlineStyle,
				...rest,
			},
			children
		);
	}
);

Stack.displayName = 'Stack';
