import type { ReactNode } from 'react';

import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

import { Icon } from '@/components/ui/icon';
import { cn } from '@/utils/cn';

import styles from '../Table.module.scss';
import type { SortDirection } from '../Table.types';

type TableHeaderCellProps = {
	header: ReactNode;
	sortable?: boolean;
	sortDirection: SortDirection | null;
	onSort?: () => void;
	width?: string;
};

const getSortIcon = (direction: SortDirection | null) => {
	if (direction === 'asc') return ArrowUp;
	if (direction === 'desc') return ArrowDown;
	return ArrowUpDown;
};

const getAriaSort = (
	sortable: boolean | undefined,
	direction: SortDirection | null
): 'ascending' | 'descending' | 'none' | undefined => {
	if (!sortable) return undefined;
	if (direction === 'asc') return 'ascending';
	if (direction === 'desc') return 'descending';
	return 'none';
};

export const TableHeaderCell = ({
	header,
	sortable,
	sortDirection,
	onSort,
	width,
}: TableHeaderCellProps) => (
	<th
		scope="col"
		className={cn(
			styles['table__th'],
			sortable && styles['table__th--sortable']
		)}
		style={width ? { width } : undefined}
		aria-sort={getAriaSort(sortable, sortDirection)}
	>
		{sortable ? (
			<button
				type="button"
				className={cn(
					styles['table__sort-btn'],
					sortDirection && styles['table__sort-btn--active']
				)}
				onClick={onSort}
				aria-label={
					typeof header === 'string' || typeof header === 'number'
						? `Sort by ${header}`
						: 'Sort column'
				}
			>
				<span>{header}</span>
				<Icon
					icon={getSortIcon(sortDirection)}
					size="sm"
					className={cn(
						styles['table__sort-icon'],
						sortDirection && styles['table__sort-icon--active']
					)}
				/>
			</button>
		) : (
			header
		)}
	</th>
);
