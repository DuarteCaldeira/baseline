'use client';

import { cn } from '@/utils/cn';

import styles from './Table.module.scss';
import type { TableProps } from './Table.types';
import { TableFilters } from './table-filters';
import { TableGrid } from './table-grid';
import { TablePagination } from './table-pagination';
import { TableSkeleton } from './table-skeleton';
import { useTableState } from './useTableState';

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50];

export const Table = <T extends Record<string, unknown>>({
	data,
	columns,
	filters,
	pageSize: initialPageSize = 10,
	pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
	emptyMessage,
	loading = false,
	onRowClick,
	className,
	rowKey,
}: TableProps<T>) => {
	const {
		currentPage,
		filterValues,
		pageSize,
		paginatedData,
		resolvedPageSizeOptions,
		rowOffset,
		sortState,
		totalPages,
		totalRows,
		handleFilterChange,
		handlePageSizeChange,
		handleSort,
		handleSortChange,
		setCurrentPage,
	} = useTableState({
		data,
		filters,
		pageSize: initialPageSize,
		pageSizeOptions,
	});

	return (
		<div className={cn(styles.table, className)}>
			{filters && filters.length > 0 && (
				<TableFilters
					filters={filters}
					values={filterValues}
					onChange={handleFilterChange}
				/>
			)}

			<div className={styles['table__scroll']} aria-busy={loading || undefined}>
				{loading ? (
					<TableSkeleton columns={columns} rows={pageSize} />
				) : (
					<TableGrid
						columns={columns}
						data={paginatedData}
						emptyMessage={emptyMessage}
						onRowClick={onRowClick}
						rowKey={rowKey}
						sortState={sortState}
						onSort={handleSort}
						onSortChange={handleSortChange}
						rowOffset={rowOffset}
						totalRows={totalRows}
					/>
				)}
			</div>

			<TablePagination
				currentPage={currentPage}
				totalPages={totalPages}
				pageSize={pageSize}
				pageSizeOptions={resolvedPageSizeOptions}
				totalItems={totalRows}
				onPageChange={setCurrentPage}
				onPageSizeChange={handlePageSizeChange}
			/>
		</div>
	);
};
