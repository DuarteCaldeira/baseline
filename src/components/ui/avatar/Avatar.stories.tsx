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

export const AllSizes: Story = {
	render: () => (
		<Stack direction="row" gap="lg" align="center">
			<Avatar name="Alice Martin" src={SAMPLE_SRC} size="xs" />
			<Avatar name="Alice Martin" src={SAMPLE_SRC} size="sm" />
			<Avatar name="Alice Martin" src={SAMPLE_SRC} size="md" />
			<Avatar name="Alice Martin" src={SAMPLE_SRC} size="lg" />
		</Stack>
	),
};

export const InitialsAllSizes: Story = {
	render: () => (
		<Stack direction="row" gap="lg" align="center">
			<Avatar name="Alice Martin" size="xs" />
			<Avatar name="Alice Martin" size="sm" />
			<Avatar name="Alice Martin" size="md" />
			<Avatar name="Alice Martin" size="lg" />
		</Stack>
	),
};

export const PeopleRow: Story = {
	render: () => (
		<Stack direction="row" gap="md" align="center">
			<Avatar name="Alice Martin" src="https://i.pravatar.cc/150?u=alice" />
			<Avatar name="Bob Chen" src="https://i.pravatar.cc/150?u=bob" />
			<Avatar name="Clara Nunes" src="https://i.pravatar.cc/150?u=clara" />
			<Avatar name="David Park" />
			<Avatar name="Eva Santos" />
		</Stack>
	),
};
