import type { SelectHTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

import styles from './Select.module.scss';

export interface SelectOption {
	value: string;
	label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
	label?: string;
	options: SelectOption[];
	error?: string;
}

export function Select({
	label,
	options,
	error,
	className,
	id,
	...rest
}: SelectProps) {
	return (
		<div className={styles.wrapper}>
			{label && (
				<label className={styles.label} htmlFor={id}>
					{label}
				</label>
			)}
			<select
				id={id}
				className={cn(
					styles.select,
					error && styles['select--error'],
					className
				)}
				{...rest}
			>
				{options.map((opt) => (
					<option key={opt.value} value={opt.value}>
						{opt.label}
					</option>
				))}
			</select>
			{error && <span className={styles.error}>{error}</span>}
		</div>
	);
}
