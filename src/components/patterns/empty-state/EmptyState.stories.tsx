import type { Meta, StoryObj } from '@storybook/react';
import { FileSearch, Inbox, Plus, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
	title: 'Patterns/EmptyState',
	component: EmptyState,
	tags: ['autodocs'],
	parameters: { layout: 'centered' },
	argTypes: {
		icon: { control: false },
		action: { control: false },
	},
	args: {
		title: 'No items yet',
		description: 'Get started by creating your first item.',
		icon: Inbox,
	},
};

export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {};

export const WithAction: Story = {
	args: {
		action: (
			<Button variant="primary" icon={Plus}>
				Add item
			</Button>
		),
	},
};

export const TitleOnly: Story = {
	args: {
		description: undefined,
		icon: undefined,
	},
};

export const NoResults: Story = {
	args: {
		icon: Search,
		title: 'No results found',
		description: 'Try a different search term or clear your filters.',
		action: <Button variant="secondary">Clear filters</Button>,
	},
};

export const NoFiles: Story = {
	args: {
		icon: FileSearch,
		title: 'No files uploaded',
		description: 'Drag and drop files here, or browse to upload.',
		action: (
			<Button variant="primary" icon={Plus}>
				Upload file
			</Button>
		),
	},
};

export const InCard: Story = {
	args: {
		icon: Inbox,
		title: 'Your inbox is empty',
		description: 'New messages will appear here.',
	},
	decorators: [
		(Story) => (
			<div style={{ width: '28rem' }}>
				<Story />
			</div>
		),
	],
};
