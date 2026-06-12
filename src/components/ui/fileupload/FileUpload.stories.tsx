import type { Meta, StoryObj } from '@storybook/react';

import { Stack } from '@/components/layout/stack';

import { FileUpload } from './FileUpload';

const meta: Meta<typeof FileUpload> = {
	title: 'UI/FileUpload',
	component: FileUpload,
	tags: ['autodocs'],
	argTypes: {
		label: { control: 'text' },
		placeholder: { control: 'text' },
		helperText: { control: 'text' },
		error: { control: 'text' },
		accept: { control: 'text' },
		disabled: { control: 'boolean' },
		multiple: { control: 'boolean' },
		getRemoveFileLabel: { control: false },
	},
	args: {
		id: 'fileupload-story',
		label: 'File',
		disabled: false,
		multiple: false,
	},
};

export default meta;

type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {};

export const Multiple: Story = {
	args: {
		multiple: true,
		helperText: 'You can select multiple files.',
	},
};

export const WithAccept: Story = {
	args: {
		accept: '.pdf,.png,.jpg',
		helperText: 'PDF and images only.',
	},
};

export const WithHelperText: Story = {
	args: {
		helperText: 'Maximum size: 5 MB.',
	},
};

export const WithError: Story = {
	args: {
		error: 'Please select a file.',
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
	},
};

export const CustomPlaceholder: Story = {
	args: {
		placeholder: 'Click to choose a document',
	},
};

export const AllStates: Story = {
	render: () => (
		<Stack direction="column" gap="6" style={{ maxWidth: '28rem' }}>
			<FileUpload id="fu-1" label="Default" />
			<FileUpload
				id="fu-2"
				label="With helper"
				helperText="Accepted formats: PDF, PNG, JPG."
				accept=".pdf,.png,.jpg"
			/>
			<FileUpload id="fu-3" label="Error" error="A file is required." />
			<FileUpload id="fu-4" label="Disabled" disabled />
		</Stack>
	),
};
