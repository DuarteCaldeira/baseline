import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/utils/cn';

import styles from './Link.module.scss';

type LinkProps = ComponentPropsWithoutRef<'a'> & {
	variant?: 'default' | 'subtle' | 'inherit';
	external?: boolean;
};

export const Link = ({
	variant = 'default',
	external = false,
	children,
	...rest
}: LinkProps) => (
	<a
		className={cn(styles.link, styles[`link--${variant}`])}
		target={external ? '_blank' : undefined}
		rel={external ? 'noopener noreferrer' : undefined}
		{...rest}
	>
		{children}
	</a>
);
