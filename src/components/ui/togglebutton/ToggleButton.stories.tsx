import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import {
	AlignCenter,
	AlignLeft,
	AlignRight,
	Bold,
	Italic,
	Underline,
} from 'lucide-react';

import { withSurfaceInline } from '@/storybook/decorators';

import { ToggleButton } from './ToggleButton';
import { ToggleButtonGroup } from './ToggleButtonGroup';

const meta: Meta<typeof ToggleButton> = {
	title: 'UI/ToggleButton',
	component: ToggleButton,
	tags: ['autodocs'],
	decorators: [withSurfaceInline],
	argTypes: {
		variant: {
			control: 'select',
			options: ['secondary', 'ghost'],
		},
		pressed: { control: 'boolean' },
		disabled: { control: 'boolean' },
	},
	args: {
		children: 'Toggle',
		variant: 'secondary',
		pressed: false,
		disabled: false,
	},
};

export default meta;

type Story = StoryObj<typeof ToggleButton>;

export const Default: Story = {};

export const Pressed: Story = {
	args: { pressed: true },
};

export const Ghost: Story = {
	args: { variant: 'ghost', pressed: true },
};

export const IconOnly: Story = {
	args: {
		children: undefined,
		icon: Bold,
		'aria-label': 'Bold',
		pressed: true,
		variant: 'ghost',
	},
};

export const SingleGroup: Story = {
	render: () => {
		const [value, setValue] = useState('left');

		return (
			<ToggleButtonGroup
				aria-label="Text alignment"
				value={value}
				onChange={(next) => setValue(next as string)}
			>
				<ToggleButton value="left" icon={AlignLeft} aria-label="Align left" />
				<ToggleButton
					value="center"
					icon={AlignCenter}
					aria-label="Align center"
				/>
				<ToggleButton
					value="right"
					icon={AlignRight}
					aria-label="Align right"
				/>
			</ToggleButtonGroup>
		);
	},
};

export const MultipleGroup: Story = {
	render: () => {
		const [value, setValue] = useState<string[]>(['bold']);

		return (
			<ToggleButtonGroup
				aria-label="Text formatting"
				type="multiple"
				value={value}
				onChange={(next) => setValue(next as string[])}
			>
				<ToggleButton value="bold" icon={Bold} aria-label="Bold" />
				<ToggleButton value="italic" icon={Italic} aria-label="Italic" />
				<ToggleButton
					value="underline"
					icon={Underline}
					aria-label="Underline"
				/>
			</ToggleButtonGroup>
		);
	},
};

export const FullWidthGroup: Story = {
	render: () => (
		<div style={{ width: '24rem' }}>
			<ToggleButtonGroup aria-label="Period" fullWidth defaultValue="week">
				<ToggleButton value="day">Day</ToggleButton>
				<ToggleButton value="week">Week</ToggleButton>
				<ToggleButton value="month">Month</ToggleButton>
			</ToggleButtonGroup>
		</div>
	),
};

export const VerticalGroup: Story = {
	render: () => (
		<ToggleButtonGroup
			aria-label="View mode"
			orientation="vertical"
			defaultValue="list"
		>
			<ToggleButton value="list">List</ToggleButton>
			<ToggleButton value="grid">Grid</ToggleButton>
			<ToggleButton value="board">Board</ToggleButton>
		</ToggleButtonGroup>
	),
};

export const TextGroup: Story = {
	render: () => (
		<ToggleButtonGroup aria-label="Formatting" type="multiple">
			<ToggleButton value="bold">Bold</ToggleButton>
			<ToggleButton value="italic">Italic</ToggleButton>
			<ToggleButton value="underline">Underline</ToggleButton>
		</ToggleButtonGroup>
	),
};
