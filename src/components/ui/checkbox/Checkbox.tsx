import type { InputHTMLAttributes } from 'react';

import { FormField } from '@/components/patterns/form-field';
import { resolveFieldIds } from '@/utils/fieldIds';
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
	const { describedBy } = resolveFieldIds(id, { helperText, error });

	return (
		<div
			className={cn(
				styles.checkbox,
				error && styles['checkbox--error'],
				disabled && styles['checkbox--disabled'],
				className
			)}
		>
			<FormField fieldId={id} helperText={helperText} error={error} gap="1">
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
			</FormField>
		</div>
	);
};
