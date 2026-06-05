import type { ReactElement } from 'react';

import type { ButtonProps } from '@/components/ui/button';
import type { ButtonGroupProps } from '@/components/ui/buttongroup';

export type ToggleButtonProps = Omit<ButtonProps, 'variant'> & {
	variant?: 'secondary' | 'ghost';
	value?: string;
	pressed?: boolean;
	defaultPressed?: boolean;
	onPressedChange?: (pressed: boolean) => void;
};

export type ToggleButtonGroupType = 'single' | 'multiple';

export type ToggleButtonGroupProps = Omit<ButtonGroupProps, 'children'> & {
	type?: ToggleButtonGroupType;
	value?: string | string[];
	defaultValue?: string | string[];
	onChange?: (value: string | string[]) => void;
	children: ReactElement<ToggleButtonProps> | ReactElement<ToggleButtonProps>[];
};
