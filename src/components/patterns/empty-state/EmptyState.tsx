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
		<section
			className={cn(styles['empty-state'], className)}
			aria-labelledby={titleId}
			aria-describedby={description ? descriptionId : undefined}
		>
			<Stack gap="2" align="center">
				{IconComponent && (
					<div className={styles['empty-state__icon']} aria-hidden="true">
						<Icon icon={IconComponent} size="lg" variant="subtle" />
					</div>
				)}

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

				{action && (
					<div className={styles['empty-state__action']}>{action}</div>
				)}
			</Stack>
		</section>
	);
};
