import { useCallback } from 'react';

import { useControllableState } from '@/hooks/useControllableState';

type UseControllableBooleanOptions = {
	value?: boolean;
	defaultValue?: boolean;
	onChange?: (value: boolean) => void;
};

export const useControllableBoolean = ({
	value,
	defaultValue = false,
	onChange,
}: UseControllableBooleanOptions = {}) => {
	const { value: currentValue, setValue, isControlled } = useControllableState({
		value,
		defaultValue,
		onChange,
	});

	const toggle = useCallback(() => {
		setValue(!currentValue);
	}, [currentValue, setValue]);

	return { value: currentValue, setValue, toggle, isControlled };
};
