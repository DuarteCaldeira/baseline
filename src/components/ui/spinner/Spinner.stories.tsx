import type { Meta, StoryObj } from '@storybook/react';

import { Stack } from '@/components/layout/stack';
import { Button } from '@/components/ui/button';

import { Spinner } from './Spinner';

const meta: Meta<typeof Spinner> = {
	title: 'UI/Spinner',
	component: Spinner,
	tags: ['autodocs'],
	argTypes: {
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg', 'xl'],
		},
		variant: {
			control: 'select',
			options: [
				'default',
				'muted',
				'subtle',
				'primary',
				'inverse',
				'success',
				'warning',
				'error',
				'info',
			],
		},
		label: { control: 'text' },
	},
	args: {
		size: 'md',
		variant: 'primary',
	},
};

export default meta;

type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};

export const WithLabel: Story = {
	args: { label: 'Loading content' },
};

export const Sizes: Story = {
	render: () => (
		<Stack direction="row" align="center" gap="4">
			<Spinner size="sm" variant="primary" />
			<Spinner size="md" variant="primary" />
			<Spinner size="lg" variant="primary" />
			<Spinner size="xl" variant="primary" />
		</Stack>
	),
};

export const Variants: Story = {
	render: () => (
		<Stack direction="row" align="center" gap="4" wrap>
			<Spinner variant="primary" />
			<Spinner variant="muted" />
			<Spinner variant="success" />
			<Spinner variant="warning" />
			<Spinner variant="error" />
			<Spinner variant="info" />
		</Stack>
	),
};

export const InlineWithText: Story = {
	name: 'Inline with text',
	render: () => (
		<Stack direction="row" align="center" gap="2">
			<Spinner size="sm" variant="muted" />
			<span
				style={{ font: 'var(--font-sm)', color: 'var(--color-text-muted)' }}
			>
				Loading results…
			</span>
		</Stack>
	),
};

export const InButton: Story = {
	name: 'In button',
	render: () => (
		<Stack direction="row" align="center" gap="3" wrap>
			<Button variant="primary" loading>
				Saving…
			</Button>
			<Button variant="secondary" size="sm" loading>
				Loading
			</Button>
			<Button variant="ghost" size="lg" loading>
				Please wait
			</Button>
		</Stack>
	),
};
