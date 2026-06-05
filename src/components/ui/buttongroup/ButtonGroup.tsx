import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/utils/cn';

import type { ButtonGroupOrientation } from './ButtonGroup.types';
import styles from './ButtonGroup.module.scss';

export type ButtonGroupProps = HTMLAttributes<HTMLDivElement> & {
	children: ReactNode;
	orientation?: ButtonGroupOrientation;
	fullWidth?: boolean;
};

export const ButtonGroup = ({
	children,
	orientation = 'horizontal',
	fullWidth = false,
	className,
	...rest
}: ButtonGroupProps) => {
	const orientationKey =
		orientation === 'vertical' ? 'vertical' : 'horizontal';

	return (
		<div
			role="group"
			className={cn(
				styles['button-group'],
				styles[`button-group--${orientationKey}`],
				fullWidth && styles['button-group--full-width'],
				className
			)}
			{...rest}
		>
			{children}
		</div>
	);
};
