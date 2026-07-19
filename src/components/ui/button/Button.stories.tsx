import type { Meta, StoryObj } from '@storybook/react';
import { ArrowRight, Plus, Star, Trash2, X } from 'lucide-react';

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
		iconPosition: {
			control: 'inline-radio',
			options: ['left', 'right'],
		},
		disabled: { control: 'boolean' },
		isLoading: { control: 'boolean' },
		children: { control: 'text' },
		icon: { control: false },
	},
	args: {
		variant: 'primary',
		size: 'md',
		disabled: false,
	},
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
	args: { variant: 'primary', children: 'Button' },
};

export const Secondary: Story = {
	args: { variant: 'secondary', children: 'Button' },
};

export const Ghost: Story = {
	args: { variant: 'ghost', children: 'Button' },
};

export const Disabled: Story = {
	args: { disabled: true, children: 'Button' },
};

export const Loading: Story = {
	args: { isLoading: true, children: 'Saving...' },
};

export const WithIcon: Story = {
	args: { icon: Star, children: 'Favourite' },
};

export const WithIconRight: Story = {
	name: 'With Icon (right)',
	args: { icon: ArrowRight, iconPosition: 'right', children: 'Next' },
};

export const IconOnly: Story = {
	args: { icon: X, 'aria-label': 'Close', children: undefined },
};

export const AllVariants: Story = {
	name: 'All Variants',
	render: (args) => (
		<Stack direction="column" gap="lg">
			<Stack direction="row" gap="md" wrap align="center">
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

			<Stack direction="row" gap="md" align="center">
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

			<Stack direction="row" gap="md" align="center">
				<Button {...args} icon={Plus} size="sm">
					Add item
				</Button>
				<Button {...args} icon={Plus} size="md">
					Add item
				</Button>
				<Button {...args} icon={Plus} size="lg">
					Add item
				</Button>
			</Stack>

			<Stack direction="row" gap="md" align="center">
				<Button
					{...args}
					size="sm"
					variant="ghost"
					icon={Trash2}
					aria-label="Delete"
				/>
				<Button
					{...args}
					size="md"
					variant="ghost"
					icon={Trash2}
					aria-label="Delete"
				/>
				<Button
					{...args}
					size="lg"
					variant="ghost"
					icon={Trash2}
					aria-label="Delete"
				/>
			</Stack>
		</Stack>
	),
};
