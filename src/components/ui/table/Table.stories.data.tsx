import { Badge } from '@/components/ui/badge';

import type { TableColumn, TableFilter } from './Table.types';

export type StoryUser = {
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
} as const satisfies Record<StoryUser['status'], string>;

const ROLE_VARIANT = {
	Admin: 'error',
	Editor: 'info',
	Viewer: 'neutral',
} as const satisfies Record<StoryUser['role'], string>;

export const STORY_USERS: StoryUser[] = [
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

export const PLAIN_COLUMNS: TableColumn<StoryUser>[] = [
	{ key: 'name', header: 'Name' },
	{ key: 'email', header: 'Email' },
	{ key: 'role', header: 'Role' },
	{ key: 'status', header: 'Status' },
	{ key: 'department', header: 'Department' },
	{ key: 'joined', header: 'Joined' },
];

export const RICH_COLUMNS: TableColumn<StoryUser>[] = [
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

export const SORTABLE_COLUMNS: TableColumn<StoryUser>[] = [
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

export const STORY_FILTERS: TableFilter[] = [
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

const DEPARTMENTS: StoryUser['department'][] = [
	'Engineering',
	'Design',
	'Marketing',
	'Sales',
	'Legal',
	'Finance',
];
const ROLES: StoryUser['role'][] = ['Admin', 'Editor', 'Viewer'];
const STATUSES: StoryUser['status'][] = ['Active', 'Inactive', 'Pending'];

export const LARGE_STORY_DATA: StoryUser[] = Array.from(
	{ length: 5_000 },
	(_, i) => {
		const role = ROLES[i % ROLES.length] as StoryUser['role'];
		const status = STATUSES[i % STATUSES.length] as StoryUser['status'];
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
	}
);

export const FEW_COLUMNS: TableColumn<StoryUser>[] = [
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
];

export const FEW_COLUMN_FILTERS: TableFilter[] = [
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
];
