import type { MouseEvent } from 'react';

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
	children,
	icon,
	size,
	iconOnly,
	isLoading,
	'aria-label': ariaLabel,
	...rest
}: ToggleButtonProps) => {
	const { pressed, toggle } = useToggleButton({
		value,
		pressed: pressedProp,
		defaultPressed,
		onPressedChange,
		disabled,
	});

	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		toggle();
		onClick?.(event);
	};

	const toggleProps = {
		...rest,
		variant,
		size,
		iconOnly,
		isLoading,
		disabled,
		'data-toggle-button': '',
		'aria-pressed': pressed,
		onClick: handleClick,
	} as const;

	if (icon != null && children == null) {
		return <Button {...toggleProps} icon={icon} aria-label={ariaLabel ?? ''} />;
	}

	return (
		<Button {...toggleProps} icon={icon}>
			{children}
		</Button>
	);
};
