import { Button } from '@/components/ui/button';

import type { ToggleButtonProps } from './ToggleButton.types';
import { useToggleButton } from './useToggleButton';
import './ToggleButton.module.scss';

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
				onClick?.(event);
				toggle();
			}}
		/>
	);
};
