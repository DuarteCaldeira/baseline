import type { ReactNode } from 'react';

import type { SelectOption } from '@/components/ui/select';

export type SortDirection = 'asc' | 'desc';

export type SortState = {
	key: string;
	direction: SortDirection;
} | null;

export type TableColumn<T extends Record<string, unknown>> = {
	key: string;
	header: ReactNode;
	render?: (row: T, rowIndex: number) => ReactNode;
	width?: string;
	/** Enables click-to-sort. Compares by `row[key]` using numeric-aware locale comparison. */
	sortable?: boolean;
	/** Renders as the card title on mobile. Defaults to the first column. */
	mobilePrimary?: boolean;
};

export type TableFilter = {
	key: string;
	label: string;
	type: 'search' | 'select';
	placeholder?: string;
	options?: SelectOption[];
};

export type TableFilterValues = Record<string, string>;

export type TableProps<T extends Record<string, unknown>> = {
	data: T[];
	columns: TableColumn<T>[];
	filters?: TableFilter[];
	pageSize?: number;
	pageSizeOptions?: number[];
	emptyMessage?: string;
	loading?: boolean;
	onRowClick?: (row: T, rowIndex: number) => void;
	/** Stable React key for each row. Defaults to the row index. */
	rowKey?: keyof T | ((row: T, rowIndex: number) => string);
	className?: string;
};

export type TableFiltersProps = {
	filters: TableFilter[];
	values: TableFilterValues;
	onChange: (key: string, value: string) => void;
};

export type TablePaginationProps = {
	currentPage: number;
	totalPages: number;
	pageSize: number;
	pageSizeOptions: number[];
	totalItems: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
};

export type TableGridProps<T extends Record<string, unknown>> = {
	columns: TableColumn<T>[];
	data: T[];
	emptyMessage?: string;
	onRowClick?: (row: T, rowIndex: number) => void;
	rowKey?: keyof T | ((row: T, rowIndex: number) => string);
	sortState: SortState;
	onSort: (key: string) => void;
	onSortChange: (sort: SortState) => void;
	/** 0-based index of the first row on the current page — used for aria-rowindex. */
	rowOffset: number;
	/** Total filtered row count across all pages — used for aria-rowcount. */
	totalRows: number;
};
