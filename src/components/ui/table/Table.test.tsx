import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { setupFakeTimers } from '@/test-utils/setupFakeTimers';
import {
	setTableDesktopViewport,
	setTableMobileViewport,
} from '@/test-utils/tableViewport';

import { Table } from './Table';
import type { TableColumn, TableFilter } from './Table.types';

// ─── Shared fixtures ──────────────────────────────────────────────────────────

type Row = { id: string; name: string; role: string };

const COLUMNS: TableColumn<Row>[] = [
	{ key: 'name', header: 'Name', sortable: true },
	{ key: 'role', header: 'Role' },
];

const DATA: Row[] = [
	{ id: '1', name: 'Alice', role: 'Admin' },
	{ id: '2', name: 'Bob', role: 'Editor' },
	{ id: '3', name: 'Charlie', role: 'Viewer' },
	{ id: '4', name: 'Diana', role: 'Admin' },
	{ id: '5', name: 'Eve', role: 'Editor' },
];

const SEARCH_FILTER: TableFilter = {
	key: 'name',
	label: 'Search',
	type: 'search',
	placeholder: 'Search…',
};

const SELECT_FILTER: TableFilter = {
	key: 'role',
	label: 'Role',
	type: 'select',
	options: [
		{ value: 'Admin', label: 'Admin' },
		{ value: 'Editor', label: 'Editor' },
		{ value: 'Viewer', label: 'Viewer' },
	],
};

const clickColumnSort = async (
	user: ReturnType<typeof userEvent.setup>,
	columnName: string
) => {
	const header = screen.getByRole('columnheader', { name: columnName });
	await user.click(within(header).getByRole('button'));
};

const withinTable = () => within(screen.getByRole('table'));

// ─── Rendering ────────────────────────────────────────────────────────────────

describe('Table — rendering', () => {
	beforeEach(() => {
		setTableDesktopViewport();
	});

	it('renders column headers', () => {
		render(<Table data={DATA} columns={COLUMNS} />);

		expect(
			screen.getByRole('columnheader', { name: 'Name' })
		).toBeInTheDocument();
		expect(
			screen.getByRole('columnheader', { name: 'Role' })
		).toBeInTheDocument();
	});

	it('renders all rows when page size exceeds the dataset', () => {
		render(<Table data={DATA} columns={COLUMNS} pageSize={10} />);

		for (const row of DATA) {
			expect(withinTable().getByText(row.name)).toBeInTheDocument();
		}
	});

	it('limits visible rows to the page size', () => {
		render(<Table data={DATA} columns={COLUMNS} pageSize={2} />);

		expect(withinTable().getByText('Alice')).toBeInTheDocument();
		expect(withinTable().getByText('Bob')).toBeInTheDocument();
		expect(withinTable().queryByText('Charlie')).not.toBeInTheDocument();
	});

	it('uses a custom render function for cells', () => {
		const columns: TableColumn<Row>[] = [
			{ key: 'name', header: 'Name', render: (row) => <em>{row.name}</em> },
		];
		const { container } = render(
			<Table data={DATA} columns={columns} pageSize={10} />
		);

		expect(container.querySelector('em')).toBeInTheDocument();
	});

	it('renders stacked cards on small screens', () => {
		setTableMobileViewport();

		try {
			const { container } = render(
				<Table data={DATA} columns={COLUMNS} pageSize={10} />
			);

			expect(container.querySelectorAll('.table__card')).toHaveLength(
				DATA.length
			);
			expect(
				container.querySelector('.table__card-header')
			).toBeInTheDocument();
			expect(
				container.querySelector('.table__card-fields')
			).toBeInTheDocument();
		} finally {
			setTableDesktopViewport();
		}
	});

	it('renders a mobile sort select on small screens', () => {
		setTableMobileViewport();

		try {
			render(<Table data={DATA} columns={COLUMNS} pageSize={10} />);

			expect(
				screen.getByRole('combobox', { name: 'Sort by' })
			).toBeInTheDocument();
		} finally {
			setTableDesktopViewport();
		}
	});
});

// ─── Empty state ──────────────────────────────────────────────────────────────

