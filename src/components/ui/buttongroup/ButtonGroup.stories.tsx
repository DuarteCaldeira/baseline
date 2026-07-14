import type { Meta, StoryObj } from '@storybook/react';
import {
	AlignCenter,
	AlignLeft,
	AlignRight,
	Bold,
	ChevronDown,
	Italic,
	Underline,
} from 'lucide-react';

import { Stack } from '@/components/layout/stack';
import { Button } from '@/components/ui/button';
import {
	Menu,
	MenuContent,
	MenuItem,
	MenuTrigger,
} from '@/components/ui/menu';
import { withSurfaceInline } from '@/storybook/decorators';

import { ButtonGroup } from './ButtonGroup';

const meta: Meta<typeof ButtonGroup> = {
	title: 'UI/ButtonGroup',
	component: ButtonGroup,
	tags: ['autodocs'],
	decorators: [withSurfaceInline],
	argTypes: {
		orientation: {
			control: 'select',
			options: ['horizontal', 'vertical'],
		},
		fullWidth: { control: 'boolean' },
	},
	args: {
		'aria-label': 'Button group',
		orientation: 'horizontal',
		fullWidth: false,
	},
};

export default meta;

type Story = StoryObj<typeof ButtonGroup>;

export const Default: Story = {
	render: (args) => (
		<ButtonGroup {...args} aria-label="Text alignment">
			<Button variant="secondary">Left</Button>
			<Button variant="secondary">Center</Button>
			<Button variant="secondary">Right</Button>
		</ButtonGroup>
	),
};

export const Secondary: Story = {
	render: (args) => (
		<ButtonGroup {...args} aria-label="Editor actions">
			<Button variant="secondary">Cut</Button>
			<Button variant="secondary">Copy</Button>
			<Button variant="secondary">Paste</Button>
		</ButtonGroup>
	),
};

export const Primary: Story = {
	render: (args) => (
		<ButtonGroup {...args} aria-label="Save options">
			<Button variant="primary">Save</Button>
			<Button variant="primary">Save &amp; close</Button>
		</ButtonGroup>
	),
};

export const SplitPrimaryWithMenu: Story = {
	name: 'Split primary with menu',
	render: (args) => (
		<ButtonGroup {...args} aria-label="Publish options">
			<Button variant="primary">Publish</Button>
			<Menu>
				<MenuTrigger>
					<Button
						variant="primary"
						icon={ChevronDown}
						aria-label="More options"
					/>
				</MenuTrigger>
				<MenuContent align="end">
					<MenuItem>Publish draft</MenuItem>
					<MenuItem>Schedule publish</MenuItem>
					<MenuItem>Save as template</MenuItem>
				</MenuContent>
			</Menu>
		</ButtonGroup>
	),
};

export const Ghost: Story = {
	render: (args) => (
		<ButtonGroup {...args} aria-label="Formatting">
			<Button variant="ghost" icon={Bold} aria-label="Bold" />
			<Button variant="ghost" icon={Italic} aria-label="Italic" />
			<Button variant="ghost" icon={Underline} aria-label="Underline" />
		</ButtonGroup>
	),
};

export const IconButtons: Story = {
	render: (args) => (
		<ButtonGroup {...args} aria-label="Alignment">
			<Button variant="secondary" icon={AlignLeft} aria-label="Align left" />
			<Button
				variant="secondary"
				icon={AlignCenter}
				aria-label="Align center"
			/>
			<Button variant="secondary" icon={AlignRight} aria-label="Align right" />
		</ButtonGroup>
	),
};

export const Vertical: Story = {
	args: { orientation: 'vertical' },
	render: (args) => (
		<ButtonGroup {...args} aria-label="View options">
			<Button variant="secondary">List</Button>
			<Button variant="secondary">Grid</Button>
			<Button variant="secondary">Board</Button>
		</ButtonGroup>
	),
};

export const FullWidth: Story = {
	args: { fullWidth: true },
	render: (args) => (
		<div style={{ width: '24rem' }}>
			<ButtonGroup {...args} aria-label="Period">
				<Button variant="secondary">Day</Button>
				<Button variant="secondary">Week</Button>
				<Button variant="secondary">Month</Button>
			</ButtonGroup>
		</div>
	),
};

export const AllVariants: Story = {
	render: () => (
		<Stack direction="column" gap="lg">
			<ButtonGroup aria-label="Secondary group">
				<Button variant="secondary">One</Button>
				<Button variant="secondary">Two</Button>
				<Button variant="secondary">Three</Button>
			</ButtonGroup>
			<ButtonGroup aria-label="Primary group">
				<Button variant="primary">Yes</Button>
				<Button variant="primary">No</Button>
			</ButtonGroup>
			<ButtonGroup aria-label="Ghost group">
				<Button variant="ghost">Prev</Button>
				<Button variant="ghost">Next</Button>
			</ButtonGroup>
		</Stack>
	),
};
