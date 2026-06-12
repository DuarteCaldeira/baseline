import { createContext, useCallback, useContext } from 'react';

import { useControllableState } from '@/hooks/useControllableState';

import type { ToggleButtonGroupType } from './ToggleButton.types';

type ToggleButtonGroupContextValue = {
	type: ToggleButtonGroupType;
	isSelected: (value: string) => boolean;
	select: (value: string) => void;
};

export const ToggleButtonGroupContext =
	createContext<ToggleButtonGroupContextValue | null>(null);

export const useToggleButtonGroup = () => useContext(ToggleButtonGroupContext);

export type ToggleButtonGroupStateOptions = {
	type: ToggleButtonGroupType;
	value?: string | string[];
	defaultValue?: string | string[];
	onChange?: (value: string | string[]) => void;
};

export const useToggleButtonGroupState = ({
	type,
	value,
	defaultValue,
	onChange,
}: ToggleButtonGroupStateOptions) => {
	const isMultiple = type === 'multiple';
	const { value: currentValue, setValue } = useControllableState<
		string | string[]
	>({
		value,
		defaultValue: defaultValue ?? (isMultiple ? [] : ''),
		onChange,
	});

	const isSelected = useCallback(
		(itemValue: string) => {
			if (isMultiple) {
				return (currentValue as string[]).includes(itemValue);
			}

			return currentValue === itemValue;
		},
		[currentValue, isMultiple]
	);

	const select = useCallback(
		(itemValue: string) => {
			let next: string | string[];

			if (isMultiple) {
				const selected = currentValue as string[];

				next = selected.includes(itemValue)
					? selected.filter((entry) => entry !== itemValue)
					: [...selected, itemValue];
			} else {
				next = itemValue;
			}

			setValue(next);
		},
		[currentValue, isMultiple, setValue]
	);

	return { type, isSelected, select };
};
