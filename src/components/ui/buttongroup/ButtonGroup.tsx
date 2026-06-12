import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/utils/cn';

import type { ButtonGroupOrientation } from './ButtonGroup.types';
import styles from './ButtonGroup.module.scss';

export type ButtonGroupProps = Omit<HTMLAttributes<HTMLDivElement>, 'className'> & {
	children: ReactNode;
	orientation?: ButtonGroupOrientation;
	fullWidth?: boolean;
};

export const ButtonGroup = ({
	children,
	orientation = 'horizontal',
	fullWidth = false,
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
				fullWidth && styles['button-group--full-width']
			)}
			{...rest}
		>
			{children}
		</div>
	);
};
