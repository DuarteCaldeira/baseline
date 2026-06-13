import { Button } from '@/components/ui/button';

import type { ToggleButtonProps } from './ToggleButton.types';
import { useToggleButton } from './hooks/useToggleButton';

export const ToggleButton = ({
	value,
	pressed: pressedProp,
	defaultPressed = false,
	onPressedChange,
	onClick,
	variant = 'secondary',
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
			data-toggle-button=""
			aria-pressed={pressed}
			onClick={(event) => {
				toggle();
				onClick?.(event);
			}}
		/>
	);
};
