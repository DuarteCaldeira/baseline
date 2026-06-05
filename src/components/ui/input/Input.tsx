import type { InputHTMLAttributes } from 'react';

import { Stack } from '@/components/layout/stack';
import { cn } from '@/utils/cn';

import styles from './Input.module.scss';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
	label?: string;
	helperText?: string;
	error?: string;
};

export const Input = ({
	label,
	helperText,
	error,
	className,
	id,
	...rest
}: InputProps) => {
	const helperId = helperText && id ? `${id}-helper` : undefined;
	const errorId = error && id ? `${id}-error` : undefined;
	const describedBy =
		[helperId, errorId].filter(Boolean).join(' ') || undefined;

	return (
		<Stack gap="2" className={styles['input__wrapper']}>
			{label && (
				<label className={styles['input__label']} htmlFor={id}>
					{label}
				</label>
			)}
			<input
				id={id}
				className={cn(
					styles.input,
					error && styles['input--error'],
					className
				)}
				aria-invalid={error ? true : undefined}
				aria-describedby={describedBy}
				{...rest}
			/>
			{helperText && (
				<span id={helperId} className={styles['input__helper']}>
					{helperText}
				</span>
			)}
			{error && (
				<span id={errorId} className={styles['input__error']} role="alert">
					{error}
				</span>
			)}
		</Stack>
	);
};
