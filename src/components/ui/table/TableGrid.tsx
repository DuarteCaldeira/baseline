import { memo, useCallback, useMemo } from 'react';
import type { KeyboardEvent, MouseEvent, ReactElement } from 'react';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/utils/cn';

import styles from './Table.module.scss';
import type { TableColumn, TableGridProps } from './Table.types';
import {
	TABLE_MOBILE_MEDIA_QUERY,
	getClickableRowLabel,
	getPrimaryColumnKey,
	getRowKey,
} from './Table.utils';
import { TableCardList } from './TableCardList';
import { TableHeaderCell } from './TableHeaderCell';
import { TableMobileSort } from './TableMobileSort';

// ── Memoised row ──────────────────────────────────────────────────────────────

type RowProps<T extends Record<string, unknown>> = {
	row: T;
	rowIndex: number;
	columns: TableColumn<T>[];
	isClickable: boolean;
	ariaRowIndex: number;
	rowLabel?: string;
};

const TableRowInner = <T extends Record<string, unknown>>({
	row,
	rowIndex,
	columns,
	isClickable,
	ariaRowIndex,
	rowLabel,
}: RowProps<T>): ReactElement => (
	<tr
		data-row-index={rowIndex}
		aria-rowindex={ariaRowIndex}
		role={isClickable ? 'button' : undefined}
		aria-label={isClickable ? rowLabel : undefined}
		className={cn(
			styles['table__tr'],
			isClickable && styles['table__tr--clickable']
		)}
		tabIndex={isClickable ? 0 : undefined}
	>
		{columns.map((col) => (
			<td key={col.key} className={styles['table__td']}>
				{col.render ? col.render(row, rowIndex) : String(row[col.key] ?? '')}
			</td>
		))}
	</tr>
);

// Cast preserves the generic signature through React.memo's wrapping
const TableRow = memo(TableRowInner) as typeof TableRowInner;

// ── Grid ──────────────────────────────────────────────────────────────────────

export const TableGrid = <T extends Record<string, unknown>>({
	columns,
	data,
	emptyMessage = 'No data to display.',
	onRowClick,
	rowKey,
	sortState,
	onSort,
	onSortChange,
	rowOffset,
	totalRows,
}: TableGridProps<T>) => {
	const isClickable = !!onRowClick;
	const isMobile = useMediaQuery(TABLE_MOBILE_MEDIA_QUERY);
	const primaryColumnKey = useMemo(
		() => getPrimaryColumnKey(columns),
		[columns]
	);

	// Single delegated handler on <tbody> — avoids attaching N onClick closures
	const handleBodyClick = useCallback(
		(e: MouseEvent<HTMLTableSectionElement>) => {
			const tr = (e.target as HTMLElement).closest('tr');
			if (!tr) return;
			const index = Number((tr as HTMLElement).dataset.rowIndex);
			if (Number.isNaN(index)) return;
			onRowClick?.(data[index], index);
		},
		[onRowClick, data]
	);

	const handleBodyKeyDown = useCallback(
		(e: KeyboardEvent<HTMLTableSectionElement>) => {
			if (e.key !== 'Enter' && e.key !== ' ') return;
			const tr = (e.target as HTMLElement).closest('tr');
			if (!tr) return;
			e.preventDefault();
			const index = Number((tr as HTMLElement).dataset.rowIndex);
			if (Number.isNaN(index)) return;
			onRowClick?.(data[index], index);
		},
		[onRowClick, data]
	);

	if (isMobile) {
		return (
			<div className={styles['table__mobile']}>
				<TableMobileSort
					columns={columns}
					sortState={sortState}
					onSortChange={onSortChange}
				/>
				<TableCardList
					columns={columns}
					data={data}
					emptyMessage={emptyMessage}
					onRowClick={onRowClick}
					rowKey={rowKey}
					primaryColumnKey={primaryColumnKey}
				/>
			</div>
		);
	}

	return (
		<table
			className={styles['table__grid']}
			// aria-rowcount tells AT the real total rows even when only a page is shown.
			// +1 accounts for the header row.
			aria-rowcount={totalRows + 1}
		>
			<thead className={styles['table__head']}>
				{/* aria-rowindex=1 is required when body rows carry aria-rowindex */}
				<tr aria-rowindex={1}>
					{columns.map((col) => (
						<TableHeaderCell
							key={col.key}
							header={col.header}
							sortable={col.sortable}
							sortDirection={
								sortState?.key === col.key ? sortState.direction : null
							}
							onSort={col.sortable ? () => onSort(col.key) : undefined}
							width={col.width}
						/>
					))}
				</tr>
			</thead>
			<tbody
				onClick={isClickable ? handleBodyClick : undefined}
				onKeyDown={isClickable ? handleBodyKeyDown : undefined}
			>
				{data.length === 0 ? (
					<tr className={styles['table__tr--empty']}>
						<td colSpan={columns.length} className={styles['table__empty']}>
							{emptyMessage}
						</td>
					</tr>
				) : (
					data.map((row, rowIndex) => (
						<TableRow
							key={getRowKey(row, rowIndex, rowKey)}
							row={row}
							rowIndex={rowIndex}
							columns={columns}
							isClickable={isClickable}
							rowLabel={
								isClickable
									? getClickableRowLabel(
											row,
											rowIndex,
											columns,
											primaryColumnKey
										)
									: undefined
							}
							// +2: +1 to convert 0-based to 1-based, +1 to skip the header row
							ariaRowIndex={rowOffset + rowIndex + 2}
						/>
					))
				)}
			</tbody>
		</table>
	);
};
