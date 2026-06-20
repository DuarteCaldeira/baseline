import { Stack } from '@/components/layout/stack';
import { Skeleton } from '@/components/patterns/skeleton';

import styles from '../Table.module.scss';
import type { TableSkeletonProps } from '../Table.types';
import {
	getColumnSkeletonVariant,
	getColumnSkeletonWidth,
} from '../Table.utils';
import { TableCardSkeleton } from '../table-cards/TableCardSkeleton';

// Each row starts its pulse 60 ms after the previous one → smooth cascade effect
const ROW_DELAY_MS = 60;

export const TableSkeleton = <T extends Record<string, unknown>>({
	columns,
	rows = 5,
}: TableSkeletonProps<T>) => (
	<>
		<div className={styles['table__mobile']}>
			<TableCardSkeleton columns={columns} rows={rows} />
		</div>

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
					<tr key={rowIndex} className={styles['table__tr']}>
						{columns.map((col) => (
							<td key={col.key} className={styles['table__td']}>
								<Stack padding="lg" width="full">
									<Skeleton
										variant={getColumnSkeletonVariant(col)}
										width={getColumnSkeletonWidth(col)}
										style={{
											animationDelay: `${rowIndex * ROW_DELAY_MS}ms`,
										}}
									/>
								</Stack>
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	</>
);