describe('Table — empty state', () => {
	beforeEach(() => {
		setTableDesktopViewport();
	});

	it('shows the default message when data is empty', () => {
		render(<Table data={[]} columns={COLUMNS} />);

		expect(withinTable().getByText('No data to display.')).toBeInTheDocument();
	});

	it('shows a custom empty message', () => {
		render(<Table data={[]} columns={COLUMNS} emptyMessage="Nothing here." />);

		expect(withinTable().getByText('Nothing here.')).toBeInTheDocument();
	});
});

// ─── Loading ──────────────────────────────────────────────────────────────────

describe('Table — loading', () => {
	beforeEach(() => {
		setTableDesktopViewport();
	});

	it('hides data rows when loading', () => {
		render(<Table data={DATA} columns={COLUMNS} loading />);

		expect(withinTable().queryByText('Alice')).not.toBeInTheDocument();
	});

	it('still renders column headers while loading', () => {
		render(<Table data={DATA} columns={COLUMNS} loading />);

		expect(
			screen.getByRole('columnheader', { name: 'Name' })
		).toBeInTheDocument();
	});

	it('marks the scroll region as busy while loading', () => {
		const { container } = render(
			<Table data={DATA} columns={COLUMNS} loading />
		);

		expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
	});

	it('does not mark the scroll region as busy when not loading', () => {
		const { container } = render(<Table data={DATA} columns={COLUMNS} />);

		expect(
			container.querySelector('[aria-busy="true"]')
		).not.toBeInTheDocument();
	});

	it('renders per-column skeleton widths while loading', () => {
		const columns: TableColumn<Row>[] = [
			{ key: 'name', header: 'Name' },
			{ key: 'role', header: 'Role' },
		];

		const { container } = render(
			<Table data={DATA} columns={columns} loading />
		);

		const skeletons = container.querySelectorAll('.skeleton');
		expect(skeletons[0]).toHaveClass('skeleton--width-2/3');
		expect(skeletons[1]).toHaveClass('skeleton--button');
	});
});

// ─── Sorting ──────────────────────────────────────────────────────────────────

describe('Table — sorting', () => {
	beforeEach(() => {
		setTableDesktopViewport();
	});

	it('renders a sort button only for sortable columns', () => {
		render(<Table data={DATA} columns={COLUMNS} />);

		const nameHeader = screen.getByRole('columnheader', { name: 'Name' });
		const roleHeader = screen.getByRole('columnheader', { name: 'Role' });
		expect(within(nameHeader).getByRole('button')).toBeInTheDocument();
		expect(within(roleHeader).queryByRole('button')).not.toBeInTheDocument();
	});

	it('sets aria-sort="none" on an unsorted sortable column', () => {
		render(<Table data={DATA} columns={COLUMNS} />);

		expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute(
			'aria-sort',
			'none'
		);
	});

	it('does not set aria-sort on a non-sortable column', () => {
		render(<Table data={DATA} columns={COLUMNS} />);

		expect(
			screen.getByRole('columnheader', { name: 'Role' })
		).not.toHaveAttribute('aria-sort');
	});

	it('sorts rows ascending on the first click', async () => {
		const user = userEvent.setup();
		render(<Table data={DATA} columns={COLUMNS} pageSize={10} />);

		await clickColumnSort(user, 'Name');

		const rows = screen.getAllByRole('row');
		// rows[0] is the header row; data starts at rows[1]
		expect(rows[1]).toHaveTextContent('Alice');
		expect(rows[5]).toHaveTextContent('Eve');
	});

	it('sets aria-sort="ascending" after the first click', async () => {
		const user = userEvent.setup();
		render(<Table data={DATA} columns={COLUMNS} />);

		await clickColumnSort(user, 'Name');

		expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute(
			'aria-sort',
			'ascending'
		);
	});

	it('sorts rows descending on the second click', async () => {
		const user = userEvent.setup();
		render(<Table data={DATA} columns={COLUMNS} pageSize={10} />);

		await clickColumnSort(user, 'Name');
		await clickColumnSort(user, 'Name');

		const rows = screen.getAllByRole('row');
		expect(rows[1]).toHaveTextContent('Eve');
		expect(rows[5]).toHaveTextContent('Alice');
	});

	it('sets aria-sort="descending" after the second click', async () => {
		const user = userEvent.setup();
		render(<Table data={DATA} columns={COLUMNS} />);

		await clickColumnSort(user, 'Name');
		await clickColumnSort(user, 'Name');

		expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute(
			'aria-sort',
			'descending'
		);
	});

	it('clears the sort on the third click and restores original order', async () => {
		const user = userEvent.setup();
		render(<Table data={DATA} columns={COLUMNS} pageSize={10} />);

		await clickColumnSort(user, 'Name');
		await clickColumnSort(user, 'Name');
		await clickColumnSort(user, 'Name');

		const rows = screen.getAllByRole('row');
		expect(rows[1]).toHaveTextContent('Alice');
		expect(rows[2]).toHaveTextContent('Bob');
	});

	it('resets to page 1 when sort changes', async () => {
		const user = userEvent.setup();
		render(<Table data={DATA} columns={COLUMNS} pageSize={2} />);

		// Navigate to page 2 to confirm we move back
		await user.click(screen.getByRole('button', { name: 'Next page' }));
		expect(withinTable().getByText('Charlie')).toBeInTheDocument();

		await clickColumnSort(user, 'Name');

		// Back on page 1 after sort
		expect(withinTable().getByText('Alice')).toBeInTheDocument();
		expect(withinTable().queryByText('Charlie')).not.toBeInTheDocument();
	});
});

