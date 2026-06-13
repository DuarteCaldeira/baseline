import type { ButtonHTMLAttributes, ComponentProps, ReactElement, ReactNode } from 'react';

import type { LucideIcon } from 'lucide-react';

import type { ButtonGroup } from '@/components/ui/buttongroup';

type ButtonGroupProps = ComponentProps<typeof ButtonGroup>;

export type ToggleButtonProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	'className'
> & {
	variant?: 'secondary' | 'ghost';
	size?: 'sm' | 'md' | 'lg';
	iconOnly?: boolean;
	isLoading?: boolean;
	icon?: LucideIcon;
	children?: ReactNode;
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
