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

export const AllStates: Story = {
	render: () => (
		<Stack direction="column" gap="xl" style={{ maxWidth: '400px' }}>
			<Input id="s1" label="Default" placeholder="Placeholder..." />
			<Input
				id="s2"
				label="With helper text"
				placeholder="Placeholder..."
				helperText="This is some helpful context."
			/>
			<Input id="s3" label="Filled" value="Some value" onChange={() => {}} />
			<Input
				id="s4"
				label="Error"
				error="This field is required."
				value=""
				onChange={() => {}}
			/>
			<Input id="s5" label="Disabled" disabled value="Disabled value" />
		</Stack>
	),
};
