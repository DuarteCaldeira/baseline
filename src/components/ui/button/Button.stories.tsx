import type { Meta, StoryObj } from '@storybook/react';
import { Plus, Star, Trash2, X } from 'lucide-react';

import { Stack } from '@/components/layout/stack';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
	title: 'UI/Button',
	component: Button,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['primary', 'secondary', 'ghost'],
		},
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg'],
		},
		disabled: { control: 'boolean' },
		isLoading: { control: 'boolean' },
		children: { control: 'text' },
		icon: { control: false },
	},
	args: {
		children: 'Button',
		variant: 'primary',
		size: 'md',
		disabled: false,
	},
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
	args: { variant: 'primary' },
};

export const Secondary: Story = {
	args: { variant: 'secondary' },
};

export const Ghost: Story = {
	args: { variant: 'ghost' },
};

export const Disabled: Story = {
	args: { disabled: true },
};

export const Loading: Story = {
	args: { isLoading: true, children: 'Saving…' },
};

export const LoadingWithIcon: Story = {
	args: { isLoading: true, icon: Plus, children: 'Adding item…' },
};

export const Small: Story = {
	args: { size: 'sm' },
};

export const Large: Story = {
	args: { size: 'lg' },
};

export const WithIcon: Story = {
	args: { icon: Star, children: 'Favourite' },
};

export const IconOnly: Story = {
	args: { icon: X, 'aria-label': 'Close', children: undefined },
};

export const AllVariants: Story = {
	name: 'All Variants',
	args: { children: 'Button' },
	render: (args) => (
		<Stack direction="row" gap="3" wrap align="center">
			<Button {...args} variant="primary">
				Primary
			</Button>
			<Button {...args} variant="secondary">
				Secondary
			</Button>
			<Button {...args} variant="ghost">
				Ghost
			</Button>
			<Button {...args} variant="primary" disabled>
				Disabled
			</Button>
			<Button {...args} variant="primary" isLoading>
				Loading
			</Button>
		</Stack>
	),
};

export const AllSizes: Story = {
	name: 'All Sizes',
	args: { children: 'Button' },
	render: (args) => (
		<Stack direction="row" gap="3" align="center">
			<Button {...args} size="sm">
				Small
			</Button>
			<Button {...args} size="md">
				Medium
			</Button>
			<Button {...args} size="lg">
				Large
			</Button>
		</Stack>
	),
};

export const AllSizesWithIcon: Story = {
	name: 'All Sizes — With Icon',
	args: { icon: Plus, children: 'Add item' },
	render: (args) => (
		<Stack direction="row" gap="3" align="center">
			<Button {...args} size="sm" />
			<Button {...args} size="md" />
			<Button {...args} size="lg" />
		</Stack>
	),
};

export const AllSizesIconOnly: Story = {
	name: 'All Sizes — Icon Only',
	args: {
		icon: Trash2,
		'aria-label': 'Delete',
		variant: 'ghost',
		children: undefined,
	},
	render: (args) => (
		<Stack direction="row" gap="3" align="center">
			<Button {...args} size="sm" />
			<Button {...args} size="md" />
			<Button {...args} size="lg" />
		</Stack>
	),
};
