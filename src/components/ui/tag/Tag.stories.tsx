import { useState } from 'react';

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

export const Small: Story = {
	args: { size: 'sm' },
};

export const WithIcon: Story = {
	args: { icon: Hash },
};

export const Removable: Story = {
	args: { onRemove: () => {} },
};

export const SmallRemovable: Story = {
	args: {
		size: 'sm',
		children: 'Filter',
		onRemove: () => {},
		removeLabel: 'Remove Filter',
	},
};

export const AllVariants: Story = {
	render: () => (
		<Stack direction="row" gap="2" wrap>
			<Tag>Default</Tag>
			<Tag variant="primary">Primary</Tag>
			<Tag icon={TagIcon}>With icon</Tag>
			<Tag variant="primary" icon={Hash}>
				Primary + icon
			</Tag>
		</Stack>
	),
};

export const RemovableGroup: Story = {
	render: () => {
		const RemovableTags = () => {
			const [tags, setTags] = useState([
				'React',
				'TypeScript',
				'Accessibility',
			]);

			if (tags.length === 0) {
				return (
					<p
						style={{ font: 'var(--font-sm)', color: 'var(--color-text-muted)' }}
					>
						No tags selected.
					</p>
				);
			}

			return (
				<Stack direction="row" gap="2" wrap>
					{tags.map((tag) => (
						<Tag
							key={tag}
							onRemove={() =>
								setTags((current) => current.filter((entry) => entry !== tag))
							}
							removeLabel={`Remove ${tag}`}
						>
							{tag}
						</Tag>
					))}
				</Stack>
			);
		};

		return <RemovableTags />;
	},
};

export const FilterBar: Story = {
	render: () => (
		<Stack direction="row" gap="2" wrap align="center">
			<span
				style={{ font: 'var(--font-sm)', color: 'var(--color-text-muted)' }}
			>
				Active filters:
			</span>
			<Tag size="sm" onRemove={() => {}} removeLabel="Remove Open status">
				Status: Open
			</Tag>
			<Tag size="sm" onRemove={() => {}} removeLabel="Remove Design team">
				Team: Design
			</Tag>
			<Tag size="sm" variant="primary">
				3 results
			</Tag>
		</Stack>
	),
};
