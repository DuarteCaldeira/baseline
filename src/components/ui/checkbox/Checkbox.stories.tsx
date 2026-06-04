import type { Meta, StoryObj } from '@storybook/react';

import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
	title: 'UI/Checkbox',
	component: Checkbox,
	tags: ['autodocs'],
	argTypes: {
		label: { control: 'text' },
		helperText: { control: 'text' },
		error: { control: 'text' },
		disabled: { control: 'boolean' },
		checked: { control: 'boolean' },
	},
	args: {
		label: 'Accept terms and conditions',
		disabled: false,
	},
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

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
		id: 'terms',
		helperText: 'You can change this preference at any time.',
	},
};

export const WithError: Story = {
	args: {
		id: 'terms',
		error: 'You must accept the terms to continue.',
	},
};

export const WithHelperTextAndError: Story = {
	args: {
		id: 'terms',
		helperText: 'You can change this preference at any time.',
		error: 'You must accept the terms to continue.',
	},
};

export const AllStates: Story = {
	render: () => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			<Checkbox label="Default" />
			<Checkbox label="Checked" defaultChecked />
			<Checkbox
				id="helper-example"
				label="With helper text"
				helperText="You can change this preference at any time."
			/>
			<Checkbox label="Disabled" disabled />
			<Checkbox label="Disabled checked" disabled defaultChecked />
			<Checkbox
				id="error-example"
				label="With error"
				error="This field is required."
			/>
		</div>
	),
};
