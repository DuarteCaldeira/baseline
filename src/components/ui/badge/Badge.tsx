import type { LucideIcon } from 'lucide-react';

import type { IconVariant } from '@/components/ui/icon';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/utils/cn';

import styles from './Badge.module.scss';

export type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'neutral';
export type BadgeType = 'filled' | 'outlined';

type BadgeBaseProps = {
	variant: BadgeVariant;
	type?: BadgeType;
};

type BadgeWithText = BadgeBaseProps & {
	text: string;
	icon?: LucideIcon;
};

type BadgeIconOnly = BadgeBaseProps & {
	text?: never;
	icon: LucideIcon;
	/** Required when text is omitted — provides the accessible name for screen readers. */
	'aria-label': string;
};

type BadgeProps = BadgeWithText | BadgeIconOnly;

const ICON_VARIANT: Record<BadgeVariant, IconVariant> = {
	success: 'success',
	error: 'error',
	warning: 'warning',
	info: 'info',
	neutral: 'muted',
};

export const Badge = (props: BadgeProps) => {
	if (props.text == null) {
		const {
			variant,
			type = 'filled',
			icon,
			'aria-label': ariaLabel,
		} = props;

		return (
			<span
				className={cn(
					styles.badge,
					styles[`badge--${variant}`],
					type === 'outlined' && styles['badge--outlined']
				)}
				role="img"
				aria-label={ariaLabel}
			>
				{icon && (
					<Icon
						icon={icon}
						size="sm"
						variant={ICON_VARIANT[variant]}
					/>
				)}
			</span>
		);
	}

	const { variant, type = 'filled', text, icon } = props;

	return (
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
};
