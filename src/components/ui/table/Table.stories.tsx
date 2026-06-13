import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import styles from '@/storybook/storyHelpers.module.scss';

import { Table } from './Table';
import type { TableProps } from './Table.types';
import {
	FEW_COLUMN_FILTERS,
	FEW_COLUMNS,
	LARGE_STORY_DATA,
	PLAIN_COLUMNS,
	RICH_COLUMNS,
	SORTABLE_COLUMNS,
	STORY_FILTERS,
	STORY_USERS,
	type StoryUser,
} from './Table.stories.data';

const meta = {
	title: 'UI/Table',
	component: Table,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Data table with filtering, sorting, pagination, and a responsive card layout on small screens. ' +
					'Rows are memoised — keep the `columns` array and each `render` callback stable with `useMemo` ' +
					'so row cells do not re-render on unrelated parent updates. Use `rowKey` when row order can change.',
			},
		},
	},
	argTypes: {
		data: { control: false },
		columns: { control: false },
		filters: { control: false },
		pageSizeOptions: { control: false },
		onRowClick: { control: false },
	},
} satisfies Meta;

export default meta;

type Story = StoryObj<TableProps<Record<string, unknown>>>;

export const Default: Story = {
	render: () => (
		<Table<StoryUser>
			data={STORY_USERS.slice(0, 8)}
			columns={PLAIN_COLUMNS}
			pageSize={5}
		/>
	),
};

export const WithFilters: Story = {
	name: 'With Filters',
	render: () => (
		<Table<StoryUser>
			data={STORY_USERS}
			columns={PLAIN_COLUMNS}
			filters={STORY_FILTERS}
			pageSize={5}
		/>
	),
};

export const WithCustomCells: Story = {
	name: 'With Custom Cells',
	render: () => (
		<Table<StoryUser>
			data={STORY_USERS}
			columns={RICH_COLUMNS}
			filters={STORY_FILTERS}
			pageSize={5}
		/>
	),
};

export const Paginated: Story = {
	render: () => (
		<Table<StoryUser>
			data={STORY_USERS}
			columns={PLAIN_COLUMNS}
			pageSize={5}
			pageSizeOptions={[5, 10, 20]}
		/>
	),
};

export const Sortable: Story = {
	name: 'Sortable Headers',
	render: () => (
		<Table<StoryUser> data={STORY_USERS} columns={SORTABLE_COLUMNS} pageSize={8} />
	),
};

export const Mobile: Story = {
	name: 'Mobile Layout',
	parameters: {
		viewport: { defaultViewport: 'mobile1' },
	},
	render: () => (
		<div style={{ padding: '1rem' }}>
			<Table<StoryUser>
				data={STORY_USERS.slice(0, 6)}
				columns={SORTABLE_COLUMNS}
				filters={STORY_FILTERS}
				pageSize={4}
			/>
		</div>
	),
};

export const Loading: Story = {
	render: () => <Table<StoryUser> data={[]} columns={PLAIN_COLUMNS} loading />,
};

export const Empty: Story = {
	render: () => (
		<Table<StoryUser>
			data={[]}
			columns={PLAIN_COLUMNS}
			emptyMessage="No users found."
		/>
	),
};

export const EmptyWithFilters: Story = {
	name: 'Empty — Filters Active',
	render: () => (
		<Table<StoryUser>
			data={[]}
			columns={PLAIN_COLUMNS}
			filters={STORY_FILTERS}
			emptyMessage="No users match the current filters."
		/>
	),
};

export const FewColumns: Story = {
	name: 'Few Columns',
	render: () => (
		<Table<StoryUser>
			data={STORY_USERS}
			columns={FEW_COLUMNS}
			filters={FEW_COLUMN_FILTERS}
			pageSize={8}
		/>
	),
};

export const LargeDataset: Story = {
	name: 'Large Dataset (5 000 rows)',
	render: () => (
		<Table<StoryUser>
			data={LARGE_STORY_DATA}
			columns={RICH_COLUMNS}
			filters={STORY_FILTERS}
			pageSize={25}
			pageSizeOptions={[10, 25, 50, 100]}
		/>
	),
};

const ClickableRowsDemo = () => {
	const [selected, setSelected] = useState<StoryUser | null>(null);

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			<Table<StoryUser>
				data={STORY_USERS.slice(0, 8)}
				columns={RICH_COLUMNS}
				pageSize={5}
				onRowClick={(row) => setSelected(row)}
			/>

			{selected && (
				<div className={styles.item}>
					<strong>Selected:</strong> {selected.name} — {selected.email}
				</div>
			)}
		</div>
	);
};

export const ClickableRows: Story = {
	name: 'Clickable Rows',
	render: () => <ClickableRowsDemo />,
};
