import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from '@/components/ui/badge';
import styles from '@/storybook/storyHelpers.module.scss';

import { Table } from './Table';
import type { TableColumn, TableFilter, TableProps } from './Table.types';

// ─── Shared types and dataset ─────────────────────────────────────────────────

type User = {
	id: string;
	name: string;
	email: string;
	role: 'Admin' | 'Editor' | 'Viewer';
	status: 'Active' | 'Inactive' | 'Pending';
	department: string;
	joined: string;
};

const STATUS_VARIANT = {
	Active: 'success',
	Inactive: 'neutral',
	Pending: 'warning',
} as const satisfies Record<User['status'], string>;

const ROLE_VARIANT = {
	Admin: 'error',
	Editor: 'info',
	Viewer: 'neutral',
} as const satisfies Record<User['role'], string>;

const USERS: User[] = [
	{
		id: '1',
		name: 'Alice Martin',
		email: 'alice@example.com',
		role: 'Admin',
		status: 'Active',
		department: 'Engineering',
		joined: 'Jan 2023',
	},
	{
		id: '2',
		name: 'Bob Chen',
		email: 'bob@example.com',
		role: 'Editor',
		status: 'Active',
		department: 'Design',
		joined: 'Mar 2023',
	},
	{
		id: '3',
		name: 'Clara Nunes',
		email: 'clara@example.com',
		role: 'Viewer',
		status: 'Pending',
		department: 'Marketing',
		joined: 'May 2023',
	},
	{
		id: '4',
		name: 'David Park',
		email: 'david@example.com',
		role: 'Editor',
		status: 'Inactive',
		department: 'Engineering',
		joined: 'Jun 2023',
	},
	{
		id: '5',
		name: 'Eva Santos',
		email: 'eva@example.com',
		role: 'Admin',
		status: 'Active',
		department: 'Design',
		joined: 'Aug 2023',
	},
	{
		id: '6',
		name: 'Frank Müller',
		email: 'frank@example.com',
		role: 'Viewer',
		status: 'Active',
		department: 'Sales',
		joined: 'Sep 2023',
	},
	{
		id: '7',
		name: 'Grace Okafor',
		email: 'grace@example.com',
		role: 'Editor',
		status: 'Active',
		department: 'Marketing',
		joined: 'Oct 2023',
	},
	{
		id: '8',
		name: 'Henry Dubois',
		email: 'henry@example.com',
		role: 'Viewer',
		status: 'Inactive',
		department: 'Sales',
		joined: 'Nov 2023',
	},
	{
		id: '9',
		name: 'Iris Tanaka',
		email: 'iris@example.com',
		role: 'Admin',
		status: 'Active',
		department: 'Engineering',
		joined: 'Dec 2023',
	},
	{
		id: '10',
		name: 'James Ferreira',
		email: 'james@example.com',
		role: 'Editor',
		status: 'Pending',
		department: 'Design',
		joined: 'Jan 2024',
	},
	{
		id: '11',
		name: 'Kira Andersen',
		email: 'kira@example.com',
		role: 'Viewer',
		status: 'Active',
		department: 'Engineering',
		joined: 'Feb 2024',
	},
	{
		id: '12',
		name: 'Luca Romano',
		email: 'luca@example.com',
		role: 'Editor',
		status: 'Active',
		department: 'Marketing',
		joined: 'Mar 2024',
	},
	{
		id: '13',
		name: 'Maya Patel',
		email: 'maya@example.com',
		role: 'Admin',
		status: 'Active',
		department: 'Sales',
		joined: 'Apr 2024',
	},
	{
		id: '14',
		name: 'Noah Kim',
		email: 'noah@example.com',
		role: 'Viewer',
		status: 'Inactive',
		department: 'Design',
		joined: 'May 2024',
	},
	{
		id: '15',
		name: 'Olivia Cruz',
		email: 'olivia@example.com',
		role: 'Editor',
		status: 'Active',
		department: 'Engineering',
		joined: 'Jun 2024',
	},
	{
		id: '16',
		name: 'Pedro Alves',
		email: 'pedro@example.com',
		role: 'Viewer',
		status: 'Pending',
		department: 'Marketing',
		joined: 'Jul 2024',
	},
	{
		id: '17',
		name: 'Quinn Brooks',
		email: 'quinn@example.com',
		role: 'Editor',
		status: 'Active',
		department: 'Sales',
		joined: 'Aug 2024',
	},
	{
		id: '18',
		name: 'Rosa Lindqvist',
		email: 'rosa@example.com',
		role: 'Admin',
		status: 'Active',
		department: 'Engineering',
		joined: 'Sep 2024',
	},
	{
		id: '19',
		name: 'Sam Osei',
		email: 'sam@example.com',
		role: 'Viewer',
		status: 'Inactive',
		department: 'Design',
		joined: 'Oct 2024',
	},
	{
		id: '20',
		name: 'Tina Bergmann',
		email: 'tina@example.com',
		role: 'Editor',
		status: 'Active',
		department: 'Marketing',
		joined: 'Nov 2024',
	},
];

