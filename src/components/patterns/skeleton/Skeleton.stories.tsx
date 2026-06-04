import type { Meta, StoryObj } from '@storybook/react';

import { Stack } from '@/components/layout/stack';

import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
	title: 'Patterns/Skeleton',
	component: Skeleton,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['text', 'heading', 'paragraph', 'circular', 'rectangular', 'button'],
		},
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg'],
		},
		width: {
			control: 'select',
			options: ['full', '3/4', '2/3', '1/2', '1/3', '1/4', 'auto'],
		},
		lines: { control: 'number', min: 1, max: 8 },
		animate: { control: 'boolean' },
		as: {
			control: 'select',
			options: ['div', 'span'],
		},
	},
	args: {
		variant: 'text',
		size: 'md',
		width: 'full',
		lines: 3,
		animate: true,
	},
};

export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Text: Story = {
	args: { variant: 'text', width: '3/4' },
};

export const Heading: Story = {
	args: { variant: 'heading', width: '1/2' },
};

export const Paragraph: Story = {
	args: { variant: 'paragraph', lines: 4 },
};

export const Circular: Story = {
	args: { variant: 'circular', size: 'md' },
};

export const Rectangular: Story = {
	args: { variant: 'rectangular', size: 'md' },
};

export const Button: Story = {
	args: { variant: 'button', size: 'md' },
};

export const Static: Story = {
	args: { variant: 'text', animate: false, width: '2/3' },
};

export const WidthPresets: Story = {
	render: () => (
		<Stack gap="3" style={{ width: '20rem' }}>
			{(['full', '3/4', '2/3', '1/2', '1/3', '1/4'] as const).map((width) => (
				<Skeleton key={width} variant="text" width={width} />
			))}
		</Stack>
	),
};

export const CardPlaceholder: Story = {
	render: () => (
		<div
			style={{
				width: '22rem',
				padding: '1rem',
				border: '1px solid var(--color-border)',
				borderRadius: '0.75rem',
			}}
		>
			<Stack gap="4">
				<Stack direction="row" gap="3" align="center">
					<Skeleton variant="circular" size="md" width="auto" />
					<Stack gap="2" style={{ flex: 1 }}>
						<Skeleton variant="text" width="1/2" />
						<Skeleton variant="text" width="1/3" />
					</Stack>
				</Stack>
				<Skeleton variant="rectangular" size="sm" />
				<Skeleton variant="paragraph" lines={3} />
				<Stack direction="row" gap="2" justify="end">
					<Skeleton variant="button" size="sm" width="auto" />
					<Skeleton variant="button" size="sm" width="auto" />
				</Stack>
			</Stack>
		</div>
	),
};

export const InlineText: Story = {
	render: () => (
		<p style={{ font: 'var(--font-base)', color: 'var(--color-text-muted)' }}>
			Loading profile for{' '}
			<Skeleton as="span" variant="text" width="1/4" />…
		</p>
	),
};

export const AllVariants: Story = {
	render: () => (
		<Stack gap="4" style={{ width: '18rem' }}>
			<Skeleton variant="heading" width="2/3" />
			<Skeleton variant="text" />
			<Skeleton variant="text" width="3/4" />
			<Skeleton variant="paragraph" lines={3} />
			<Stack direction="row" gap="3" align="center">
				<Skeleton variant="circular" size="sm" width="auto" />
				<Skeleton variant="circular" size="md" width="auto" />
				<Skeleton variant="circular" size="lg" width="auto" />
			</Stack>
			<Skeleton variant="rectangular" size="md" />
			<Skeleton variant="button" size="md" width="auto" />
		</Stack>
	),
};
