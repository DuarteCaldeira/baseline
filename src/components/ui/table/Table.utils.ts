import type { ReactNode } from 'react';

import type {
	SortState,
	TableColumn,
	TableFilter,
	TableFilterValues,
} from './Table.types';

/** String label for mobile card rows — falls back to the column key. */
export const getColumnLabel = (header: ReactNode, key: string): string => {
	if (typeof header === 'string') return header;
	if (typeof header === 'number') return String(header);
	return key;
};

/** Which column becomes the card title on mobile. */
export const getPrimaryColumnKey = <T extends Record<string, unknown>>(
	columns: TableColumn<T>[]
): string | undefined =>
	columns.find((col) => col.mobilePrimary)?.key ?? columns[0]?.key;

export const getRowKey = <T extends Record<string, unknown>>(
	row: T,
	rowIndex: number,
	rowKey?: keyof T | ((row: T, rowIndex: number) => string)
): string => {
	if (!rowKey) return String(rowIndex);
	if (typeof rowKey === 'function') return rowKey(row, rowIndex);
	return String(row[rowKey] ?? rowIndex);
};

export const getClickableRowLabel = <T extends Record<string, unknown>>(
	row: T,
	rowIndex: number,
	columns: TableColumn<T>[],
	primaryColumnKey?: string
): string => {
	const key = primaryColumnKey ?? columns[0]?.key;
	const value = key ? row[key] : undefined;

	if (value != null && String(value).trim()) {
		return `Open row: ${value}`;
	}

	return `Open row ${rowIndex + 1}`;
};

export const resolvePageSize = (
	requested: number,
	options: number[]
): number => {
	if (options.includes(requested)) return requested;
	return options[0] ?? requested;
};

const matchesFilter = (
	cell: string,
	value: string,
	type: TableFilter['type']
): boolean => {
	if (type === 'select') return cell === value.toLowerCase();
	return cell.includes(value.toLowerCase());
};

export const filterData = <T extends Record<string, unknown>>(
	data: T[],
	filters: TableFilter[],
	values: TableFilterValues
): T[] => {
	const active = Object.entries(values).filter(([, v]) => v !== '');
	if (!active.length) return data;

	// Pre-build type map once per call — O(k) vs O(k * n) for repeated finds
	const typeMap = new Map(filters.map((f) => [f.key, f.type]));

	return data.filter((row) =>
		active.every(([key, value]) => {
			const type = typeMap.get(key);
			if (!type) return true;
			return matchesFilter(String(row[key] ?? '').toLowerCase(), value, type);
		})
	);
};

// Numeric-aware locale comparison so "10" sorts after "9", not between "1" and "2"
const compareValues = (a: unknown, b: unknown): number => {
	if (typeof a === 'number' && typeof b === 'number') return a - b;
	return String(a ?? '').localeCompare(String(b ?? ''), undefined, {
		numeric: true,
		sensitivity: 'base',
	});
};

export const sortData = <T extends Record<string, unknown>>(
	data: T[],
	sort: SortState
): T[] => {
	if (!sort) return data;
	const { key, direction } = sort;
	return [...data].sort((a, b) => {
		const result = compareValues(a[key], b[key]);
		return direction === 'asc' ? result : -result;
	});
};
