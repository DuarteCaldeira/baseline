import type { InputHTMLAttributes } from 'react';

import { VISUALLY_HIDDEN_CLASS } from '@/components/a11y/visually-hidden';
import { Stack } from '@/components/layout/stack';
import { cn } from '@/utils/cn';

import styles from './ToggleSwitch.module.scss';

export type ToggleSwitchProps = Omit<
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
	const helperId = helperText && id ? `${id}-helper` : undefined;
	const errorId = error && id ? `${id}-error` : undefined;
	const describedBy =
		[helperId, errorId].filter(Boolean).join(' ') || undefined;

	return (
		<Stack
			gap="1"
			className={cn(
				styles['toggle-switch'],
				error && styles['toggle-switch--error'],
				disabled && styles['toggle-switch--disabled'],
				className
			)}
		>
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
			{helperText && (
				<span id={helperId} className={styles['toggle-switch__helper']}>
					{helperText}
				</span>
			)}
			{error && (
				<span
					id={errorId}
					className={styles['toggle-switch__error']}
					role="alert"
				>
					{error}
				</span>
			)}
		</Stack>
	);
};
