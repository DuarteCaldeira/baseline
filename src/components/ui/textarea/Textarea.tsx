import type { TextareaHTMLAttributes } from 'react';

import { FormField } from '@/components/patterns/form-field';
import { resolveFieldIds } from '@/utils/fieldIds';
import { cn } from '@/utils/cn';

import styles from './Textarea.module.scss';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
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
	...rest
}: TextareaProps) => {
	const { describedBy } = resolveFieldIds(id, { helperText, error });

	return (
		<FormField fieldId={id} label={label} helperText={helperText} error={error}>
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
				{...rest}
			/>
		</FormField>
	);
};
