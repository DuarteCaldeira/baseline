import type { Meta, StoryObj } from '@storybook/react';

import { Stack } from '@/components/layout/stack';

import { ToggleSwitch } from './ToggleSwitch';

const meta: Meta<typeof ToggleSwitch> = {
	title: 'UI/ToggleSwitch',
	component: ToggleSwitch,
	tags: ['autodocs'],
	argTypes: {
		label: { control: 'text' },
		helperText: { control: 'text' },
		error: { control: 'text' },
		disabled: { control: 'boolean' },
	},
	parameters: {
		controls: {
			exclude: ['checked', 'defaultChecked', 'onChange'],
		},
	},
	args: {
		id: 'toggle-default',
		label: 'Enable notifications',
		disabled: false,
	},
};

export default meta;

type Story = StoryObj<typeof ToggleSwitch>;

export const Default: Story = {
	args: { id: 'toggle-default' },
};

export const On: Story = {
	args: { id: 'toggle-on', defaultChecked: true },
};

export const WithoutLabel: Story = {
	args: { id: 'toggle-no-label', label: undefined },
};

export const Disabled: Story = {
	args: { id: 'toggle-disabled', disabled: true },
};

export const DisabledOn: Story = {
	args: { id: 'toggle-disabled-on', disabled: true, defaultChecked: true },
};

export const WithHelperText: Story = {
	args: {
		id: 'toggle-helper',
		helperText: 'Receive email updates about your account activity.',
	},
};

export const WithError: Story = {
	args: {
		id: 'toggle-error',
		error: 'Notifications must be enabled to continue.',
	},
};

export const SettingsList: Story = {
	render: () => (
		<Stack direction="column" gap="lg" style={{ width: '22rem' }}>
			<ToggleSwitch
				id="email-notifications"
				label="Email notifications"
				defaultChecked
				helperText="Get updates about your account."
			/>
			<ToggleSwitch
				id="marketing"
				label="Marketing emails"
				helperText="Product news and feature announcements."
			/>
			<ToggleSwitch
				id="security-alerts"
				label="Security alerts"
				defaultChecked
				helperText="Important alerts about your account security."
			/>
		</Stack>
	),
};

export const AllStates: Story = {
	render: () => (
		<Stack direction="column" gap="lg">
			<ToggleSwitch id="all-off" label="Off" />
			<ToggleSwitch id="all-on" label="On" defaultChecked />
			<ToggleSwitch
				id="all-helper"
				label="With helper text"
				helperText="You can change this preference at any time."
			/>
			<ToggleSwitch id="all-disabled" label="Disabled" disabled />
			<ToggleSwitch
				id="all-disabled-on"
				label="Disabled on"
				disabled
				defaultChecked
			/>
			<ToggleSwitch
				id="all-error"
				label="With error"
				error="This field is required."
			/>
		</Stack>
	),
};
