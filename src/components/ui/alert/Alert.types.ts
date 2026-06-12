import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

export type AlertProps = {
	variant: AlertVariant;
	children?: ReactNode;
	title?: string;
	icon?: LucideIcon;
	onDismiss?: () => void;
	dismissLabel?: string;
};
