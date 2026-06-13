import { useId, useMemo } from 'react';

import { Select } from '@/components/ui/select';
import type { SelectOption } from '@/components/ui/select';

import styles from '../Table.module.scss';
import type { SortDirection, SortState, TableColumn } from '../Table.types';
import { getColumnLabel } from '../Table.utils';

const SORT_VALUE_SEP = ':';

type TableMobileSortProps<T extends Record<string, unknown>> = {
	columns: TableColumn<T>[];
	sortState: SortState;
	onSortChange: (sort: SortState) => void;
};

const encodeSortValue = (key: string, direction: SortDirection): string =>
	`${key}${SORT_VALUE_SEP}${direction}`;

const decodeSortValue = (value: string): SortState => {
	const sepIndex = value.indexOf(SORT_VALUE_SEP);
	if (sepIndex === -1) return null;

	const key = value.slice(0, sepIndex);
	const direction = value.slice(sepIndex + 1);

	if (direction !== 'asc' && direction !== 'desc') return null;
	return { key, direction };
};

const buildSortOptions = <T extends Record<string, unknown>>(
	columns: TableColumn<T>[]
): SelectOption[] => {
	const sortableColumns = columns.filter((col) => col.sortable);

	return [
		{ value: '', label: 'Default order' },
		...sortableColumns.flatMap((col) => {
			const label = getColumnLabel(col.header, col.key);
			return [
				{
					value: encodeSortValue(col.key, 'asc'),
					label: `${label} (ascending)`,
				},
				{
					value: encodeSortValue(col.key, 'desc'),
					label: `${label} (descending)`,
				},
			];
		}),
	];
};

export const TableMobileSort = <T extends Record<string, unknown>>({
	columns,
	sortState,
	onSortChange,
}: TableMobileSortProps<T>) => {
	const id = useId();
	const options = useMemo(() => buildSortOptions(columns), [columns]);
	const hasSortableColumns = options.length > 1;

	if (!hasSortableColumns) return null;

	const value = sortState
		? encodeSortValue(sortState.key, sortState.direction)
		: '';

	const handleChange = (next: string) => {
		if (!next) {
			onSortChange(null);
			return;
		}
		onSortChange(decodeSortValue(next));
	};

	return (
		<div className={styles['table__mobile-sort']}>
			<Select
				id={id}
				label="Sort by"
				options={options}
				value={value}
				onChange={handleChange}
			/>
		</div>
	);
};
