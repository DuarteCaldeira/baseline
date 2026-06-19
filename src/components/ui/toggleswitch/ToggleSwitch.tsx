import type { InputHTMLAttributes } from 'react';

import { VISUALLY_HIDDEN_CLASS } from '@/components/a11y/visually-hidden';
import { FormField } from '@/components/patterns/form-field';
import { cn } from '@/utils/cn';
import { resolveFieldIds } from '@/utils/fieldIds';

import styles from './ToggleSwitch.module.scss';

type ToggleSwitchProps = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	'type' | 'role'
> & {
	label?: string;
	helperText?: string;
	error?: string;
};

export const ToggleSwitch = ({
	label,
	helperText,
	error,
	id,
	disabled,
	className,
	...rest
}: ToggleSwitchProps) => {
	const { describedBy } = resolveFieldIds(id, { helperText, error });

	return (
		<div
			className={cn(
				styles['toggle-switch'],
				error && styles['toggle-switch--error'],
				disabled && styles['toggle-switch--disabled'],
				className
			)}
		>
			<FormField fieldId={id} helperText={helperText} error={error} gap="xs">
				<label className={styles['toggle-switch__label']} htmlFor={id}>
					<input
						type="checkbox"
						role="switch"
						id={id}
						className={cn(
							VISUALLY_HIDDEN_CLASS,
							styles['toggle-switch__input']
						)}
						disabled={disabled}
						aria-invalid={error ? true : undefined}
						aria-describedby={describedBy}
						{...rest}
					/>
					<span className={styles['toggle-switch__track']} aria-hidden="true">
						<span className={styles['toggle-switch__thumb']} />
					</span>
					{label && (
						<span className={styles['toggle-switch__text']}>{label}</span>
					)}
				</label>
			</FormField>
		</div>
	);
};
