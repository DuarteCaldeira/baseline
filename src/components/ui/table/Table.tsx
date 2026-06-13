'use client';

import { useCallback, useMemo, useState } from 'react';

import { useDebounce } from '@/hooks/useDebounce';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { TABLE_MOBILE_MEDIA_QUERY } from '@/utils/breakpoints';
import { cn } from '@/utils/cn';

import styles from './Table.module.scss';
import type { SortState, TableFilterValues, TableProps } from './Table.types';
import { filterData, resolvePageSize, sortData } from './Table.utils';
import { TableFilters } from './table-filters';
import { TableGrid } from './table-grid';
import { TablePagination } from './table-pagination';
import { TableSkeleton } from './table-skeleton';

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50];
const SEARCH_DEBOUNCE_MS = 300;

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
	const resolvedPageSizeOptions = useMemo(
		() =>
			pageSizeOptions.includes(initialPageSize)
				? pageSizeOptions
				: [...pageSizeOptions, initialPageSize].sort((a, b) => a - b),
		[initialPageSize, pageSizeOptions]
	);

	const [filterValues, setFilterValues] = useState<TableFilterValues>(() =>
		Object.fromEntries((filters ?? []).map((f) => [f.key, '']))
	);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(() =>
		resolvePageSize(initialPageSize, resolvedPageSizeOptions)
	);
	const [sortState, setSortState] = useState<SortState>(null);
	const isMobile = useMediaQuery(TABLE_MOBILE_MEDIA_QUERY);

	const debouncedFilterValues = useDebounce(filterValues, SEARCH_DEBOUNCE_MS);

	// Select filters apply immediately; search filters wait for the debounce window
	const effectiveFilterValues = useMemo(() => {
		if (!filters?.length) return debouncedFilterValues;
		const selectOverrides: TableFilterValues = {};
		for (const f of filters) {
			if (f.type === 'select')
				selectOverrides[f.key] = filterValues[f.key] ?? '';
		}
		return { ...debouncedFilterValues, ...selectOverrides };
	}, [debouncedFilterValues, filterValues, filters]);

	const filteredData = useMemo(
		() => filterData(data, filters ?? [], effectiveFilterValues),
		[data, filters, effectiveFilterValues]
	);

	const sortedData = useMemo(
		() => sortData(filteredData, sortState),
		[filteredData, sortState]
	);

	const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
	const rowOffset = (currentPage - 1) * pageSize;

	const paginatedData = useMemo(
		() => sortedData.slice(rowOffset, rowOffset + pageSize),
		[sortedData, rowOffset, pageSize]
	);

	const handleFilterChange = useCallback((key: string, value: string) => {
		setFilterValues((prev) => ({ ...prev, [key]: value }));
		setCurrentPage(1);
	}, []);

	const handlePageSizeChange = useCallback((size: number) => {
		setPageSize(size);
		setCurrentPage(1);
	}, []);

	// Cycle: unsorted → ascending → descending → unsorted
	const handleSort = useCallback((key: string) => {
		setSortState((prev) => {
			if (!prev || prev.key !== key) return { key, direction: 'asc' };
			if (prev.direction === 'asc') return { key, direction: 'desc' };
			return null;
		});
		setCurrentPage(1);
	}, []);

	const handleSortChange = useCallback((sort: SortState) => {
		setSortState(sort);
		setCurrentPage(1);
	}, []);

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
					<TableSkeleton
						columns={columns}
						rows={pageSize}
						isMobile={isMobile}
					/>
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
						totalRows={sortedData.length}
						isMobile={isMobile}
					/>
				)}
			</div>

			<TablePagination
				currentPage={currentPage}
				totalPages={totalPages}
				pageSize={pageSize}
				pageSizeOptions={resolvedPageSizeOptions}
				totalItems={sortedData.length}
				onPageChange={setCurrentPage}
				onPageSizeChange={handlePageSizeChange}
			/>
		</div>
	);
};
