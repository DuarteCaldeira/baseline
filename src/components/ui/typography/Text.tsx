import { createElement } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/utils/cn';

import styles from './Typography.module.scss';

export type TextAs = 'p' | 'span' | 'div' | 'small' | 'strong' | 'em';
export type TextVariant = 'body' | 'body-sm' | 'lead' | 'caption' | 'label';
export type TextTone = 'default' | 'muted' | 'subtle' | 'inherit';

export type TextProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
	as?: TextAs;
	children: ReactNode;
	truncate?: boolean;
	variant?: TextVariant;
	tone?: TextTone;
};

export const Text = ({
	as: Component = 'p',
	children,
	truncate = false,
	variant = 'body',
	tone = 'default',
	className,
	...rest
}: TextProps) =>
	createElement(
		Component,
		{
			className: cn(
				styles.text,
				styles[`text--${variant}`],
				styles[`text--tone-${tone}`],
				truncate && styles.truncate,
				className
			),
			...rest,
		},
		children
	);