// ─── Pagination ───────────────────────────────────────────────────────────────

describe('Table — pagination', () => {
	beforeEach(() => {
		setTableDesktopViewport();
	});

	it('shows the first page initially', () => {
		render(<Table data={DATA} columns={COLUMNS} pageSize={2} />);

		expect(withinTable().getByText('Alice')).toBeInTheDocument();
		expect(withinTable().queryByText('Charlie')).not.toBeInTheDocument();
	});

	it('navigates to the next page when next is clicked', async () => {
		const user = userEvent.setup();
		render(<Table data={DATA} columns={COLUMNS} pageSize={2} />);

		await user.click(screen.getByRole('button', { name: 'Next page' }));

		expect(withinTable().queryByText('Alice')).not.toBeInTheDocument();
		expect(withinTable().getByText('Charlie')).toBeInTheDocument();
	});

	it('navigates back with the previous button', async () => {
		const user = userEvent.setup();
		render(<Table data={DATA} columns={COLUMNS} pageSize={2} />);

		await user.click(screen.getByRole('button', { name: 'Next page' }));
		await user.click(screen.getByRole('button', { name: 'Previous page' }));

		expect(withinTable().getByText('Alice')).toBeInTheDocument();
	});

	it('disables the previous button on the first page', () => {
		render(<Table data={DATA} columns={COLUMNS} pageSize={2} />);

		expect(
			screen.getByRole('button', { name: 'Previous page' })
		).toBeDisabled();
	});

	it('disables the next button on the last page', async () => {
		const user = userEvent.setup();
		// 5 items, 2 per page → 3 pages
		render(<Table data={DATA} columns={COLUMNS} pageSize={2} />);

		await user.click(screen.getByRole('button', { name: 'Next page' }));
		await user.click(screen.getByRole('button', { name: 'Next page' }));

		expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
	});

	it('shows the correct item range on the first page', () => {
		render(<Table data={DATA} columns={COLUMNS} pageSize={2} />);

		expect(screen.getByText('Showing 1–2 of 5')).toBeInTheDocument();
	});

	it('shows the correct item range on subsequent pages', async () => {
		const user = userEvent.setup();
		render(<Table data={DATA} columns={COLUMNS} pageSize={2} />);

		await user.click(screen.getByRole('button', { name: 'Next page' }));

		expect(screen.getByText('Showing 3–4 of 5')).toBeInTheDocument();
	});

	it('shows "0" range when the table is empty', () => {
		render(<Table data={[]} columns={COLUMNS} />);

		expect(screen.getByText('Showing 0–0 of 0')).toBeInTheDocument();
	});
});

