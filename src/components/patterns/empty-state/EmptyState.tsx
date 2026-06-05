import { useId, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

import { Stack } from '@/components/layout/stack';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/utils/cn';

import styles from './EmptyState.module.scss';

export type EmptyStateProps = {
	icon?: LucideIcon;
	title: string;
	description?: string;
	action?: ReactNode;
	className?: string;
};

export const EmptyState = ({
	icon: IconComponent,
	title,
	description,
	action,
	className,
}: EmptyStateProps) => {
	const titleId = useId();
	const descriptionId = useId();

	return (
		<Stack
			as="section"
			gap="4"
			align="center"
			className={cn(styles['empty-state'], className)}
			aria-labelledby={titleId}
			aria-describedby={description ? descriptionId : undefined}
		>
			{IconComponent && (
				<div className={styles['empty-state__icon']} aria-hidden="true">
					<Icon icon={IconComponent} size="lg" variant="subtle" />
				</div>
			)}

			<Stack gap="2" align="center">
				<h3 id={titleId} className={styles['empty-state__title']}>
					{title}
				</h3>
				{description && (
					<p
						id={descriptionId}
						className={styles['empty-state__description']}
					>
						{description}
					</p>
				)}
			</Stack>

			{action && (
				<div className={styles['empty-state__action']}>{action}</div>
			)}
		</Stack>
	);
};
