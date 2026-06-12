import type { Meta, StoryObj } from '@storybook/react';

import { Stack } from '@/components/layout/stack';

import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
	title: 'UI/Textarea',
	component: Textarea,
	tags: ['autodocs'],
	argTypes: {
		label: { control: 'text' },
		placeholder: { control: 'text' },
		helperText: { control: 'text' },
		error: { control: 'text' },
		resize: {
			control: 'select',
			options: ['none', 'vertical', 'horizontal', 'both'],
		},
		rows: { control: 'number' },
		disabled: { control: 'boolean' },
	},
	args: {
		id: 'textarea-story',
		label: 'Message',
		placeholder: 'Write your message here...',
		resize: 'vertical',
		disabled: false,
	},
};

export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {};

export const WithHelperText: Story = {
	args: {
		helperText: 'Maximum 500 characters.',
	},
};

export const WithError: Story = {
	args: {
		error: 'This field is required.',
	},
};

export const WithHelperTextAndError: Story = {
	args: {
		helperText: 'Maximum 500 characters.',
		error: 'This field is required.',
	},
};

export const ResizeNone: Story = {
	args: { resize: 'none' },
};

export const CustomRows: Story = {
	args: { rows: 8 },
};

export const Disabled: Story = {
	args: {
		disabled: true,
		value: 'Cannot edit this content.',
	},
};

export const WithoutLabel: Story = {
	args: { label: undefined },
};

export const AllStates: Story = {
	render: () => (
		<Stack direction="column" gap="6" style={{ maxWidth: '480px' }}>
			<Textarea
				id="s1"
				label="Default"
				placeholder="Write your message here..."
			/>
			<Textarea
				id="s2"
				label="With helper text"
				placeholder="Write your message here..."
				helperText="Maximum 500 characters."
			/>
			<Textarea id="s3" label="With error" error="This field is required." />
			<Textarea
				id="s4"
				label="Disabled"
				disabled
				value="Cannot edit this content."
			/>
		</Stack>
	),
};
