import type { InputHTMLAttributes } from 'react';

import { FormField } from '@/components/patterns/form-field';
import { resolveFieldIds } from '@/utils/fieldIds';
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
	const { describedBy } = resolveFieldIds(id, { helperText, error });

	return (
		<FormField fieldId={id} label={label} helperText={helperText} error={error}>
			<input
				id={id}
				className={cn(styles.input, error && styles['input--error'], className)}
				aria-invalid={error ? true : undefined}
				aria-describedby={describedBy}
				{...rest}
			/>
		</FormField>
	);
};