// ─── Shared column definitions ────────────────────────────────────────────────

const PLAIN_COLUMNS: TableColumn<User>[] = [
	{ key: 'name', header: 'Name' },
	{ key: 'email', header: 'Email' },
	{ key: 'role', header: 'Role' },
	{ key: 'status', header: 'Status' },
	{ key: 'department', header: 'Department' },
	{ key: 'joined', header: 'Joined' },
];

const RICH_COLUMNS: TableColumn<User>[] = [
	{
		key: 'name',
		header: 'Name',
		mobilePrimary: true,
		render: (row) => <strong>{row.name}</strong>,
	},
	{
		key: 'email',
		header: 'Email',
		render: (row) => (
			<span style={{ color: 'var(--color-text-muted)' }}>{row.email}</span>
		),
	},
	{
		key: 'role',
		header: 'Role',
		render: (row) => <Badge variant={ROLE_VARIANT[row.role]} text={row.role} />,
	},
	{
		key: 'status',
		header: 'Status',
		render: (row) => (
			<Badge variant={STATUS_VARIANT[row.status]} text={row.status} />
		),
	},
	{ key: 'department', header: 'Department' },
	{
		key: 'joined',
		header: 'Joined',
		render: (row) => (
			<span style={{ color: 'var(--color-text-muted)' }}>{row.joined}</span>
		),
	},
];

const SORTABLE_COLUMNS: TableColumn<User>[] = [
	{
		key: 'name',
		header: 'Name',
		sortable: true,
		mobilePrimary: true,
		render: (row) => <strong>{row.name}</strong>,
	},
	{
		key: 'email',
		header: 'Email',
		render: (row) => (
			<span style={{ color: 'var(--color-text-muted)' }}>{row.email}</span>
		),
	},
	{
		key: 'role',
		header: 'Role',
		sortable: true,
		render: (row) => <Badge variant={ROLE_VARIANT[row.role]} text={row.role} />,
	},
	{
		key: 'status',
		header: 'Status',
		sortable: true,
		render: (row) => (
			<Badge variant={STATUS_VARIANT[row.status]} text={row.status} />
		),
	},
	{ key: 'department', header: 'Department', sortable: true },
	{
		key: 'joined',
		header: 'Joined',
		render: (row) => (
			<span style={{ color: 'var(--color-text-muted)' }}>{row.joined}</span>
		),
	},
];

const FILTERS: TableFilter[] = [
	{
		key: 'name',
		label: 'Search',
		type: 'search',
		placeholder: 'Search by name or email…',
	},
	{
		key: 'role',
		label: 'Role',
		type: 'select',
		options: [
			{ value: 'Admin', label: 'Admin' },
			{ value: 'Editor', label: 'Editor' },
			{ value: 'Viewer', label: 'Viewer' },
		],
	},
	{
		key: 'status',
		label: 'Status',
		type: 'select',
		options: [
			{ value: 'Active', label: 'Active' },
			{ value: 'Inactive', label: 'Inactive' },
			{ value: 'Pending', label: 'Pending' },
		],
	},
];

// ─── Meta ─────────────────────────────────────────────────────────────────────

// Table is generic — keep Meta untyped so render-only stories aren't forced
// to supply required args (data, columns) on every story export.
const meta = {
	title: 'UI/Table',
	component: Table,
	tags: ['autodocs'],
	argTypes: {
		data: { control: false },
		columns: { control: false },
		filters: { control: false },
		pageSizeOptions: { control: false },
		onRowClick: { control: false },
	},
} satisfies Meta;

export default meta;

// typeof meta infers required args from component: Table — use the props type
// directly so render-only stories don't need a dummy args block.
type Story = StoryObj<TableProps<Record<string, unknown>>>;

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
	render: () => (
		<Table<User>
			data={USERS.slice(0, 8)}
			columns={PLAIN_COLUMNS}
			pageSize={5}
		/>
	),
};

