import type { InputHTMLAttributes, ReactNode } from 'react';

import { Stack } from '@/components/layout/stack';
import { FormField } from '@/components/patterns/form-field';
import { cn } from '@/utils/cn';
import { getFieldControlProps } from '@/utils/fieldIds';

import styles from './Input.module.scss';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
	label?: string;
	helperText?: string;
	error?: string;
	leftAffix?: ReactNode;
	rightAffix?: ReactNode;
};

const InputAffix = ({
	children,
	position,
}: {
	children: ReactNode;
	position: 'left' | 'right';
}) => (
	<Stack
		as="span"
		align="center"
		justify="center"
		padding="md"
		height="full"
		width="auto"
		className={cn(styles['input__affix'], styles[`input__affix--${position}`])}
		aria-hidden="true"
	>
		{children}
	</Stack>
);

export const Input = ({
	label,
	helperText,
	error,
	className,
	id,
	leftAffix,
	rightAffix,
	required,
	...rest
}: InputProps) => {
	const fieldControlProps = getFieldControlProps(id, { helperText, error });
	const hasAffixes = leftAffix != null || rightAffix != null;

	const inputElement = (
		<input
			id={id}
			className={cn(
				styles.input,
				hasAffixes && styles['input--embedded'],
				error && !hasAffixes && styles['input--error'],
				className
			)}
			{...fieldControlProps}
			required={required}
			{...rest}
		/>
	);

	return (
		<FormField
			fieldId={id}
			label={label}
			required={required}
			helperText={helperText}
			error={error}
		>
			{hasAffixes ? (
				<Stack
					direction="row"
					align="stretch"
					className={cn(
						styles['input__wrapper'],
						error && styles['input__wrapper--error']
					)}
				>
					{leftAffix != null && (
						<InputAffix position="left">{leftAffix}</InputAffix>
					)}
					{inputElement}
					{rightAffix != null && (
						<InputAffix position="right">{rightAffix}</InputAffix>
					)}
				</Stack>
			) : (
				inputElement
			)}
		</FormField>
	);
};
