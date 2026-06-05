import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

import type { ToggleButtonProps } from './ToggleButton.types';
import { useToggleButton } from './useToggleButton';
import styles from './ToggleButton.module.scss';

export const ToggleButton = ({
	value,
	pressed: pressedProp,
	defaultPressed = false,
	onPressedChange,
	onClick,
	variant = 'secondary',
	className,
	disabled,
	...rest
}: ToggleButtonProps) => {
	const { pressed, toggle } = useToggleButton({
		value,
		pressed: pressedProp,
		defaultPressed,
		onPressedChange,
		disabled,
	});

	return (
		<Button
			{...rest}
			variant={variant}
			disabled={disabled}
			aria-pressed={pressed}
			className={cn(
				styles['toggle-button'],
				pressed && styles['toggle-button--pressed'],
				className
			)}
			onClick={(event) => {
				onClick?.(event);
				toggle();
			}}
		/>
	);
};
