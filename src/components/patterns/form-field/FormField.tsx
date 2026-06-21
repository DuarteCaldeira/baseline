import type { ComponentProps, ReactNode } from 'react';

import { Stack } from '@/components/layout/stack';
import { getLabelId, resolveFieldIds } from '@/utils/fieldIds';

import styles from './FormField.module.scss';
import {
	OPTIONAL_FIELD_LABEL,
	isOptionalFieldLabel,
} from './FormField.utils';

type StackProps = ComponentProps<typeof Stack>;

type FormFieldProps = Omit<StackProps, 'children' | 'className'> & {
	fieldId?: string;
	label?: string;
	/** When true, shows "(opcional)" beside the label. */
	optional?: boolean;
	/** When set with a label and `optional` is omitted, optional is inferred from `!required`. */
	required?: boolean;
	helperText?: string;
	error?: string;
	children: ReactNode;
};

const renderMessage = (
	id: string | undefined,
	variant: 'helper' | 'error',
	children: ReactNode
) => (
	<span
		id={id}
		className={
			variant === 'helper'
				? styles['form-field__helper']
				: styles['form-field__error']
		}
		role={variant === 'error' ? 'alert' : undefined}
	>
		{children}
	</span>
);

export const FormField = ({
	fieldId,
	label,
	optional,
	required,
	helperText,
	error,
	gap = 'sm',
	children,
	...rest
}: FormFieldProps) => {
	const { helperId, errorId } = resolveFieldIds(fieldId, {
		helperText,
		error,
	});
	const showOptional =
		optional ?? isOptionalFieldLabel(label, required);

	return (
		<Stack gap={gap} className={styles['form-field']} {...rest}>
			{label && (
				<label
					id={fieldId ? getLabelId(fieldId) : undefined}
					htmlFor={fieldId}
					className={styles['form-field__label']}
				>
					<span>{label}</span>
					{showOptional && (
						<span className={styles['form-field__optional']}>
							{OPTIONAL_FIELD_LABEL}
						</span>
					)}
				</label>
			)}
			{children}
			{helperText && renderMessage(helperId, 'helper', helperText)}
			{error && renderMessage(errorId, 'error', error)}
		</Stack>
	);
};
