import type { LucideIcon } from 'lucide-react';

import type { IconVariant } from '@/components/ui/icon';

export type SelectOption = {
	value: string;
	label: string;
	icon?: LucideIcon;
	iconVariant?: IconVariant;
	description?: string;
	disabled?: boolean;
};
