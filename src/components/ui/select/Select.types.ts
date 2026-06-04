import type { ReactNode } from 'react';

export type SelectOption = {
	value: string;
	label: string;
	icon?: ReactNode;
	description?: string;
	disabled?: boolean;
};
