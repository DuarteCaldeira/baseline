import type { InputHTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

import styles from './Input.module.scss';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
}

export function Input({ label, error, className, id, ...rest }: InputProps) {
	return (
		<div className={styles.wrapper}>
			{label && (
				<label className={styles.label} htmlFor={id}>
					{label}
				</label>
			)}
			<input
				id={id}
				className={cn(styles.input, error && styles['input--error'], className)}
				{...rest}
			/>
			{error && <span className={styles.error}>{error}</span>}
		</div>
	);
}