// ─── Filtering ────────────────────────────────────────────────────────────────

describe('Table — search filter (debounced)', () => {
	setupFakeTimers();

	beforeEach(() => {
		setTableDesktopViewport();
	});

	it('shows only matching rows after the debounce delay', () => {
		render(
			<Table
				data={DATA}
				columns={COLUMNS}
				filters={[SEARCH_FILTER]}
				pageSize={10}
			/>
		);

		act(() => {
			fireEvent.change(screen.getByRole('searchbox', { name: 'Search' }), {
				target: { value: 'Ali' },
			});
		});
		act(() => {
			vi.advanceTimersByTime(300);
		});

		expect(withinTable().getByText('Alice')).toBeInTheDocument();
		expect(withinTable().queryByText('Bob')).not.toBeInTheDocument();
	});

	it('restores all rows when the search input is cleared', () => {
		render(
			<Table
				data={DATA}
				columns={COLUMNS}
				filters={[SEARCH_FILTER]}
				pageSize={10}
			/>
		);

		const search = screen.getByRole('searchbox', { name: 'Search' });
		act(() => {
			fireEvent.change(search, { target: { value: 'Ali' } });
		});
		act(() => {
			vi.advanceTimersByTime(300);
		});

		act(() => {
			fireEvent.change(search, { target: { value: '' } });
		});
		act(() => {
			vi.advanceTimersByTime(300);
		});

		expect(withinTable().getByText('Bob')).toBeInTheDocument();
	});

	it('resets to page 1 when the filter changes', () => {
		render(
			<Table
				data={DATA}
				columns={COLUMNS}
				filters={[SEARCH_FILTER]}
				pageSize={2}
			/>
		);

		act(() => {
			fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
		});

		act(() => {
			fireEvent.change(screen.getByRole('searchbox', { name: 'Search' }), {
				target: { value: 'Ali' },
			});
		});
		act(() => {
			vi.advanceTimersByTime(300);
		});

		expect(withinTable().getByText('Alice')).toBeInTheDocument();
	});
});

describe('Table — select filter (immediate)', () => {
	beforeEach(() => {
		setTableDesktopViewport();
	});

	it('shows only matching rows immediately when a select option is chosen', async () => {
		const user = userEvent.setup();
		render(
			<Table
				data={DATA}
				columns={COLUMNS}
				filters={[SELECT_FILTER]}
				pageSize={10}
			/>
		);

		await user.click(screen.getByRole('combobox', { name: 'Role' }));
		await user.click(screen.getByRole('option', { name: 'Viewer' }));

		expect(withinTable().getByText('Charlie')).toBeInTheDocument();
		expect(withinTable().queryByText('Alice')).not.toBeInTheDocument();
		expect(withinTable().queryByText('Bob')).not.toBeInTheDocument();
	});
});

// ─── Row interaction ──────────────────────────────────────────────────────────

describe('Table — row interaction', () => {
	beforeEach(() => {
		setTableDesktopViewport();
	});

	it('calls onRowClick with the correct row data when a row button is clicked', async () => {
		const user = userEvent.setup();
		const onRowClick = vi.fn();
		render(
			<Table
				data={DATA}
				columns={COLUMNS}
				pageSize={10}
				onRowClick={onRowClick}
			/>
		);

		await user.click(screen.getByRole('button', { name: 'Open row: Alice' }));

		expect(onRowClick).toHaveBeenCalledWith(DATA[0], 0);
	});

	it('calls onRowClick when Enter is pressed on a focused row button', async () => {
		const user = userEvent.setup();
		const onRowClick = vi.fn();
		render(
			<Table
				data={DATA}
				columns={COLUMNS}
				pageSize={10}
				onRowClick={onRowClick}
			/>
		);

		screen.getByRole('button', { name: 'Open row: Alice' }).focus();
		await user.keyboard('{Enter}');

		expect(onRowClick).toHaveBeenCalledWith(DATA[0], 0);
	});

	it('calls onRowClick when Space is pressed on a focused row button', async () => {
		const user = userEvent.setup();
		const onRowClick = vi.fn();
		render(
			<Table
				data={DATA}
				columns={COLUMNS}
				pageSize={10}
				onRowClick={onRowClick}
			/>
		);

		screen.getByRole('button', { name: 'Open row: Alice' }).focus();
		await user.keyboard(' ');

		expect(onRowClick).toHaveBeenCalledWith(DATA[0], 0);
	});

	it('does not throw when clicked and onRowClick is not provided', async () => {
		const user = userEvent.setup();
		render(<Table data={DATA} columns={COLUMNS} pageSize={10} />);

		await expect(
			user.click(withinTable().getByText('Alice'))
		).resolves.not.toThrow();
	});
});

