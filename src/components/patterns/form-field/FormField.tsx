import type { ReactNode } from 'react';

import { Stack } from '@/components/layout/stack';
import type { StackProps } from '@/components/layout/stack';
import { getLabelId, resolveFieldIds } from '@/utils/fieldIds';

import styles from './FormField.module.scss';

type FormFieldProps = Omit<StackProps, 'children' | 'className'> & {
	fieldId?: string;
	label?: string;
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
	helperText,
	error,
	gap = '2',
	children,
	...rest
}: FormFieldProps) => {
	const { helperId, errorId } = resolveFieldIds(fieldId, {
		helperText,
		error,
	});

	return (
		<Stack gap={gap} className={styles['form-field']} {...rest}>
			{label && (
				<label
					id={fieldId ? getLabelId(fieldId) : undefined}
					htmlFor={fieldId}
					className={styles['form-field__label']}
				>
					{label}
				</label>
			)}
			{children}
			{helperText && renderMessage(helperId, 'helper', helperText)}
			{error && renderMessage(errorId, 'error', error)}
		</Stack>
	);
};
