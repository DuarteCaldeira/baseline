import type { Meta, StoryObj } from '@storybook/react';

import styles from '@/storybook/storyHelpers.module.scss';

import { Stack } from './Stack';

const Item = ({ label }: { label: string }) => (
	<div className={styles.item}>{label}</div>
);

const defaultChildren = (
	<>
		<Item label="One" />
		<Item label="Two" />
		<Item label="Three" />
	</>
);

const meta: Meta<typeof Stack> = {
	title: 'Layout/Stack',
	component: Stack,
	tags: ['autodocs'],
	argTypes: {
		as: {
			control: 'select',
			options: [
				'div',
				'span',
				'ul',
				'ol',
				'li',
				'nav',
				'section',
				'header',
				'footer',
				'main',
				'form',
				'fieldset',
			],
		},
		direction: {
			control: 'select',
			options: ['row', 'column'],
		},
		gap: {
			control: 'select',
			options: ['1', '2', '3', '4', '6', '8'],
		},
		align: {
			control: 'select',
			options: ['start', 'center', 'end', 'stretch'],
		},
		justify: {
			control: 'select',
			options: ['start', 'center', 'end', 'between', 'around'],
		},
		wrap: { control: 'boolean' },
		children: { control: false },
	},
	args: {
		direction: 'column',
		gap: '4',
		align: 'stretch',
		justify: 'start',
		wrap: false,
		children: defaultChildren,
	},
};

export default meta;

type Story = StoryObj<typeof Stack>;

export const Column: Story = {};

export const Row: Story = {
	args: { direction: 'row' },
};

export const Wrap: Story = {
	render: () => (
		<Stack
			direction="row"
			gap="4"
			wrap
			className={styles.exampleStack}
			style={{ width: '19.5rem' }}
		>
			<Item label="One" />
			<Item label="Two" />
			<Item label="Three" />
			<Item label="Four" />
			<Item label="Five" />
			<Item label="Six" />
		</Stack>
	),
};

export const Centered: Story = {
	args: { direction: 'row', align: 'center', justify: 'center' },
};

export const Between: Story = {
	args: { direction: 'row', justify: 'between' },
};

export const AllGaps: Story = {
	render: () => (
		<Stack direction="column" gap="4">
			{(['1', '2', '3', '4', '6', '8'] as const).map((gap) => (
				<Stack key={gap} direction="column" gap="2">
					<strong>Gap {gap}</strong>
					<Stack direction="row" gap={gap} className={styles.exampleStack}>
						<Item label="One" />
						<Item label="Two" />
						<Item label="Three" />
					</Stack>
				</Stack>
			))}
		</Stack>
	),
};
