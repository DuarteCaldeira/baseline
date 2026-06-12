import type { Meta, StoryObj } from '@storybook/react';
import {
	AlertCircle,
	AlertTriangle,
	CheckCircle,
	Info,
	Star,
	X,
} from 'lucide-react';

import { Stack } from '@/components/layout/stack';

import { Icon } from './Icon';

const meta: Meta<typeof Icon> = {
	title: 'UI/Icon',
	component: Icon,
	tags: ['autodocs'],
	argTypes: {
		icon: { control: false },
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg'],
		},
		variant: {
			control: 'select',
			options: [
				'default',
				'muted',
				'subtle',
				'primary',
				'success',
				'warning',
				'error',
				'info',
			],
		},
		label: { control: 'text' },
		strokeWidth: { control: 'number' },
	},
	args: {
		icon: Star,
		size: 'md',
		variant: 'default',
	},
};

export default meta;

type Story = StoryObj<typeof Icon>;

export const Default: Story = {};

export const WithLabel: Story = {
	args: { label: 'Favourite' },
};

export const Sizes: Story = {
	render: () => (
		<Stack direction="row" gap="4" align="center">
			<Icon icon={Star} size="sm" label="Small" />
			<Icon icon={Star} size="md" label="Medium" />
			<Icon icon={Star} size="lg" label="Large" />
		</Stack>
	),
};

export const Variants: Story = {
	render: () => (
		<Stack direction="row" gap="4" wrap align="center">
			<Icon icon={Star} variant="default" label="Default" />
			<Icon icon={Star} variant="muted" label="Muted" />
			<Icon icon={Star} variant="subtle" label="Subtle" />
			<Icon icon={Star} variant="primary" label="Primary" />
			<Icon icon={CheckCircle} variant="success" label="Success" />
			<Icon icon={AlertTriangle} variant="warning" label="Warning" />
			<Icon icon={AlertCircle} variant="error" label="Error" />
			<Icon icon={Info} variant="info" label="Info" />
		</Stack>
	),
};

export const SemanticUsage: Story = {
	render: () => (
		<Stack direction="column" gap="3">
			<Stack direction="row" gap="2" align="center">
				<Icon icon={CheckCircle} variant="success" label="Success" />
				<span>Changes saved successfully.</span>
			</Stack>
			<Stack direction="row" gap="2" align="center">
				<Icon icon={AlertTriangle} variant="warning" label="Warning" />
				<span>This action cannot be undone.</span>
			</Stack>
			<Stack direction="row" gap="2" align="center">
				<Icon icon={AlertCircle} variant="error" label="Error" />
				<span>Something went wrong.</span>
			</Stack>
			<Stack direction="row" gap="2" align="center">
				<Icon icon={Info} variant="info" label="Info" />
				<span>Your session expires in 5 minutes.</span>
			</Stack>
			<Stack direction="row" gap="2" align="center">
				<Icon icon={X} variant="muted" />
				<span>Decorative icon (no label, aria-hidden).</span>
			</Stack>
		</Stack>
	),
};
