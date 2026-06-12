import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import {
	Apple,
	Ban,
	Carrot,
	Cherry,
	CircleCheck,
	Citrus,
	Clock,
	Grape,
	WifiOff,
} from 'lucide-react';

import { Select } from './Select';
import type { SelectOption } from './Select.types';

const FRUIT_OPTIONS: SelectOption[] = [
	{
		value: 'apple',
		label: 'Apple',
		icon: Apple,
		description: 'Sweet and crunchy',
	},
	{
		value: 'cherry',
		label: 'Cherry',
		icon: Cherry,
		description: 'Sweet or sour',
	},
	{
		value: 'citrus',
		label: 'Citrus',
		icon: Citrus,
		description: 'Bright and zesty',
	},
	{
		value: 'carrot',
		label: 'Carrot',
		icon: Carrot,
		description: 'Crunchy and earthy',
	},
	{
		value: 'grape',
		label: 'Grape',
		icon: Grape,
		description: 'Comes in clusters',
		disabled: true,
	},
];

const STATUS_OPTIONS: SelectOption[] = [
	{
		value: 'active',
		label: 'Active',
		icon: CircleCheck,
		iconVariant: 'success',
		description: 'User is currently active',
	},
	{
		value: 'idle',
		label: 'Idle',
		icon: Clock,
		iconVariant: 'warning',
		description: 'No activity in 30 minutes',
	},
	{
		value: 'offline',
		label: 'Offline',
		icon: WifiOff,
		iconVariant: 'muted',
		description: 'Not connected',
	},
	{
		value: 'banned',
		label: 'Banned',
		icon: Ban,
		iconVariant: 'error',
		description: 'Account suspended',
		disabled: true,
	},
];

const PLAIN_OPTIONS: SelectOption[] = [
	{ value: 'pt', label: 'Portugal' },
	{ value: 'es', label: 'Spain' },
	{ value: 'fr', label: 'France' },
	{ value: 'de', label: 'Germany' },
];

const WithIconsDemo = () => {
	const [value, setValue] = useState<string | undefined>(undefined);
	return (
		<Select
			id="fruit-select"
			label="Favourite fruit"
			options={FRUIT_OPTIONS}
			value={value}
			onChange={setValue}
		/>
	);
};

const StatusDemo = () => {
	const [value, setValue] = useState<string | undefined>(undefined);
	return (
		<Select
			id="status-select"
			label="User status"
			options={STATUS_OPTIONS}
			value={value}
			onChange={setValue}
		/>
	);
};

const PlainDemo = () => {
	const [value, setValue] = useState<string | undefined>(undefined);
	return (
		<Select
			id="plain-select"
			label="Country"
			options={PLAIN_OPTIONS}
			value={value}
			onChange={setValue}
		/>
	);
};

const WithErrorDemo = () => {
	const [value, setValue] = useState<string | undefined>(undefined);
	return (
		<Select
			id="error-select"
			label="Favourite fruit"
			options={FRUIT_OPTIONS}
			value={value}
			onChange={setValue}
			error="Please select an option."
		/>
	);
};

const PreselectedDemo = () => {
	const [value, setValue] = useState<string>('cherry');
	return (
		<Select
			id="preselected-select"
			label="Favourite fruit"
			options={FRUIT_OPTIONS}
			value={value}
			onChange={setValue}
		/>
	);
};

const meta: Meta<typeof Select> = {
	title: 'UI/Select',
	component: Select,
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Select>;

export const WithIcons: Story = {
	render: () => <WithIconsDemo />,
};

export const StatusIndicators: Story = {
	render: () => <StatusDemo />,
};

export const PlainOptions: Story = {
	render: () => <PlainDemo />,
};

export const WithError: Story = {
	render: () => <WithErrorDemo />,
};

export const Disabled: Story = {
	render: () => (
		<Select
			id="disabled-select"
			label="Favourite fruit"
			options={FRUIT_OPTIONS}
			value="apple"
			disabled
		/>
	),
};

export const WithPreselectedValue: Story = {
	render: () => <PreselectedDemo />,
};
