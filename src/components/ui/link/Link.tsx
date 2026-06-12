import type { ComponentPropsWithoutRef } from 'react';
import NextLink from 'next/link';

import { cn } from '@/utils/cn';

import styles from './Link.module.scss';

export type LinkProps = Omit<ComponentPropsWithoutRef<typeof NextLink>, 'className'> & {
	variant?: 'default' | 'subtle' | 'inherit';
	external?: boolean;
};

export const Link = ({
	variant = 'default',
	external = false,
	children,
	...rest
}: LinkProps) => (
	<NextLink
		className={cn(styles.link, styles[`link--${variant}`])}
		target={external ? '_blank' : undefined}
		rel={external ? 'noopener noreferrer' : undefined}
		{...rest}
	>
		{children}
	</NextLink>
);
