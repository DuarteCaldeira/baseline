import type { InputHTMLAttributes } from 'react';

import { FormField } from '@/components/patterns/form-field';
import { cn } from '@/utils/cn';
import { resolveFieldIds } from '@/utils/fieldIds';

import styles from './Radio.module.scss';

type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
	label?: string;
	helperText?: string;
	error?: string;
};

export const Radio = ({
	label,
	helperText,
	error,
	id,
	disabled,
	className,
	...rest
}: RadioProps) => {
	const { describedBy } = resolveFieldIds(id, { helperText, error });

	return (
		<div
			className={cn(
				styles.radio,
				error && styles['radio--error'],
				disabled && styles['radio--disabled'],
				className
			)}
		>
			<FormField fieldId={id} helperText={helperText} error={error} gap="xs">
				<label className={styles['radio__label']} htmlFor={id}>
					<input
						type="radio"
						id={id}
						className={styles['radio__input']}
						disabled={disabled}
						aria-describedby={describedBy}
						{...rest}
					/>
					{label && <span className={styles['radio__text']}>{label}</span>}
				</label>
			</FormField>
		</div>
	);
};
