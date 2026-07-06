'use client';

import { useCallback, useMemo, useState } from 'react';

import { useDebounce } from '@/hooks/useDebounce';

import type { SortState, TableFilterValues, TableProps } from './Table.types';
import { filterData, resolvePageSize, sortData } from './Table.utils';

const SEARCH_DEBOUNCE_MS = 300;

type UseTableStateOptions<T extends Record<string, unknown>> = Pick<
	TableProps<T>,
	'data' | 'filters' | 'pageSize'
> & {
	pageSizeOptions: number[];
};

type UseTableStateReturn<T extends Record<string, unknown>> = {
	currentPage: number;
	filterValues: TableFilterValues;
	pageSize: number;
	paginatedData: T[];
	resolvedPageSizeOptions: number[];
	rowOffset: number;
	sortState: SortState;
	totalPages: number;
	totalRows: number;
	handleFilterChange: (key: string, value: string) => void;
	handlePageSizeChange: (size: number) => void;
	handleSort: (key: string) => void;
	handleSortChange: (sort: SortState) => void;
	setCurrentPage: (page: number) => void;
};

export const useTableState = <T extends Record<string, unknown>>({
	data,
	filters,
	pageSize: initialPageSize = 10,
	pageSizeOptions,
}: UseTableStateOptions<T>): UseTableStateReturn<T> => {
	const resolvedPageSizeOptions = useMemo(
		() =>
			pageSizeOptions.includes(initialPageSize)
				? pageSizeOptions
				: [...pageSizeOptions, initialPageSize].sort((a, b) => a - b),
		[initialPageSize, pageSizeOptions]
	);

	const [filterValues, setFilterValues] = useState<TableFilterValues>(() =>
		Object.fromEntries((filters ?? []).map((filter) => [filter.key, '']))
	);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(() =>
		resolvePageSize(initialPageSize, resolvedPageSizeOptions)
	);
	const [sortState, setSortState] = useState<SortState>(null);

	const debouncedFilterValues = useDebounce(filterValues, SEARCH_DEBOUNCE_MS);

	const effectiveFilterValues = useMemo(() => {
		if (!filters?.length) return debouncedFilterValues;

		const selectOverrides: TableFilterValues = {};
		for (const filter of filters) {
			if (filter.type === 'select') {
				selectOverrides[filter.key] = filterValues[filter.key] ?? '';
			}
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

	const resetToFirstPage = useCallback(() => {
		setCurrentPage(1);
	}, []);

	const handleFilterChange = useCallback(
		(key: string, value: string) => {
			setFilterValues((prev) => ({ ...prev, [key]: value }));
			resetToFirstPage();
		},
		[resetToFirstPage]
	);

	const handlePageSizeChange = useCallback(
		(size: number) => {
			setPageSize(size);
			resetToFirstPage();
		},
		[resetToFirstPage]
	);

	const handleSort = useCallback(
		(key: string) => {
			setSortState((prev) => {
				if (!prev || prev.key !== key) return { key, direction: 'asc' };
				if (prev.direction === 'asc') return { key, direction: 'desc' };
				return null;
			});
			resetToFirstPage();
		},
		[resetToFirstPage]
	);

	const handleSortChange = useCallback(
		(sort: SortState) => {
			setSortState(sort);
			resetToFirstPage();
		},
		[resetToFirstPage]
	);

	return {
		currentPage,
		filterValues,
		pageSize,
		paginatedData,
		resolvedPageSizeOptions,
		rowOffset,
		sortState,
		totalPages,
		totalRows: sortedData.length,
		handleFilterChange,
		handlePageSizeChange,
		handleSort,
		handleSortChange,
		setCurrentPage,
	};
};
