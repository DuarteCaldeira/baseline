import type { Meta, StoryObj } from '@storybook/react';

import { Stack } from '@/components/layout/stack';
import { Text } from '@/components/ui/typography';

import { Progress } from './Progress';

const meta: Meta<typeof Progress> = {
	title: 'UI/Progress',
	component: Progress,
	tags: ['autodocs'],
	argTypes: {
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg'],
		},
		variant: {
			control: 'select',
			options: ['default', 'primary', 'success', 'warning', 'error', 'info'],
		},
	},
	args: {
		value: 48,
		max: 100,
		size: 'md',
		variant: 'primary',
		label: 'Upload progress',
	},
};

export default meta;

type Story = StoryObj<typeof Progress>;

export const Default: Story = {};

export const AllVariants: Story = {
	render: () => (
		<Stack gap="lg">
			<Stack gap="sm">
				<Text variant="body-sm" tone="muted">
					Primary
				</Text>
				<Progress value={48} variant="primary" label="Primary progress" />
			</Stack>
			<Stack gap="sm">
				<Text variant="body-sm" tone="muted">
					Success
				</Text>
				<Progress value={72} variant="success" label="Success progress" />
			</Stack>
			<Stack gap="sm">
				<Text variant="body-sm" tone="muted">
					Warning
				</Text>
				<Progress value={60} variant="warning" label="Warning progress" />
			</Stack>
			<Stack gap="sm">
				<Text variant="body-sm" tone="muted">
					Error
				</Text>
				<Progress value={24} variant="error" label="Error progress" />
			</Stack>
			<Stack gap="sm">
				<Text variant="body-sm" tone="muted">
					Info
				</Text>
				<Progress value={84} variant="info" label="Info progress" />
			</Stack>
		</Stack>
	),
};

export const AllSizes: Story = {
	render: () => (
		<Stack gap="lg">
			<Progress size="sm" value={40} label="Small progress" />
			<Progress size="md" value={56} label="Medium progress" />
			<Progress size="lg" value={72} label="Large progress" />
		</Stack>
	),
};

export const Indeterminate: Story = {
	args: {
		indeterminate: true,
		value: undefined,
		label: 'Loading content',
	},
};
