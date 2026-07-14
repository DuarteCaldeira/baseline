import type { Meta, StoryObj } from '@storybook/react';
import { Hash, Tag as TagIcon } from 'lucide-react';

import { Stack } from '@/components/layout/stack';

import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
	title: 'UI/Tag',
	component: Tag,
	tags: ['autodocs'],
	argTypes: {
		icon: { control: false },
		onRemove: { control: false },
	},
	args: {
		children: 'Design system',
		variant: 'default',
		size: 'md',
	},
};

export default meta;

type Story = StoryObj<typeof Tag>;

export const Default: Story = {};

export const Primary: Story = {
	args: { variant: 'primary' },
};

export const WithIcon: Story = {
	args: { icon: Hash },
};

export const Removable: Story = {
	args: { onRemove: () => {} },
};

export const AllVariants: Story = {
	render: () => (
		<Stack direction="column" gap="md">
			<Stack direction="row" gap="sm" wrap>
				<Tag>Default</Tag>
				<Tag variant="primary">Primary</Tag>
				<Tag icon={TagIcon}>With icon</Tag>
				<Tag variant="primary" icon={Hash}>
					Primary + icon
				</Tag>
			</Stack>
			<Stack direction="row" gap="sm" wrap align="center">
				<Tag size="sm">Small</Tag>
				<Tag size="sm" variant="primary">
					Small primary
				</Tag>
				<Tag size="sm" icon={Hash}>
					Small icon
				</Tag>
			</Stack>
			<Stack direction="row" gap="sm" wrap align="center">
				<Tag onRemove={() => {}}>Removable</Tag>
				<Tag size="sm" onRemove={() => {}} removeLabel="Remove Filter">
					Filter
				</Tag>
			</Stack>
		</Stack>
	),
};
