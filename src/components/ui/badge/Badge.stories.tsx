import type { Meta, StoryObj } from '@storybook/react';
import {
	AlertCircle,
	AlertTriangle,
	CheckCircle,
	Info,
	Tag,
} from 'lucide-react';

import { Stack } from '@/components/layout/stack';

import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
	title: 'UI/Badge',
	component: Badge,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['success', 'error', 'warning', 'info', 'neutral'],
		},
		type: {
			control: 'select',
			options: ['filled', 'outlined'],
		},
		text: { control: 'text' },
		icon: { control: false },
	},
	args: {
		variant: 'success',
		type: 'filled',
		text: 'Approved',
	},
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Filled: Story = {};

export const Outlined: Story = {
	args: { type: 'outlined' },
};

export const WithIcon: Story = {
	args: { icon: CheckCircle },
};

export const IconOnly: Story = {
	args: { icon: CheckCircle, text: undefined, 'aria-label': 'Approved' },
};

export const AllVariants: Story = {
	render: () => (
		<Stack direction="column" gap="md">
			<Stack direction="row" gap="sm" wrap align="center">
				<Badge variant="success" text="Approved" />
				<Badge variant="error" text="Failed" />
				<Badge variant="warning" text="Pending" />
				<Badge variant="info" text="In review" />
				<Badge variant="neutral" text="Draft" />
			</Stack>

			<Stack direction="row" gap="sm" wrap align="center">
				<Badge variant="success" icon={CheckCircle} text="Approved" />
				<Badge variant="error" icon={AlertCircle} text="Failed" />
				<Badge variant="warning" icon={AlertTriangle} text="Pending" />
				<Badge variant="info" icon={Info} text="In review" />
				<Badge variant="neutral" icon={Tag} text="Draft" />
			</Stack>

			<Stack direction="row" gap="sm" wrap align="center">
				<Badge variant="success" type="outlined" text="Approved" />
				<Badge variant="error" type="outlined" text="Failed" />
				<Badge variant="warning" type="outlined" text="Pending" />
				<Badge variant="info" type="outlined" text="In review" />
				<Badge variant="neutral" type="outlined" text="Draft" />
			</Stack>

			<Stack direction="row" gap="sm" wrap align="center">
				<Badge
					variant="success"
					type="outlined"
					icon={CheckCircle}
					text="Approved"
				/>
				<Badge
					variant="error"
					type="outlined"
					icon={AlertCircle}
					text="Failed"
				/>
				<Badge
					variant="warning"
					type="outlined"
					icon={AlertTriangle}
					text="Pending"
				/>
				<Badge variant="info" type="outlined" icon={Info} text="In review" />
				<Badge variant="neutral" type="outlined" icon={Tag} text="Draft" />
			</Stack>
		</Stack>
	),
};
