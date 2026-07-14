import type { CSSProperties, HTMLAttributes } from 'react';

import type { Size } from '@/types/common';
import { cn } from '@/utils/cn';

import styles from './Progress.module.scss';

export type ProgressVariant =
	'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';

export type ProgressProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	value?: number;
	max?: number;
	size?: Size;
	variant?: ProgressVariant;
	indeterminate?: boolean;
	label?: string;
};

const clamp = (value: number, min: number, max: number) =>
	Math.min(Math.max(value, min), max);

export const Progress = ({
	value = 0,
	max = 100,
	size = 'md',
	variant = 'primary',
	indeterminate = false,
	label = 'Loading progress',
	className,
	style,
	...rest
}: ProgressProps) => {
	const safeMax = max > 0 ? max : 100;
	const safeValue = clamp(value, 0, safeMax);
	const percentage = (safeValue / safeMax) * 100;

	return (
		<div
			role="progressbar"
			aria-label={label}
			aria-valuemin={0}
			aria-valuemax={safeMax}
			aria-valuenow={indeterminate ? undefined : safeValue}
			aria-valuetext={indeterminate ? 'Loading' : `${Math.round(percentage)}%`}
			className={cn(
				styles.progress,
				styles[`progress--${size}`],
				styles[`progress--${variant}`],
				indeterminate && styles['progress--indeterminate'],
				className
			)}
			style={
				{
					'--progress-value': `${percentage}%`,
					...style,
				} as CSSProperties
			}
			{...rest}
		>
			<span className={styles.progress__indicator} />
		</div>
	);
};
