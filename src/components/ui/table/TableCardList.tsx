import { useCallback } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';

import { cn } from '@/utils/cn';

import styles from './Table.module.scss';
import type { TableColumn } from './Table.types';
import { getClickableRowLabel, getColumnLabel, getRowKey } from './Table.utils';

type TableCardListProps<T extends Record<string, unknown>> = {
	columns: TableColumn<T>[];
	data: T[];
	emptyMessage?: string;
	onRowClick?: (row: T, rowIndex: number) => void;
	rowKey?: keyof T | ((row: T, rowIndex: number) => string);
	primaryColumnKey?: string;
};

const renderCell = <T extends Record<string, unknown>>(
	col: TableColumn<T>,
	row: T,
	rowIndex: number
) => (col.render ? col.render(row, rowIndex) : String(row[col.key] ?? ''));

export const TableCardList = <T extends Record<string, unknown>>({
	columns,
	data,
	emptyMessage = 'No data to display.',
	onRowClick,
	rowKey,
	primaryColumnKey,
}: TableCardListProps<T>) => {
	const isClickable = !!onRowClick;
	const primaryColumn = columns.find((col) => col.key === primaryColumnKey);
	const secondaryColumns = columns.filter(
		(col) => col.key !== primaryColumnKey
	);

	const handleClick = useCallback(
		(e: MouseEvent<HTMLDivElement>) => {
			const card = (e.target as HTMLElement).closest('[data-row-index]');
			if (!card) return;
			const index = Number((card as HTMLElement).dataset.rowIndex);
			if (Number.isNaN(index)) return;
			onRowClick?.(data[index], index);
		},
		[onRowClick, data]
	);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLDivElement>) => {
			if (e.key !== 'Enter' && e.key !== ' ') return;
			const card = (e.target as HTMLElement).closest('[data-row-index]');
			if (!card) return;
			e.preventDefault();
			const index = Number((card as HTMLElement).dataset.rowIndex);
			if (Number.isNaN(index)) return;
			onRowClick?.(data[index], index);
		},
		[onRowClick, data]
	);

	if (data.length === 0) {
		return <p className={styles['table__cards-empty']}>{emptyMessage}</p>;
	}

	return (
		<div
			className={styles['table__cards']}
			role="list"
			aria-label="Table rows"
			onClick={isClickable ? handleClick : undefined}
			onKeyDown={isClickable ? handleKeyDown : undefined}
		>
			{data.map((row, rowIndex) => (
				<article
					key={getRowKey(row, rowIndex, rowKey)}
					role={isClickable ? 'button' : 'listitem'}
					data-row-index={rowIndex}
					aria-label={
						isClickable
							? getClickableRowLabel(row, rowIndex, columns, primaryColumnKey)
							: undefined
					}
					className={cn(
						styles['table__card'],
						isClickable && styles['table__card--clickable']
					)}
					tabIndex={isClickable ? 0 : undefined}
				>
					{primaryColumn && (
						<header className={styles['table__card-header']}>
							{renderCell(primaryColumn, row, rowIndex)}
						</header>
					)}

					{secondaryColumns.length > 0 && (
						<dl className={styles['table__card-fields']}>
							{secondaryColumns.map((col) => (
								<div key={col.key} className={styles['table__card-field']}>
									<dt className={styles['table__card-label']}>
										{getColumnLabel(col.header, col.key)}
									</dt>
									<dd className={styles['table__card-value']}>
										{renderCell(col, row, rowIndex)}
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