// ─── Row keys ─────────────────────────────────────────────────────────────────

describe('Table — row keys', () => {
	beforeEach(() => {
		setTableDesktopViewport();
	});

	it('uses rowKey to stabilise row identity across reordered data', () => {
		const onRowClick = vi.fn();
		const { rerender } = render(
			<Table
				data={DATA}
				columns={COLUMNS}
				pageSize={10}
				rowKey="id"
				onRowClick={onRowClick}
			/>
		);

		expect(
			screen.getByRole('button', { name: 'Open row: Alice' })
		).toBeInTheDocument();

		const reordered = [DATA[1], DATA[0], ...DATA.slice(2)];
		rerender(
			<Table
				data={reordered}
				columns={COLUMNS}
				pageSize={10}
				rowKey="id"
				onRowClick={onRowClick}
			/>
		);

		expect(
			screen.getByRole('button', { name: 'Open row: Alice' })
		).toBeInTheDocument();
	});
});

// ─── Accessibility ────────────────────────────────────────────────────────────

describe('Table — accessibility', () => {
	beforeEach(() => {
		setTableDesktopViewport();
	});

	it('sets aria-rowcount equal to total data rows plus the header row', () => {
		render(<Table data={DATA} columns={COLUMNS} pageSize={2} />);

		// 5 data rows + 1 header = 6
		expect(screen.getByRole('table')).toHaveAttribute('aria-rowcount', '6');
	});

	it('updates aria-rowcount to reflect filtered results', async () => {
		const user = userEvent.setup();
		render(
			<Table
				data={DATA}
				columns={COLUMNS}
				filters={[SELECT_FILTER]}
				pageSize={10}
			/>
		);

		await user.click(screen.getByRole('combobox', { name: 'Role' }));
		await user.click(screen.getByRole('option', { name: 'Admin' }));

		// 2 Admin rows + 1 header = 3
		expect(screen.getByRole('table')).toHaveAttribute('aria-rowcount', '3');
	});

	it('assigns aria-rowindex=1 to the header row', () => {
		render(<Table data={DATA} columns={COLUMNS} pageSize={10} />);

		const rows = screen.getAllByRole('row');
		expect(rows[0]).toHaveAttribute('aria-rowindex', '1');
	});

	it('assigns aria-rowindex starting at 2 for first-page data rows', () => {
		render(<Table data={DATA} columns={COLUMNS} pageSize={10} />);

		const rows = screen.getAllByRole('row');
		expect(rows[1]).toHaveAttribute('aria-rowindex', '2');
		expect(rows[2]).toHaveAttribute('aria-rowindex', '3');
	});

	it('offsets aria-rowindex on subsequent pages', async () => {
		const user = userEvent.setup();
		// 5 rows, 2 per page
		render(<Table data={DATA} columns={COLUMNS} pageSize={2} />);

		await user.click(screen.getByRole('button', { name: 'Next page' }));

		const rows = screen.getAllByRole('row');
		// offset=2, rowIndex=0 → aria-rowindex = 2 + 0 + 2 = 4
		expect(rows[1]).toHaveAttribute('aria-rowindex', '4');
		expect(rows[2]).toHaveAttribute('aria-rowindex', '5');
	});

	it('has a labelled navigation landmark for pagination', () => {
		render(<Table data={DATA} columns={COLUMNS} />);

		expect(
			screen.getByRole('navigation', { name: 'Pagination' })
		).toBeInTheDocument();
	});
});
