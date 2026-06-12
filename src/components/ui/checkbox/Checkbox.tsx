import type { InputHTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

import styles from './Checkbox.module.scss';

export type CheckboxProps = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	'type'
> & {
	label?: string;
	helperText?: string;
	error?: string;
};

export const Checkbox = ({
	label,
	helperText,
	error,
	id,
	disabled,
	className,
	...rest
}: CheckboxProps) => {
	const helperId = helperText && id ? `${id}-helper` : undefined;
	const errorId = error && id ? `${id}-error` : undefined;
	const describedBy =
		[helperId, errorId].filter(Boolean).join(' ') || undefined;

	return (
		<div
			className={cn(
				styles.checkbox,
				error && styles['checkbox--error'],
				disabled && styles['checkbox--disabled'],
				className
			)}
		>
			<label className={styles['checkbox__label']} htmlFor={id}>
				<input
					type="checkbox"
					id={id}
					className={styles['checkbox__input']}
					disabled={disabled}
					aria-invalid={error ? true : undefined}
					aria-describedby={describedBy}
					{...rest}
				/>
				{label && <span className={styles['checkbox__text']}>{label}</span>}
			</label>
			{helperText && (
				<span id={helperId} className={styles['checkbox__helper']}>
					{helperText}
				</span>
			)}
			{error && (
				<span id={errorId} className={styles['checkbox__error']} role="alert">
					{error}
				</span>
			)}
		</div>
	);
};
