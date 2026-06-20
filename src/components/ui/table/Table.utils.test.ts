import { describe, expect, it } from 'vitest';

import type { TableColumn, TableFilter } from './Table.types';
import {
	filterData,
	getClickableRowLabel,
	getColumnLabel,
	getColumnSkeletonVariant,
	getColumnSkeletonWidth,
	getPrimaryColumnKey,
	getRowKey,
	resolvePageSize,
	sortData,
} from './Table.utils';

// ─── getColumnLabel / getPrimaryColumnKey ─────────────────────────────────────

describe('getColumnLabel', () => {
	it('returns string headers as-is', () => {
		expect(getColumnLabel('Name', 'name')).toBe('Name');
	});

	it('falls back to the column key for non-string headers', () => {
		expect(getColumnLabel(null, 'name')).toBe('name');
	});
});

describe('getPrimaryColumnKey', () => {
	const columns: TableColumn<Row>[] = [
		{ key: 'name', header: 'Name' },
		{ key: 'role', header: 'Role', mobilePrimary: true },
	];

	it('prefers the column marked mobilePrimary', () => {
		expect(getPrimaryColumnKey(columns)).toBe('role');
	});

	it('defaults to the first column when none is marked', () => {
		expect(getPrimaryColumnKey([{ key: 'name', header: 'Name' }])).toBe('name');
	});
});

describe('getColumnSkeletonVariant', () => {
	it('returns button for badge-like column keys', () => {
		expect(getColumnSkeletonVariant({ key: 'status', header: 'Status' })).toBe(
			'button'
		);
		expect(getColumnSkeletonVariant({ key: 'role', header: 'Role' })).toBe(
			'button'
		);
	});

	it('returns text for typical columns', () => {
		expect(getColumnSkeletonVariant({ key: 'name', header: 'Name' })).toBe('text');
	});

	it('prefers an explicit skeletonVariant', () => {
		expect(
			getColumnSkeletonVariant({
				key: 'name',
				header: 'Name',
				skeletonVariant: 'heading',
			})
		).toBe('heading');
	});
});

describe('getColumnSkeletonWidth', () => {
	it('maps column keys to fitting widths', () => {
		expect(getColumnSkeletonWidth({ key: 'name', header: 'Name' })).toBe('2/3');
		expect(getColumnSkeletonWidth({ key: 'email', header: 'Email' })).toBe('3/4');
		expect(getColumnSkeletonWidth({ key: 'role', header: 'Role' })).toBe('auto');
		expect(getColumnSkeletonWidth({ key: 'status', header: 'Status' })).toBe(
			'auto'
		);
		expect(getColumnSkeletonWidth({ key: 'joined', header: 'Joined' })).toBe(
			'1/2'
		);
		expect(getColumnSkeletonWidth({ key: 'department', header: 'Department' })).toBe(
			'2/3'
		);
	});

	it('prefers an explicit skeletonWidth', () => {
		expect(
			getColumnSkeletonWidth({
				key: 'name',
				header: 'Name',
				skeletonWidth: '1/4',
			})
		).toBe('1/4');
	});
});

// ─── resolvePageSize ──────────────────────────────────────────────────────────

describe('resolvePageSize', () => {
	it('returns the requested size when it is in the options list', () => {
		expect(resolvePageSize(25, [10, 25, 50])).toBe(25);
	});

	it('returns the first option when the requested size is not in the list', () => {
		expect(resolvePageSize(7, [10, 25, 50])).toBe(10);
	});

	it('returns the requested size when options has only that value', () => {
		expect(resolvePageSize(10, [10])).toBe(10);
	});
});

// ─── filterData ───────────────────────────────────────────────────────────────

type Row = { id: string; name: string; role: string };

const DATA: Row[] = [
	{ id: '1', name: 'Alice', role: 'Admin' },
	{ id: '2', name: 'Bob', role: 'Editor' },
	{ id: '3', name: 'Charlie', role: 'Viewer' },
];

const SEARCH_FILTER: TableFilter = {
	key: 'name',
	label: 'Name',
	type: 'search',
};
const SELECT_FILTER: TableFilter = {
	key: 'role',
	label: 'Role',
	type: 'select',
};

// ─── getRowKey / getClickableRowLabel ─────────────────────────────────────────

