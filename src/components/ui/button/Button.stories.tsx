import type { Meta, StoryObj } from '@storybook/react';
import { Plus, Star, Trash2, X } from 'lucide-react';

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
	render: () => (
		<div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
			<Button variant="primary">Primary</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="primary" disabled>Disabled</Button>
		</div>
	),
};

export const AllSizes: Story = {
	render: () => (
		<div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
			<Button size="sm">Small</Button>
			<Button size="md">Medium</Button>
			<Button size="lg">Large</Button>
		</div>
	),
};

export const AllSizesWithIcon: Story = {
	render: () => (
		<div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
			<Button size="sm" icon={Plus}>Add item</Button>
			<Button size="md" icon={Plus}>Add item</Button>
			<Button size="lg" icon={Plus}>Add item</Button>
		</div>
	),
};

export const AllSizesIconOnly: Story = {
	render: () => (
		<div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
			<Button size="sm" icon={Trash2} aria-label="Delete" variant="ghost" />
			<Button size="md" icon={Trash2} aria-label="Delete" variant="ghost" />
			<Button size="lg" icon={Trash2} aria-label="Delete" variant="ghost" />
		</div>
	),
};
