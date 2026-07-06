import type { LucideIcon } from 'lucide-react';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

import { Stack } from '@/components/layout/stack';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/utils/cn';

import styles from './Toast.module.scss';
import type { ToastItem, ToastVariant } from './Toast.types';

const ICON_MAP: Record<ToastVariant, LucideIcon> = {
	success: CheckCircle,
	error: AlertCircle,
	warning: AlertTriangle,
	info: Info,
};

const ROLE_MAP: Record<ToastVariant, 'alert' | 'status'> = {
	error: 'alert',
	warning: 'alert',
	success: 'status',
	info: 'status',
};

type ToastProps = ToastItem & {
	dismissing?: boolean;
	onDismiss: (id: string) => void;
};

export const Toast = ({
	id,
	variant,
	title,
	message,
	dismissing = false,
	onDismiss,
}: ToastProps) => (
	<Stack
		direction="row"
		gap="md"
		align="start"
		role={ROLE_MAP[variant]}
		aria-atomic="true"
		className={cn(
			styles.toast,
			styles[`toast--${variant}`],
			dismissing && styles['toast--dismissing']
		)}
	>
		<span className={styles['toast__icon']}>
			<Icon
				icon={ICON_MAP[variant]}
				variant={variant}
				size="sm"
				label={variant}
			/>
		</span>
		<div className={styles['toast__body']}>
			{title && <p className={styles['toast__title']}>{title}</p>}
			<p className={styles['toast__message']}>{message}</p>
		</div>
		<Button
			type="button"
			variant="ghost"
			size="sm"
			iconOnly
			onClick={() => onDismiss(id)}
			aria-label="Dismiss notification"
		>
			<Icon icon={X} size="sm" />
		</Button>
	</Stack>
);
