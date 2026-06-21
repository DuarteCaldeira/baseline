import type { TextareaHTMLAttributes } from 'react';

import { FormField } from '@/components/patterns/form-field';
import { cn } from '@/utils/cn';
import { resolveFieldIds } from '@/utils/fieldIds';

import styles from './Textarea.module.scss';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
	label?: string;
	helperText?: string;
	error?: string;
	resize?: 'none' | 'vertical' | 'horizontal' | 'both';
};

export const Textarea = ({
	label,
	helperText,
	error,
	resize = 'vertical',
	className,
	id,
	required,
	...rest
}: TextareaProps) => {
	const { describedBy } = resolveFieldIds(id, { helperText, error });

	return (
		<FormField
			fieldId={id}
			label={label}
			required={required}
			helperText={helperText}
			error={error}
		>
			<textarea
				id={id}
				className={cn(
					styles.textarea,
					styles[`textarea--resize-${resize}`],
					error && styles['textarea--error'],
					className
				)}
				aria-invalid={error ? true : undefined}
				aria-describedby={describedBy}
				required={required}
				{...rest}
			/>
		</FormField>
	);
};
