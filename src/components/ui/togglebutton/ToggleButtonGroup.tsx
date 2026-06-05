import { ButtonGroup } from '@/components/ui/buttongroup';

import type { ToggleButtonGroupProps } from './ToggleButton.types';
import { ToggleButtonGroupProvider } from './useToggleButtonGroup';

export const ToggleButtonGroup = ({
	type = 'single',
	value,
	defaultValue,
	onChange,
	children,
	...buttonGroupProps
}: ToggleButtonGroupProps) => (
	<ToggleButtonGroupProvider
		type={type}
		value={value}
		defaultValue={defaultValue}
		onChange={onChange}
	>
		<ButtonGroup {...buttonGroupProps}>{children}</ButtonGroup>
	</ToggleButtonGroupProvider>
);
