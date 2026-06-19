'use client';

import { memo, useId, useMemo } from 'react';

import { Stack } from '@/components/layout/stack';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

import styles from '../Table.module.scss';
import type { TableFiltersProps } from '../Table.types';

const TableFiltersBase = ({ filters, values, onChange }: TableFiltersProps) => {
	const idPrefix = useId();

	// Pre-build the "All + options" arrays once per filters reference change,
	// not on every re-render caused by the user typing in a search field.
	const selectOptions = useMemo(
		() =>
			new Map(
				filters
					.filter((f) => f.type === 'select' && f.options?.length)
					.map((f) => [
						f.key,
						[{ value: '', label: 'All' }, ...(f.options ?? [])],
					])
			),
		[filters]
	);

	return (
		<Stack direction="row" wrap gap="md" className={styles['table__filters']}>
			{filters.map((filter) => {
				const id = `${idPrefix}-${filter.key}`;

				if (filter.type === 'select') {
					return (
						<div key={filter.key} className={styles['table__filter-item']}>
							<Select
								id={id}
								label={filter.label}
								options={selectOptions.get(filter.key) ?? []}
								value={values[filter.key] ?? ''}
								onChange={(val) => onChange(filter.key, val)}
							/>
						</div>
					);
				}

				return (
					<div key={filter.key} className={styles['table__filter-item']}>
						<Input
							id={id}
							label={filter.label}
							type="search"
							placeholder={filter.placeholder ?? 'Search…'}
							value={values[filter.key] ?? ''}
							onChange={(e) => onChange(filter.key, e.target.value)}
						/>
					</div>
				);
			})}
		</Stack>
	);
};

// Prevents re-renders on page navigation when filter values haven't changed.
// Requires the consumer to pass a stable `filters` reference (defined outside
// the render function or wrapped in useMemo).
export const TableFilters = memo(TableFiltersBase);
