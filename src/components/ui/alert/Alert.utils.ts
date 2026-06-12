import type { ReactNode } from 'react';

import type { LucideIcon } from 'lucide-react';
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';

import type { AlertVariant } from './Alert.types';

export const hasAlertDescription = (children: ReactNode): boolean => {
	if (children == null || children === false) return false;
	if (typeof children === 'string') return children.trim().length > 0;
	if (Array.isArray(children)) return children.some(hasAlertDescription);
	return true;
};

export const ALERT_ICON_MAP: Record<AlertVariant, LucideIcon> = {
	success: CheckCircle,
	error: AlertCircle,
	warning: AlertTriangle,
	info: Info,
};

export const ALERT_ROLE_MAP: Record<AlertVariant, 'alert' | 'status'> = {
	error: 'alert',
	warning: 'alert',
	success: 'status',
	info: 'status',
};
