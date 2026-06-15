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

const resolveJustify = (justify: StackProps['justify']): string | undefined => {
	if (justify === 'between') return 'space-between';
	if (justify === 'around') return 'space-around';
	return justify;
};

const widthValues: Record<StackWidth, string> = {
	full: '100%',
	screen: '100vw',
	auto: 'auto',
	'fit-content': 'fit-content',
	'min-content': 'min-content',
	'max-content': 'max-content',
	'1/2': '50%',
	'1/3': '33.333%',
	'2/3': '66.667%',
	'1/4': '25%',
	'3/4': '75%',
};

const resolveWidth = (value: StackWidth): string => widthValues[value];

const resolveHeight = (value: StackHeight): string => {
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
