import { Button } from '@/components/ui/button';

import './ToggleButton.module.scss';
import type { ToggleButtonProps } from './ToggleButton.types';
import { useToggleButton } from './useToggleButton';

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
			aria-pressed={pressed}
			data-toggle-button=""
			onClick={(event) => {
				toggle();
				onClick?.(event);
			}}
		/>
	);
};
