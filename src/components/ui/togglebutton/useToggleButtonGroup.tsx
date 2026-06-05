import {
	createContext,
	useCallback,
	useContext,
	type ReactNode,
} from 'react';

import { useControllableState } from '@/hooks/useControllableState';

import type { ToggleButtonGroupType } from './ToggleButton.types';

type ToggleButtonGroupContextValue = {
	type: ToggleButtonGroupType;
	isSelected: (value: string) => boolean;
	select: (value: string) => void;
};

const ToggleButtonGroupContext =
	createContext<ToggleButtonGroupContextValue | null>(null);

export const useToggleButtonGroup = () =>
	useContext(ToggleButtonGroupContext);

type ToggleButtonGroupProviderProps = {
	type: ToggleButtonGroupType;
	value?: string | string[];
	defaultValue?: string | string[];
	onChange?: (value: string | string[]) => void;
	children: ReactNode;
};

export const useToggleButtonGroupState = ({
	type,
	value,
	defaultValue,
	onChange,
}: Omit<ToggleButtonGroupProviderProps, 'children'>) => {
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
			const next = isMultiple
				? (currentValue as string[]).includes(itemValue)
					? (currentValue as string[]).filter(
							(entry) => entry !== itemValue
						)
					: [...(currentValue as string[]), itemValue]
				: itemValue;

			setValue(next);
		},
		[currentValue, isMultiple, setValue]
	);

	return { type, isSelected, select };
};

export const ToggleButtonGroupProvider = ({
	type,
	value,
	defaultValue,
	onChange,
	children,
}: ToggleButtonGroupProviderProps) => {
	const groupState = useToggleButtonGroupState({
		type,
		value,
		defaultValue,
		onChange,
	});

	return (
		<ToggleButtonGroupContext.Provider value={groupState}>
			{children}
		</ToggleButtonGroupContext.Provider>
	);
};
