import type { Meta, StoryObj } from '@storybook/react';

import styles from '@/storybook/storyHelpers.module.scss';

import { Stack, type StackWidth } from './Stack';
import type { StackSpacing } from './Stack.types';

const spacingOptions: StackSpacing[] = [
	'none',
	'xs',
	'sm',
	'md',
	'lg',
	'xl',
	'2xl',
	'3xl',
];

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

type WidthRow = {
	label: string;
	widths: StackWidth[];
};

const WIDTH_ROWS: WidthRow[] = [
	{ label: '1/2 + 1/2', widths: ['1/2', '1/2'] },
	{ label: '1/3 + 2/3', widths: ['1/3', '2/3'] },
	{ label: '1/4 + 3/4', widths: ['1/4', '3/4'] },
	{ label: '1/4 + 1/3', widths: ['1/4', '1/3'] },
	{ label: '1/3 + 1/3 + 1/3', widths: ['1/3', '1/3', '1/3'] },
	{ label: '1/4 + 1/4 + 1/2', widths: ['1/4', '1/4', '1/2'] },
	{ label: '1/4 + 1/3 + 1/4', widths: ['1/4', '1/3', '1/4'] },
];

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
			options: spacingOptions,
		},
		padding: {
			control: 'select',
			options: [undefined, ...spacingOptions],
		},
		margin: {
			control: 'select',
			options: [undefined, ...spacingOptions],
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
		gap: 'lg',
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
			gap="lg"
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

export const Spacing: Story = {
	args: {
		padding: 'lg',
		margin: 'xl',
	},
};

export const AxisSpacing: Story = {
	render: () => (
		<Stack
			padding={{ x: 'xl', y: 'sm' }}
			margin={{ y: 'lg' }}
			className={styles.exampleStack}
		>
			{defaultChildren}
		</Stack>
	),
};

export const AllGaps: Story = {
	render: () => (
		<Stack direction="column" gap="lg">
			{(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((gap) => (
				<Stack key={gap} direction="column" gap="sm">
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

export const FractionalWidths: Story = {
	render: () => (
		<Stack direction="column" gap="lg" className={styles.exampleStack}>
			{WIDTH_ROWS.map(({ label, widths }) => (
				<Stack key={label} direction="column" gap="sm">
					<strong>{label}</strong>
					<Stack direction="row" gap="md" width="full">
						{widths.map((width, index) => (
							<Stack key={`${label}-${index}`} width={width}>
								<Item label={width} />
							</Stack>
						))}
					</Stack>
				</Stack>
			))}
		</Stack>
	),
};
