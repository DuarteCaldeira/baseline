import { useCallback } from 'react';

import { useControllableState } from '@/hooks/useControllableState';

type UseMultiSelectOptions = {
	value?: string[];
	defaultValue?: string[];
	onChange?: (value: string[]) => void;
};

export const useMultiSelect = ({
	value,
	defaultValue,
	onChange,
}: UseMultiSelectOptions) => {
	const { value: selectedValues, setValue } = useControllableState<string[]>({
		value,
		defaultValue: defaultValue ?? [],
		onChange,
	});

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

	return { selectedValues, toggleValue, removeValue };
};
