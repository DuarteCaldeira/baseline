import type { InputHTMLAttributes } from 'react';

import { Stack } from '@/components/layout/stack';
import { cn } from '@/utils/cn';

import styles from './Radio.module.scss';

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
	label?: string;
	helperText?: string;
	error?: string;
};

export const Radio = ({
	label,
	helperText,
	error,
	id,
	disabled,
	className,
	...rest
}: RadioProps) => {
	const helperId = helperText && id ? `${id}-helper` : undefined;
	const errorId = error && id ? `${id}-error` : undefined;
	const describedBy =
		[helperId, errorId].filter(Boolean).join(' ') || undefined;

	return (
		<Stack
			gap="1"
			className={cn(
				styles.radio,
				error && styles['radio--error'],
				disabled && styles['radio--disabled'],
				className
			)}
		>
			<label className={styles['radio__label']} htmlFor={id}>
				<input
					type="radio"
					id={id}
					className={styles['radio__input']}
					disabled={disabled}
					aria-describedby={describedBy}
					{...rest}
				/>
				{label && <span className={styles['radio__text']}>{label}</span>}
			</label>
			{helperText && (
				<span id={helperId} className={styles['radio__helper']}>
					{helperText}
				</span>
			)}
			{error && (
				<span id={errorId} className={styles['radio__error']} role="alert">
					{error}
				</span>
			)}
		</Stack>
	);
};
