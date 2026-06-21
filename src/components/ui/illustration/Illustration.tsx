import type { ReactNode } from 'react';

import type { Size } from '@/types/common';
import { cn } from '@/utils/cn';

import styles from './Illustration.module.scss';

type IllustrationProps = {
	children: ReactNode;
	size?: Size;
	/** Accessible label. When provided the illustration is announced by screen readers. */
	label?: string;
	className?: string;
};

export const Illustration = ({
	children,
	size = 'md',
	label,
	className,
}: IllustrationProps) => (
	<span
		className={cn(
			styles.illustration,
			styles[`illustration--${size}`],
			className
		)}
		data-illustration=""
		role={label ? 'img' : undefined}
		aria-label={label}
		aria-hidden={!label ? true : undefined}
	>
		{children}
	</span>
);
