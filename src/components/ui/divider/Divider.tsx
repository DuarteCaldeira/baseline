import type { HTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

import styles from './Divider.module.scss';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'default' | 'strong';
export type DividerWidth = 'full' | 'contained';

type DividerProps = HTMLAttributes<HTMLElement> & {
	orientation?: DividerOrientation;
	variant?: DividerVariant;
	width?: DividerWidth;
};

export const Divider = ({
	orientation = 'horizontal',
	variant = 'default',
	width = 'full',
	className,
	...rest
}: DividerProps) => {
	const dividerClassName = cn(
		styles.divider,
		styles[`divider--${orientation}`],
		width === 'contained' && styles['divider--contained'],
		variant === 'strong' && styles['divider--strong'],
		className
	);

	if (orientation === 'vertical') {
		return (
			<div
				role="separator"
				aria-orientation="vertical"
				className={dividerClassName}
				{...rest}
			/>
		);
	}

	return <hr className={dividerClassName} {...rest} />;
};
