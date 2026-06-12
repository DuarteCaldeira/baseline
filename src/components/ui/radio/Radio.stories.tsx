import type { Meta, StoryObj } from '@storybook/react';

import { Stack } from '@/components/layout/stack';

import { Radio } from './Radio';

const meta: Meta<typeof Radio> = {
	title: 'UI/Radio',
	component: Radio,
	tags: ['autodocs'],
	argTypes: {
		label: { control: 'text' },
		helperText: { control: 'text' },
		error: { control: 'text' },
		disabled: { control: 'boolean' },
	},
	args: {
		label: 'Option A',
		disabled: false,
	},
};

export default meta;

type Story = StoryObj<typeof Radio>;

export const Default: Story = {};

export const Checked: Story = {
	args: { defaultChecked: true },
};

export const WithoutLabel: Story = {
	args: { label: undefined },
};

export const Disabled: Story = {
	args: { disabled: true },
};

export const DisabledChecked: Story = {
	args: { disabled: true, defaultChecked: true },
};

export const WithHelperText: Story = {
	args: {
		id: 'option-a',
		helperText: 'This is the recommended choice.',
	},
};

export const WithError: Story = {
	args: {
		id: 'option-a',
		error: 'Please select an option.',
	},
};

export const WithHelperTextAndError: Story = {
	args: {
		id: 'option-a',
		helperText: 'This is the recommended choice.',
		error: 'Please select an option.',
	},
};

export const Group: Story = {
	render: () => (
		<Stack direction="column" gap="2">
			<Radio id="opt-a" name="demo" label="Option A" defaultChecked />
			<Radio id="opt-b" name="demo" label="Option B" />
			<Radio id="opt-c" name="demo" label="Option C" />
		</Stack>
	),
};

export const AllStates: Story = {
	render: () => (
		<Stack direction="column" gap="4">
			<Radio label="Default" />
			<Radio label="Checked" defaultChecked />
			<Radio
				id="helper-example"
				label="With helper text"
				helperText="This is the recommended choice."
			/>
			<Radio label="Disabled" disabled />
			<Radio label="Disabled checked" disabled defaultChecked />
			<Radio
				id="error-example"
				label="With error"
				error="Please select an option."
			/>
		</Stack>
	),
};
