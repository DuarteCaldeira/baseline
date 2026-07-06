import type { Meta, StoryObj } from '@storybook/react';

import { Stack } from '@/components/layout/stack';

import { Avatar } from './Avatar';

const SAMPLE_SRC = 'https://i.pravatar.cc/150?u=alice';

const meta: Meta<typeof Avatar> = {
	title: 'UI/Avatar',
	component: Avatar,
	tags: ['autodocs'],
	argTypes: {
		size: {
			control: 'select',
			options: ['xs', 'sm', 'md', 'lg'],
		},
	},
	args: {
		name: 'Alice Martin',
		src: SAMPLE_SRC,
		size: 'md',
	},
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {};

export const Initials: Story = {
	args: {
		src: undefined,
		name: 'Alice Martin',
	},
};

export const SingleName: Story = {
	args: {
		src: undefined,
		name: 'Alice',
	},
};

export const ImageErrorFallback: Story = {
	args: {
		src: 'https://example.com/missing-avatar.jpg',
		name: 'Bob Chen',
	},
};

export const AllVariants: Story = {
	render: () => (
		<Stack direction="column" gap="lg" align="start">
			<Stack direction="row" gap="lg" align="center">
				<Avatar name="Alice Martin" src={SAMPLE_SRC} size="xs" />
				<Avatar name="Alice Martin" src={SAMPLE_SRC} size="sm" />
				<Avatar name="Alice Martin" src={SAMPLE_SRC} size="md" />
				<Avatar name="Alice Martin" src={SAMPLE_SRC} size="lg" />
			</Stack>
			<Stack direction="row" gap="lg" align="center">
				<Avatar name="Alice Martin" size="xs" />
				<Avatar name="Alice Martin" size="sm" />
				<Avatar name="Alice Martin" size="md" />
				<Avatar name="Alice Martin" size="lg" />
			</Stack>
		</Stack>
	),
};
