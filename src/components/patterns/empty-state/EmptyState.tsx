import { type ReactNode, useId } from 'react';

import type { LucideIcon } from 'lucide-react';

import { Stack } from '@/components/layout/stack';
import { Icon } from '@/components/ui/icon';

import styles from './EmptyState.module.scss';

type EmptyStateProps = {
	icon?: LucideIcon;
	title: string;
	description?: string;
	action?: ReactNode;
};

export const EmptyState = ({
	icon: IconComponent,
	title,
	description,
	action,
}: EmptyStateProps) => {
	const titleId = useId();
	const descriptionId = useId();

	return (
		<Stack
			as="section"
			gap="lg"
			align="center"
			className={styles['empty-state']}
			aria-labelledby={titleId}
			aria-describedby={description ? descriptionId : undefined}
		>
			{IconComponent && (
				<div className={styles['empty-state__icon']} aria-hidden="true">
					<Icon icon={IconComponent} size="lg" variant="subtle" />
				</div>
			)}

			<Stack gap="sm" align="center">
				<h3 id={titleId} className={styles['empty-state__title']}>
					{title}
				</h3>
				{description && (
					<p id={descriptionId} className={styles['empty-state__description']}>
						{description}
					</p>
				)}
			</Stack>

			{action && <div className={styles['empty-state__action']}>{action}</div>}
		</Stack>
	);
};
