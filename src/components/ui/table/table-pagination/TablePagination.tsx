'use client';

import { memo, useCallback, useId, useMemo } from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Stack } from '@/components/layout/stack';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';

import styles from '../Table.module.scss';
import type { TablePaginationProps } from '../Table.types';

const TablePaginationBase = ({
	currentPage,
	totalPages,
	pageSize,
	pageSizeOptions,
	totalItems,
	onPageChange,
	onPageSizeChange,
}: TablePaginationProps) => {
	const sizeId = useId();

	const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
	const to = Math.min(currentPage * pageSize, totalItems);

	// Stable across re-renders as long as pageSizeOptions reference is stable
	const sizeOptions = useMemo(
		() => pageSizeOptions.map((n) => ({ value: String(n), label: String(n) })),
		[pageSizeOptions]
	);

	const handlePrev = useCallback(
		() => onPageChange(currentPage - 1),
		[onPageChange, currentPage]
	);

	const handleNext = useCallback(
		() => onPageChange(currentPage + 1),
		[onPageChange, currentPage]
	);

	const handleSizeChange = useCallback(
		(val: string) => onPageSizeChange(Number(val)),
		[onPageSizeChange]
	);

	return (
		<nav aria-label="Pagination" className={styles['table__pagination']}>
			<span className={styles['table__pagination-info']}>
				Showing {from}–{to} of {totalItems}
			</span>

			<Stack
				direction="row"
				align="center"
				gap="xs"
				width="auto"
				className={styles['table__pagination-nav']}
			>
				<Button
					variant="ghost"
					size="sm"
					icon={ChevronLeft}
					aria-label="Previous page"
					disabled={currentPage <= 1}
					onClick={handlePrev}
				/>
				<span className={styles['table__pagination-pages']}>
					{currentPage} / {totalPages}
				</span>
				<Button
					variant="ghost"
					size="sm"
					icon={ChevronRight}
					aria-label="Next page"
					disabled={currentPage >= totalPages}
					onClick={handleNext}
				/>
			</Stack>

			<Stack
				direction="row"
				align="center"
				gap="sm"
				width="auto"
				className={styles['table__pagination-size']}
			>
				<label htmlFor={sizeId} className={styles['table__pagination-label']}>
					Rows per page
				</label>
				<div className={styles['table__pagination-select']}>
					<Select
						id={sizeId}
						options={sizeOptions}
						value={String(pageSize)}
						onChange={handleSizeChange}
					/>
				</div>
			</Stack>
		</nav>
	);
};

// Prevents re-renders while the user is typing (during the search debounce window)
// when pagination props — currentPage, totalItems, totalPages — haven't changed yet.
export const TablePagination = memo(TablePaginationBase);
