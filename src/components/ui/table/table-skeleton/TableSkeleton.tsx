import { Skeleton } from '@/components/patterns/skeleton';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { TABLE_MOBILE_MEDIA_QUERY } from '@/utils/breakpoints';

import styles from '../Table.module.scss';
import type { TableColumn } from '../Table.types';
import { TableCardSkeleton } from '../table-cards/TableCardSkeleton';

type TableSkeletonProps<T extends Record<string, unknown>> = {
	columns: TableColumn<T>[];
	rows?: number;
};

// Staggered widths so adjacent cells look naturally varied
const WIDTHS = ['3/4', '2/3', 'full', '1/2', '3/4', '2/3'] as const;

// Each row starts its pulse 60 ms after the previous one → smooth cascade effect
const ROW_DELAY_MS = 60;

export const TableSkeleton = <T extends Record<string, unknown>>({
	columns,
	rows = 5,
}: TableSkeletonProps<T>) => {
	const isMobile = useMediaQuery(TABLE_MOBILE_MEDIA_QUERY);

	if (isMobile) {
		return <TableCardSkeleton columns={columns} rows={rows} />;
	}

	return (
		<table className={styles['table__grid']}>
			<thead className={styles['table__head']}>
				<tr>
					{columns.map((col) => (
						<th
							key={col.key}
							scope="col"
							className={styles['table__th']}
							style={col.width ? { width: col.width } : undefined}
						>
							{col.header}
						</th>
					))}
				</tr>
			</thead>
			{/* aria-busy is set on the scroll wrapper by Table.tsx, not here */}
			<tbody>
				{Array.from({ length: rows }, (_, rowIndex) => (
					// eslint-disable-next-line react/no-array-index-key
					<tr key={rowIndex} className={styles['table__tr']}>
						{columns.map((col, colIndex) => (
							<td key={col.key} className={styles['table__td']}>
								<Skeleton
									variant="text"
									width={WIDTHS[(rowIndex + colIndex) % WIDTHS.length]}
									style={{ animationDelay: `${rowIndex * ROW_DELAY_MS}ms` }}
								/>
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
};
