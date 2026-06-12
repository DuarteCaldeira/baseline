import { useCallback } from 'react';

import { useControllableState } from '@/hooks/useControllableState';

type UseMultiSelectOptions = {
	value?: string[];
	defaultValue?: string[];
	onChange?: (value: string[]) => void;
};

const EMPTY_VALUES: string[] = [];

export const useMultiSelect = ({
	value,
	defaultValue,
	onChange,
}: UseMultiSelectOptions) => {
	const { value: controlledValue, setValue } = useControllableState<string[]>({
		value,
		defaultValue: defaultValue ?? EMPTY_VALUES,
		onChange,
	});

	const selectedValues = controlledValue ?? EMPTY_VALUES;

	const toggleValue = useCallback(
		(optionValue: string) => {
			const next = selectedValues.includes(optionValue)
				? selectedValues.filter((entry) => entry !== optionValue)
				: [...selectedValues, optionValue];

			setValue(next);
		},
		[selectedValues, setValue]
	);

	const removeValue = useCallback(
		(optionValue: string) => {
			setValue(selectedValues.filter((entry) => entry !== optionValue));
		},
		[selectedValues, setValue]
	);

	return {
		selectedValues,
		toggleValue,
		removeValue,
	};
};
