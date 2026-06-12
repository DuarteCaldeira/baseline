import { useMemo } from 'react';

import { Skeleton } from '@/components/patterns/skeleton';

import type { TableColumn } from './Table.types';
import { getColumnLabel, getPrimaryColumnKey } from './Table.utils';
import styles from './Table.module.scss';

type TableCardSkeletonProps<T extends Record<string, unknown>> = {
	columns: TableColumn<T>[];
	rows?: number;
};

const WIDTHS = ['3/4', '2/3', 'full', '1/2'] as const;
const ROW_DELAY_MS = 60;

export const TableCardSkeleton = <T extends Record<string, unknown>>({
	columns,
	rows = 5,
}: TableCardSkeletonProps<T>) => {
	const primaryColumnKey = useMemo(() => getPrimaryColumnKey(columns), [columns]);
	const primaryColumn = columns.find((col) => col.key === primaryColumnKey);
	const secondaryColumns = columns.filter((col) => col.key !== primaryColumnKey);

	return (
		<div className={styles['table__cards']} aria-hidden="true">
			{Array.from({ length: rows }, (_, rowIndex) => (
				// eslint-disable-next-line react/no-array-index-key
				<article key={rowIndex} className={styles['table__card']}>
					{primaryColumn && (
						<header className={styles['table__card-header']}>
							<Skeleton
								variant="text"
								width="2/3"
								style={{ animationDelay: `${rowIndex * ROW_DELAY_MS}ms` }}
							/>
						</header>
					)}

					{secondaryColumns.length > 0 && (
						<dl className={styles['table__card-fields']}>
							{secondaryColumns.map((col, colIndex) => (
								<div key={col.key} className={styles['table__card-field']}>
									<dt className={styles['table__card-label']}>
										{getColumnLabel(col.header, col.key)}
									</dt>
									<dd className={styles['table__card-value']}>
										<Skeleton
											variant="text"
											width={WIDTHS[(rowIndex + colIndex) % WIDTHS.length]}
											style={{
												animationDelay: `${rowIndex * ROW_DELAY_MS + colIndex * 30}ms`,
											}}
										/>
									</dd>
								</div>
							))}
						</dl>
					)}
				</article>
			))}
		</div>
	);
};