describe('getRowKey', () => {
	it('returns the row index by default', () => {
		expect(getRowKey(DATA[0], 0)).toBe('0');
	});

	it('reads a property when rowKey is a keyof T', () => {
		expect(getRowKey(DATA[0], 0, 'id')).toBe('1');
	});

	it('calls a resolver function when rowKey is a function', () => {
		expect(getRowKey(DATA[0], 0, (row) => `user-${row.id}`)).toBe('user-1');
	});
});

describe('getClickableRowLabel', () => {
	const columns: TableColumn<Row>[] = [
		{ key: 'name', header: 'Name' },
		{ key: 'role', header: 'Role' },
	];

	it('uses the primary column value when available', () => {
		expect(getClickableRowLabel(DATA[0], 0, columns, 'name')).toBe(
			'Open row: Alice'
		);
	});

	it('falls back to a numbered label when the primary value is empty', () => {
		const row = { id: '9', name: '', role: 'Admin' };
		expect(getClickableRowLabel(row, 2, columns, 'name')).toBe('Open row 3');
	});
});

describe('filterData', () => {
	it('returns all rows when no filter values are active', () => {
		expect(filterData(DATA, [SEARCH_FILTER], { name: '' })).toHaveLength(3);
	});

	it('filters rows by a partial search string (case-insensitive)', () => {
		const result = filterData(DATA, [SEARCH_FILTER], { name: 'ali' });
		expect(result).toHaveLength(1);
		expect(result[0].name).toBe('Alice');
	});

	it('filters rows by an exact select value (case-insensitive)', () => {
		const result = filterData(DATA, [SELECT_FILTER], { role: 'Admin' });
		expect(result).toHaveLength(1);
		expect(result[0].name).toBe('Alice');
	});

	it('returns no rows when no match is found', () => {
		expect(filterData(DATA, [SEARCH_FILTER], { name: 'zzz' })).toHaveLength(0);
	});

	it('applies multiple active filters with AND logic', () => {
		const result = filterData(DATA, [SEARCH_FILTER, SELECT_FILTER], {
			name: 'ali',
			role: 'Admin',
		});
		expect(result).toHaveLength(1);
		expect(result[0].name).toBe('Alice');
	});

	it('returns no rows when multiple filters produce an empty intersection', () => {
		const result = filterData(DATA, [SEARCH_FILTER, SELECT_FILTER], {
			name: 'alice',
			role: 'Editor',
		});
		expect(result).toHaveLength(0);
	});

	it('ignores filter keys not present in the filters definition', () => {
		const result = filterData(DATA, [SEARCH_FILTER], {
			name: '',
			unknown: 'foo',
		});
		expect(result).toHaveLength(3);
	});
});

// ─── sortData ─────────────────────────────────────────────────────────────────

type NumRow = { id: string; score: number };

const NUM_DATA: NumRow[] = [
	{ id: '1', score: 30 },
	{ id: '2', score: 10 },
	{ id: '3', score: 20 },
];

describe('sortData', () => {
	it('returns the original array reference when sort is null', () => {
		const result = sortData(DATA, null);
		expect(result).toBe(DATA);
	});

	it('sorts strings ascending', () => {
		const result = sortData(DATA, { key: 'name', direction: 'asc' });
		expect(result.map((r) => r.name)).toEqual(['Alice', 'Bob', 'Charlie']);
	});

	it('sorts strings descending', () => {
		const result = sortData(DATA, { key: 'name', direction: 'desc' });
		expect(result.map((r) => r.name)).toEqual(['Charlie', 'Bob', 'Alice']);
	});

	it('sorts numbers ascending', () => {
		const result = sortData(NUM_DATA, { key: 'score', direction: 'asc' });
		expect(result.map((r) => r.score)).toEqual([10, 20, 30]);
	});

	it('sorts numbers descending', () => {
		const result = sortData(NUM_DATA, { key: 'score', direction: 'desc' });
		expect(result.map((r) => r.score)).toEqual([30, 20, 10]);
	});

	it('does not mutate the original array', () => {
		const original = [...DATA];
		sortData(DATA, { key: 'name', direction: 'desc' });
		expect(DATA).toEqual(original);
	});

	it('sorts numeric strings with numeric-aware ordering ("10" > "9")', () => {
		const rows = [
			{ id: '1', code: '10' },
			{ id: '2', code: '9' },
			{ id: '3', code: '2' },
		];
		const result = sortData(rows, { key: 'code', direction: 'asc' });
		expect(result.map((r) => r.code)).toEqual(['2', '9', '10']);
	});
});
