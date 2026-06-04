import type { ComponentPropsWithoutRef } from 'react';
import NextLink from 'next/link';

import { cn } from '@/utils/cn';

import styles from './Link.module.scss';

export type LinkProps = ComponentPropsWithoutRef<typeof NextLink> & {
	variant?: 'default' | 'subtle' | 'inherit';
	external?: boolean;
};

export const Link = ({
	variant = 'default',
	external = false,
	className,
	children,
	...rest
}: LinkProps) => (
	<NextLink
		className={cn(styles.link, styles[`link--${variant}`], className)}
		target={external ? '_blank' : undefined}
		rel={external ? 'noopener noreferrer' : undefined}
		{...rest}
	>
		{children}
	</NextLink>
);
