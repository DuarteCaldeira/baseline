import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/utils/cn';

import { enhanceGroupChildren } from '@/utils/enhanceGroupChildren';

import type {
	ButtonGroupItemPosition,
	ButtonGroupOrientation,
} from './ButtonGroup.types';
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

	const getItemPosition = (
		index: number,
		total: number
	): ButtonGroupItemPosition => {
		if (total <= 1) return 'only';
		if (index === 0) return 'first';
		if (index === total - 1) return 'last';
		return 'middle';
	};

	const enhancedChildren = enhanceGroupChildren(
		children,
		(index, total) => {
			const position = getItemPosition(index, total);

			return cn(
				styles['button-group__item'],
				styles[`button-group__item--${orientationKey}-${position}`]
			);
		}
	);

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
			{enhancedChildren}
		</div>
	);
};
