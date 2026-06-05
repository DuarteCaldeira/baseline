import type { HTMLAttributes } from 'react';
import { ChevronRight } from 'lucide-react';

import { Stack } from '@/components/layout/stack';
import { Icon } from '@/components/ui/icon';
import { Link } from '@/components/ui/link';
import { cn } from '@/utils/cn';

import type { BreadcrumbItem } from './Breadcrumb.types';
import styles from './Breadcrumb.module.scss';

export type BreadcrumbProps = HTMLAttributes<HTMLElement> & {
	items: BreadcrumbItem[];
	className?: string;
};

const renderItemContent = (item: BreadcrumbItem, isLast: boolean) => {
	if (isLast) {
		return (
			<span className={styles['breadcrumb__page']} aria-current="page">
				{item.label}
			</span>
		);
	}

	if (item.href) {
		return (
			<Link href={item.href} variant="subtle">
				{item.label}
			</Link>
		);
	}

	return <span className={styles['breadcrumb__text']}>{item.label}</span>;
};

export const Breadcrumb = ({
	items,
	className,
	'aria-label': ariaLabel = 'Breadcrumb',
	...rest
}: BreadcrumbProps) => (
	<nav
		className={cn(styles.breadcrumb, className)}
		aria-label={ariaLabel}
		{...rest}
	>
		<Stack
			as="ol"
			direction="row"
			gap="1"
			align="center"
			wrap
			className={styles['breadcrumb__list']}
		>
			{items.map((item, index) => {
				const isLast = index === items.length - 1;

				return (
					<li
						key={`${item.label}-${index}`}
						className={styles['breadcrumb__item']}
					>
						{index > 0 && (
							<Icon
								icon={ChevronRight}
								size="sm"
								variant="subtle"
								className={styles['breadcrumb__separator']}
							/>
						)}

						{renderItemContent(item, isLast)}
					</li>
				);
			})}
		</Stack>
	</nav>
);
