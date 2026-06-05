import { useCallback } from 'react';

import { useControllableBoolean } from '@/hooks/useControllableBoolean';

import { useToggleButtonGroup } from './useToggleButtonGroup';

type UseToggleButtonOptions = {
	value?: string;
	pressed?: boolean;
	defaultPressed?: boolean;
	onPressedChange?: (pressed: boolean) => void;
	disabled?: boolean;
};

export const useToggleButton = ({
	value,
	pressed: pressedProp,
	defaultPressed = false,
	onPressedChange,
	disabled,
}: UseToggleButtonOptions) => {
	const group = useToggleButtonGroup();
	const isInGroup = group !== null && value !== undefined;
	const standalone = useControllableBoolean({
		value: pressedProp,
		defaultValue: defaultPressed,
		onChange: onPressedChange,
	});

	const pressed = isInGroup ? group.isSelected(value) : standalone.value;

	const toggle = useCallback(() => {
		if (disabled) return;

		if (isInGroup) {
			group.select(value);
			return;
		}

		standalone.toggle();
	}, [disabled, group, isInGroup, standalone.toggle, value]);

	return { pressed, toggle };
};
