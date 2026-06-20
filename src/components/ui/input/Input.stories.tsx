import type { Meta, StoryObj } from '@storybook/react';

import { Stack } from '@/components/layout/stack';

import { Input } from './Input';

const meta: Meta<typeof Input> = {
	title: 'UI/Input',
	component: Input,
	tags: ['autodocs'],
	argTypes: {
		label: { control: 'text' },
		placeholder: { control: 'text' },
		helperText: { control: 'text' },
		error: { control: 'text' },
		disabled: { control: 'boolean' },
		type: {
			control: 'select',
			options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
		},
	},
	args: {
		id: 'input-story',
		label: 'Label',
		placeholder: 'Placeholder...',
		disabled: false,
	},
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const WithDefaultValue: Story = {
	args: {
		label: 'Full name',
		defaultValue: 'Jane Smith',
	},
};

export const WithoutLabel: Story = {
	args: { label: undefined },
};

export const WithHelperText: Story = {
	args: {
		helperText: 'We will never share your email with anyone.',
	},
};

export const WithError: Story = {
	args: {
		error: 'This field is required.',
		value: '',
	},
};

export const WithHelperTextAndError: Story = {
	args: {
		helperText: 'We will never share your email with anyone.',
		error: 'This field is required.',
		value: '',
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
		value: 'Cannot edit this',
	},
};

export const Password: Story = {
	args: {
		type: 'password',
		label: 'Password',
		placeholder: 'Enter your password',
	},
};

export const WithLeftAffix: Story = {
	args: {
		type: 'tel',
		label: 'Phone number',
		leftAffix: '+351',
		placeholder: '912 345 678',
	},
};

export const WithRightAffix: Story = {
	args: {
		type: 'number',
		label: 'Discount',
		rightAffix: '%',
		placeholder: '0',
		min: 0,
		max: 100,
	},
};

export const WithBothAffixes: Story = {
	args: {
		type: 'number',
		label: 'Amount',
		leftAffix: '€',
		rightAffix: 'EUR',
		placeholder: '0.00',
		min: 0,
		step: 0.01,
	},
};

export const AllStates: Story = {
	render: () => (
		<Stack direction="column" gap="xl" style={{ maxWidth: '480px' }}>
			<Input id="s1" label="Default" placeholder="Placeholder..." />
			<Input
				id="s2"
				label="With helper text"
				placeholder="Placeholder..."
				helperText="This is some helpful context."
			/>
			<Input
				id="s3"
				label="Filled"
				defaultValue="Some value"
				placeholder="Placeholder..."
			/>
			<Input
				id="s4"
				label="Error"
				error="This field is required."
				value=""
				onChange={() => {}}
			/>
			<Input
				id="s5"
				label="Helper text and error"
				helperText="This is some helpful context."
				error="This field is required."
				value=""
				onChange={() => {}}
			/>
			<Input id="s6" label="Disabled" disabled value="Disabled value" />
			<Input
				id="s7"
				type="tel"
				label="Left affix"
				leftAffix="+351"
				placeholder="912 345 678"
			/>
			<Input
				id="s8"
				type="number"
				label="Right affix"
				rightAffix="%"
				placeholder="0"
				min={0}
				max={100}
			/>
			<Input
				id="s9"
				type="number"
				label="Both affixes"
				leftAffix="€"
				rightAffix="EUR"
				placeholder="0.00"
				min={0}
				step={0.01}
			/>
			<Input
				id="s10"
				type="tel"
				label="Affix with error"
				leftAffix="+351"
				placeholder="912 345 678"
				error="Enter a valid phone number."
				value=""
				onChange={() => {}}
			/>
		</Stack>
	),
};
