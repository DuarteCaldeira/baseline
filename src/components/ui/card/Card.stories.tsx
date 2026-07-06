import type { Meta, StoryObj } from '@storybook/react';

import { Stack } from '@/components/layout/stack';
import { Heading, Text } from '@/components/ui/typography';

import { Card } from './Card';

const meta: Meta<typeof Card> = {
	title: 'UI/Card',
	component: Card,
	tags: ['autodocs'],
	argTypes: {
		as: {
			control: 'select',
			options: ['section', 'article', 'div'],
		},
		gap: {
			control: 'select',
			options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'],
		},
		padding: {
			control: 'select',
			options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'],
		},
	},
	args: {
		as: 'section',
		gap: 'lg',
		padding: 'lg',
	},
};

export default meta;

type Story = StoryObj<typeof Card>;

export const AllVariants: Story = {
	render: (args) => (
		<Stack gap="lg">
			<Card {...args}>
				<Heading as="h3" size="sm">
					Default card
				</Heading>
				<Text tone="muted">
					A flexible surface for grouping related content, actions, and states.
				</Text>
			</Card>

			<Card {...args} overflowHidden>
				<Heading as="h3" size="sm">
					Overflow hidden
				</Heading>
				<div
					style={{
						height: '4rem',
						borderRadius: '0.5rem',
						background:
							'linear-gradient(90deg, var(--color-primary-subtle), var(--color-primary))',
					}}
				/>
			</Card>

			<div style={{ height: '16rem' }}>
				<Card {...args} fill>
					<Heading as="h3" size="sm">
						Fill height
					</Heading>
					<Text tone="muted">
						Useful for dashboard panels and scrollable layout regions.
					</Text>
					<div style={{ minHeight: '12rem', background: 'var(--color-bg-subtle)' }} />
				</Card>
			</div>
		</Stack>
	),
};
