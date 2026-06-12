import { X } from 'lucide-react';

import { Stack } from '@/components/layout/stack';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/utils/cn';

import type { AlertProps } from './Alert.types';
import { ALERT_ICON_MAP, ALERT_ROLE_MAP, hasAlertDescription } from './Alert.utils';
import styles from './Alert.module.scss';

export type { AlertProps, AlertVariant } from './Alert.types';

export const Alert = ({
	variant,
	title,
	children,
	icon,
	onDismiss,
	dismissLabel = 'Dismiss alert',
}: AlertProps) => {
	const IconComponent = icon ?? ALERT_ICON_MAP[variant];
	const hasDescription = hasAlertDescription(children);
	const hasTitleAndDescription = Boolean(title) && hasDescription;

	return (
		<Stack
			direction="row"
			gap="3"
			align={hasTitleAndDescription ? 'start' : 'center'}
			role={ALERT_ROLE_MAP[variant]}
			className={cn(
				styles.alert,
				styles[`alert--${variant}`],
				!hasTitleAndDescription && styles['alert--compact']
			)}
		>
			<span className={styles['alert__icon-wrap']}>
				<Icon icon={IconComponent} variant={variant} size="sm" label={variant} />
			</span>
			<div className={styles['alert__body']}>
				{title && <p className={styles['alert__title']}>{title}</p>}
				{hasDescription && (
					<div className={styles['alert__message']}>{children}</div>
				)}
			</div>
			{onDismiss && (
				<Button
					type="button"
					variant="ghost"
					size="sm"
					iconOnly
					onClick={onDismiss}
					aria-label={dismissLabel}
				>
					<Icon icon={X} size="sm" />
				</Button>
			)}
		</Stack>
	);
};
