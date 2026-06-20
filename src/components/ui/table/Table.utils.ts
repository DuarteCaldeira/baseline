import type { ReactNode } from 'react';

import type { SkeletonVariant, SkeletonWidth } from '@/components/patterns/skeleton';

import type {
	SortState,
	TableColumn,
	TableFilter,
	TableFilterValues,
} from './Table.types';

const BADGE_LIKE_KEY_PARTS = ['role', 'status', 'type', 'badge', 'tag'];
const SHORT_KEY_PARTS = ['id', 'code', 'qty', 'count'];
const DATE_KEY_PARTS = ['date', 'joined', 'created', 'updated', 'time'];
const LONG_KEY_PARTS = ['email', 'description', 'url', 'address', 'notes'];

const includesKeyPart = (key: string, parts: string[]) =>
	parts.some((part) => key.includes(part));

/** String label for mobile card rows — falls back to the column key. */
export const getColumnLabel = (header: ReactNode, key: string): string => {
	if (typeof header === 'string') return header;
	if (typeof header === 'number') return String(header);
	return key;
};

/** Skeleton shape for a column's loading placeholder. */
export const getColumnSkeletonVariant = <T extends Record<string, unknown>>(
	col: TableColumn<T>
): SkeletonVariant => {
	if (col.skeletonVariant) return col.skeletonVariant;

	const key = col.key.toLowerCase();
	if (includesKeyPart(key, BADGE_LIKE_KEY_PARTS)) return 'button';

	return 'text';
};

/** Skeleton width for a column's loading placeholder. */
export const getColumnSkeletonWidth = <T extends Record<string, unknown>>(
	col: TableColumn<T>
): SkeletonWidth => {
	if (col.skeletonWidth) return col.skeletonWidth;

	const variant = getColumnSkeletonVariant(col);
	if (variant === 'button') return 'auto';

	const key = col.key.toLowerCase();
	if (includesKeyPart(key, LONG_KEY_PARTS)) return '3/4';
	if (includesKeyPart(key, DATE_KEY_PARTS)) return '1/2';
	if (includesKeyPart(key, SHORT_KEY_PARTS)) return '1/3';
	if (includesKeyPart(key, BADGE_LIKE_KEY_PARTS)) return '1/3';
	if (key.includes('name') || key.includes('title')) return '2/3';
	if (key.includes('department') || key.includes('category')) return '2/3';

	const label = getColumnLabel(col.header, col.key);
	if (label.length <= 5) return '1/2';
	if (label.length <= 8) return '2/3';

	return '3/4';
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
