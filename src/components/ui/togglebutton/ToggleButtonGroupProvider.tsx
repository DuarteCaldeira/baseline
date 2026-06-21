import type { ReactNode } from 'react';

import type { ToggleButtonGroupType } from './ToggleButton.types';
import {
	ToggleButtonGroupContext,
	useToggleButtonGroupState,
} from './hooks/useToggleButtonGroup';

type ToggleButtonGroupProviderProps = {
	type: ToggleButtonGroupType;
	value?: string | string[];
	defaultValue?: string | string[];
	onChange?: (value: string | string[]) => void;
	children: ReactNode;
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
