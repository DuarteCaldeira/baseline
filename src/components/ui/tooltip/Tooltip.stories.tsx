import type { Meta, StoryObj } from '@storybook/react';
import { HelpCircle, Info, Settings, Trash2 } from 'lucide-react';

import { Stack } from '@/components/layout/stack';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Link } from '@/components/ui/link';
import { withSurfaceInline } from '@/storybook/decorators';

import { Tooltip } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
	title: 'UI/Tooltip',
	component: Tooltip,
	tags: ['autodocs'],
	decorators: [withSurfaceInline],
	argTypes: {
		content: { control: 'text' },
		placement: {
			control: 'select',
			options: ['top', 'bottom', 'left', 'right'],
		},
	},
	args: {
		content: 'Additional context for this control.',
		placement: 'top',
	},
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
	render: (args) => (
		<Tooltip {...args}>
			<Button variant="secondary">Hover or focus me</Button>
		</Tooltip>
	),
};

export const IconButton: Story = {
	render: (args) => (
		<Tooltip {...args} content="Delete this item permanently">
			<Button variant="ghost" size="sm" iconOnly aria-label="Delete">
				<Icon icon={Trash2} size="sm" />
			</Button>
		</Tooltip>
	),
};

export const WithLink: Story = {
	render: (args) => (
		<Tooltip {...args} content="Opens documentation in a new tab">
			<Link href="#" external>
				Learn more
			</Link>
		</Tooltip>
	),
};

export const LongContent: Story = {
	render: (args) => (
		<Tooltip
			{...args}
			content="Tooltips wrap longer helper text so dense toolbars can still expose full explanations without cluttering the layout."
		>
			<Button variant="ghost" size="sm" iconOnly aria-label="More information">
				<Icon icon={Info} size="sm" />
			</Button>
		</Tooltip>
	),
};

export const Placements: Story = {
	render: () => (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
				gap: '3rem',
				padding: '4rem',
				placeItems: 'center',
			}}
		>
			<Tooltip content="Top placement" placement="top">
				<Button variant="secondary">Top</Button>
			</Tooltip>
			<Tooltip content="Bottom placement" placement="bottom">
				<Button variant="secondary">Bottom</Button>
			</Tooltip>
			<Tooltip content="Left placement" placement="left">
				<Button variant="secondary">Left</Button>
			</Tooltip>
			<Tooltip content="Right placement" placement="right">
				<Button variant="secondary">Right</Button>
			</Tooltip>
		</div>
	),
};

export const Toolbar: Story = {
	render: () => (
		<Stack
			direction="row"
			align="center"
			gap="sm"
			style={{
				padding: '0.75rem',
				border: '1px solid var(--color-border)',
				borderRadius: '0.5rem',
				backgroundColor: 'var(--color-surface)',
			}}
		>
			<Tooltip content="Workspace settings">
				<Button variant="ghost" size="sm" iconOnly aria-label="Settings">
					<Icon icon={Settings} size="sm" />
				</Button>
			</Tooltip>
			<Tooltip content="View help articles">
				<Button variant="ghost" size="sm" iconOnly aria-label="Help">
					<Icon icon={HelpCircle} size="sm" />
				</Button>
			</Tooltip>
			<Tooltip content="Remove selected rows">
				<Button variant="ghost" size="sm" iconOnly aria-label="Delete">
					<Icon icon={Trash2} size="sm" />
				</Button>
			</Tooltip>
		</Stack>
	),
};
