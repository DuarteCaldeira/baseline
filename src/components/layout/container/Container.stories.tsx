import type { Meta, StoryObj } from '@storybook/react';

import { Stack } from '@/components/layout/stack';
import { Container } from './Container';

const meta: Meta<typeof Container> = {
	title: 'Layout/Container',
	component: Container,
	tags: ['autodocs'],
	argTypes: {
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg', 'xl', 'full'],
		},
		children: { control: 'text' },
	},
	args: {
		size: 'lg',
		children:
			'This is a responsive container. Resize the viewport to see how it behaves.',
	},
};

export default meta;

type Story = StoryObj<typeof Container>;

export const Default: Story = {};

export const Small: Story = {
	args: { size: 'sm', children: 'Small container (max-width: 640px).' },
};

export const Medium: Story = {
	args: { size: 'md', children: 'Medium container (max-width: 768px).' },
};

export const Large: Story = {
	args: { size: 'lg', children: 'Large container (max-width: 1024px).' },
};

export const XLarge: Story = {
	args: { size: 'xl', children: 'XLarge container (max-width: 1280px).' },
};

export const FullWidth: Story = {
	args: { size: 'full', children: 'Full width container (max-width: 100%).' },
};

export const AllSizes: Story = {
	render: () => (
		<Stack
			direction="column"
			gap="xl"
			style={{ background: 'var(--color-bg-muted)', padding: '1rem' }}
		>
			<Stack gap="sm">
				<strong>Small</strong>
				<Container size="sm">Small container (max-width: 640px).</Container>
			</Stack>
			<Stack gap="sm">
				<strong>Medium</strong>
				<Container size="md">Medium container (max-width: 768px).</Container>
			</Stack>
			<Stack gap="sm">
				<strong>Large</strong>
				<Container size="lg">Large container (max-width: 1024px).</Container>
			</Stack>
			<Stack gap="sm">
				<strong>XLarge</strong>
				<Container size="xl">XLarge container (max-width: 1280px).</Container>
			</Stack>
			<Stack gap="sm">
				<strong>Full width</strong>
				<Container size="full">Full width container (max-width: 100%).</Container>
			</Stack>
		</Stack>
	),
};