export const WithFilters: Story = {
	name: 'With Filters',
	render: () => (
		<Table<User>
			data={USERS}
			columns={PLAIN_COLUMNS}
			filters={FILTERS}
			pageSize={5}
		/>
	),
};

export const WithCustomCells: Story = {
	name: 'With Custom Cells',
	render: () => (
		<Table<User>
			data={USERS}
			columns={RICH_COLUMNS}
			filters={FILTERS}
			pageSize={5}
		/>
	),
};

export const Paginated: Story = {
	render: () => (
		<Table<User>
			data={USERS}
			columns={PLAIN_COLUMNS}
			pageSize={5}
			pageSizeOptions={[5, 10, 20]}
		/>
	),
};

export const Sortable: Story = {
	name: 'Sortable Headers',
	render: () => (
		<Table<User> data={USERS} columns={SORTABLE_COLUMNS} pageSize={8} />
	),
};

export const Mobile: Story = {
	name: 'Mobile Layout',
	parameters: {
		viewport: { defaultViewport: 'mobile1' },
	},
	render: () => (
		<div style={{ padding: '1rem' }}>
			<Table<User>
				data={USERS.slice(0, 6)}
				columns={SORTABLE_COLUMNS}
				filters={FILTERS}
				pageSize={4}
			/>
		</div>
	),
};

export const Loading: Story = {
	render: () => <Table<User> data={[]} columns={PLAIN_COLUMNS} loading />,
};

export const Empty: Story = {
	render: () => (
		<Table<User>
			data={[]}
			columns={PLAIN_COLUMNS}
			emptyMessage="No users found."
		/>
	),
};

export const EmptyWithFilters: Story = {
	name: 'Empty — Filters Active',
	render: () => (
		<Table<User>
			data={[]}
			columns={PLAIN_COLUMNS}
			filters={FILTERS}
			emptyMessage="No users match the current filters."
		/>
	),
};

export const FewColumns: Story = {
	name: 'Few Columns',
	render: () => (
		<Table<User>
			data={USERS}
			columns={[
				{ key: 'name', header: 'Name' },
				{
					key: 'role',
					header: 'Role',
					render: (row) => (
						<Badge variant={ROLE_VARIANT[row.role]} text={row.role} />
					),
				},
				{
					key: 'status',
					header: 'Status',
					render: (row) => (
						<Badge variant={STATUS_VARIANT[row.status]} text={row.status} />
					),
				},
			]}
			filters={[
				{ key: 'name', label: 'Search', type: 'search' },
				{
					key: 'status',
					label: 'Status',
					type: 'select',
					options: [
						{ value: 'Active', label: 'Active' },
						{ value: 'Inactive', label: 'Inactive' },
						{ value: 'Pending', label: 'Pending' },
					],
				},
			]}
			pageSize={8}
		/>
	),
};

// ─── Large dataset (demonstrates debounce + sort + pagination performance) ────

const DEPARTMENTS: User['department'][] = [
	'Engineering',
	'Design',
	'Marketing',
	'Sales',
	'Legal',
	'Finance',
];
const ROLES: User['role'][] = ['Admin', 'Editor', 'Viewer'];
const STATUSES: User['status'][] = ['Active', 'Inactive', 'Pending'];

const LARGE_DATA: User[] = Array.from({ length: 5_000 }, (_, i) => {
	const role = ROLES[i % ROLES.length] as User['role'];
	const status = STATUSES[i % STATUSES.length] as User['status'];
	const department = DEPARTMENTS[i % DEPARTMENTS.length] as string;

	return {
		id: String(i + 1),
		name: `User ${i + 1}`,
		email: `user${i + 1}@example.com`,
		role,
		status,
		department,
		joined: 'Jan 2024',
	};
});

export const LargeDataset: Story = {
	name: 'Large Dataset (5 000 rows)',
	render: () => (
		<Table<User>
			data={LARGE_DATA}
			columns={RICH_COLUMNS}
			filters={FILTERS}
			pageSize={25}
			pageSizeOptions={[10, 25, 50, 100]}
		/>
	),
};

// ─── Interactive stories ──────────────────────────────────────────────────────

const ClickableRowsDemo = () => {
	const [selected, setSelected] = useState<User | null>(null);

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			<Table<User>
				data={USERS.slice(0, 8)}
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
