import type { LucideIcon } from 'lucide-react';

import type { IconVariant } from '@/components/ui/icon';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/utils/cn';

import styles from './Badge.module.scss';

export type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'neutral';
export type BadgeType = 'filled' | 'outlined';

export type BadgeProps = {
	variant: BadgeVariant;
	type?: BadgeType;
	text?: string;
	icon?: LucideIcon;
};

const ICON_VARIANT: Record<BadgeVariant, IconVariant> = {
	success: 'success',
	error:   'error',
	warning: 'warning',
	info:    'info',
	neutral: 'muted',
};

export const Badge = ({
	variant,
	type = 'filled',
	text,
	icon,
}: BadgeProps) => (
	<span
		className={cn(
			styles.badge,
			styles[`badge--${variant}`],
			type === 'outlined' && styles['badge--outlined']
		)}
	>
		{icon && (
			<Icon
				icon={icon}
				size="sm"
				variant={ICON_VARIANT[variant]}
				aria-hidden
			/>
		)}
		{text}
	</span>
);
