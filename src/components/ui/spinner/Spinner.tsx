import type { Size } from '@/types/common';
import { cn } from '@/utils/cn';

import styles from './Spinner.module.scss';

export type SpinnerSize = Size | 'xl';

export type SpinnerVariant =
	| 'default'
	| 'muted'
	| 'subtle'
	| 'primary'
	| 'inverse'
	| 'success'
	| 'warning'
	| 'error'
	| 'info';

type SpinnerProps = {
	size?: SpinnerSize;
	variant?: SpinnerVariant;
	/** Announced by screen readers when provided. Omit inside controls that set aria-busy. */
	label?: string;
};

export const Spinner = ({
	size = 'md',
	variant = 'default',
	label,
}: SpinnerProps) => (
	<span
		className={cn(
			styles.spinner,
			styles[`spinner--${size}`],
			styles[`spinner--${variant}`]
		)}
		role={label ? 'status' : undefined}
		aria-label={label}
		aria-live={label ? 'polite' : undefined}
		aria-hidden={!label ? true : undefined}
	/>
);
