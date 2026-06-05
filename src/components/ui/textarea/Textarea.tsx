import type { TextareaHTMLAttributes } from 'react';

import { Stack } from '@/components/layout/stack';
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
	const helperId = helperText && id ? `${id}-helper` : undefined;
	const errorId = error && id ? `${id}-error` : undefined;
	const describedBy =
		[helperId, errorId].filter(Boolean).join(' ') || undefined;

	return (
		<Stack gap="2" className={styles['textarea__wrapper']}>
			{label && (
				<label className={styles['textarea__label']} htmlFor={id}>
					{label}
				</label>
			)}
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
			{helperText && (
				<span id={helperId} className={styles['textarea__helper']}>
					{helperText}
				</span>
			)}
			{error && (
				<span id={errorId} className={styles['textarea__error']} role="alert">
					{error}
				</span>
			)}
		</Stack>
	);
};
