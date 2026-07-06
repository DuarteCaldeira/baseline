import type { Meta, StoryObj } from '@storybook/react';

import { Stack } from '@/components/layout/stack';

import { Heading } from './Heading';
import { Text } from './Text';

const meta: Meta<typeof Text> = {
	title: 'UI/Typography',
	component: Text,
	subcomponents: { Heading },
	tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Text>;

export const AllVariants: Story = {
	render: () => (
		<Stack gap="lg">
			<Stack gap="sm">
				<Heading as="h1">Build clearer interfaces</Heading>
				<Text variant="lead" tone="muted">
					A compact typography set for headings, supporting copy, and labels.
				</Text>
			</Stack>

			<Stack gap="sm">
				<Heading as="h2">Heading scale</Heading>
				<Heading as="h1">Heading XL</Heading>
				<Heading as="h2">Heading LG</Heading>
				<Heading as="h3">Heading MD</Heading>
				<Heading as="h4">Heading SM</Heading>
			</Stack>

			<Stack gap="sm">
				<Heading as="h3" size="sm">
					Text styles
				</Heading>
				<Text variant="body">
					Body text is the default for paragraphs and general content.
				</Text>
				<Text variant="body-sm">
					Small body text works well for secondary metadata and dense layouts.
				</Text>
				<Text variant="lead">
					Lead text gives important supporting copy a bit more presence.
				</Text>
				<Text variant="label">Label text helps identify fields and values.</Text>
				<Text variant="caption" tone="muted">
					Caption text is useful for timestamps, helper text, and notes.
				</Text>
			</Stack>
		</Stack>
	),
};
