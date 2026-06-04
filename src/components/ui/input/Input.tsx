import type { InputHTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

import styles from './Input.module.scss';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
	label?: string;
	error?: string;
};

export const Input = ({ label, error, className, id, ...rest }: InputProps) => {
	const errorId = error && id ? `${id}-error` : undefined;

	return (
		<div className={styles['input__wrapper']}>
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
				aria-describedby={errorId}
				{...rest}
			/>
			{error && (
				<span id={errorId} className={styles['input__error']} role="alert">
					{error}
				</span>
			)}
		</div>
	);
};
