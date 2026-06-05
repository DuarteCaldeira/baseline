import { useCallback, useState } from 'react';

type UseControllableStateOptions<T> = {
	value?: T;
	defaultValue?: T;
	onChange?: (next: T) => void;
};

export const useControllableState = <T>({
	value: valueProp,
	defaultValue,
	onChange,
}: UseControllableStateOptions<T>) => {
	const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
	const isControlled = valueProp !== undefined;
	const value = isControlled ? valueProp : uncontrolledValue;

	const setValue = useCallback(
		(next: T) => {
			if (!isControlled) {
				setUncontrolledValue(next);
			}

			onChange?.(next);
		},
		[isControlled, onChange]
	);

	return { value, setValue, isControlled };
};
