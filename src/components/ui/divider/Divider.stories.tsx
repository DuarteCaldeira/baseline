import type { Meta, StoryObj } from '@storybook/react';

import { Stack } from '@/components/layout/stack';
import styles from '@/storybook/storyHelpers.module.scss';

import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
	title: 'UI/Divider',
	component: Divider,
	tags: ['autodocs'],
	argTypes: {
		orientation: {
			control: 'select',
			options: ['horizontal', 'vertical'],
		},
		variant: {
			control: 'select',
			options: ['default', 'strong'],
		},
		width: {
			control: 'select',
			options: ['full', 'contained'],
		},
	},
	args: {
		orientation: 'horizontal',
		variant: 'default',
		width: 'full',
	},
};

export default meta;

type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = {
	render: (args) => (
		<Stack gap="md" className={styles.exampleStack}>
			<div className={styles.item}>Above</div>
			<Divider {...args} />
			<div className={styles.item}>Below</div>
		</Stack>
	),
};

export const Vertical: Story = {
	args: { orientation: 'vertical' },
	render: (args) => (
		<Stack
			direction="row"
			align="stretch"
			gap="md"
			className={styles.exampleStack}
			style={{ minHeight: '5rem' }}
		>
			<div className={styles.item}>Left</div>
			<Divider {...args} />
			<div className={styles.item}>Right</div>
		</Stack>
	),
};

export const Strong: Story = {
	args: { variant: 'strong' },
	render: (args) => (
		<Stack gap="md" className={styles.exampleStack}>
			<div className={styles.item}>Above</div>
			<Divider {...args} />
			<div className={styles.item}>Below</div>
		</Stack>
	),
};

export const Contained: Story = {
	args: { width: 'contained' },
	render: (args) => (
		<Stack gap="md" className={styles.exampleStack}>
			<div className={styles.item}>Above</div>
			<Divider {...args} />
			<div className={styles.item}>Below</div>
		</Stack>
	),
};

export const ContainedVertical: Story = {
	name: 'Contained Vertical',
	args: { orientation: 'vertical', width: 'contained' },
	render: (args) => (
		<Stack
			direction="row"
			align="stretch"
			gap="md"
			className={styles.exampleStack}
			style={{ minHeight: '5rem' }}
		>
			<div className={styles.item}>Left</div>
			<Divider {...args} />
			<div className={styles.item}>Right</div>
		</Stack>
	),
};
