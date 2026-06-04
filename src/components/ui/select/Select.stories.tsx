import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import type { SelectOption } from './Select.types';
import { Select } from './Select';

const FRUIT_OPTIONS: SelectOption[] = [
	{ value: 'apple', label: 'Apple', icon: '🍎', description: 'Sweet and crunchy' },
	{ value: 'banana', label: 'Banana', icon: '🍌', description: 'Rich in potassium' },
	{ value: 'cherry', label: 'Cherry', icon: '🍒', description: 'Sweet or sour' },
	{ value: 'mango', label: 'Mango', icon: '🥭', description: 'Tropical favourite' },
	{
		value: 'grape',
		label: 'Grape',
		icon: '🍇',
		description: 'Comes in clusters',
		disabled: true,
	},
];

const Dot = ({ color }: { color: string }) => (
	<span
		style={{
			width: 10,
			height: 10,
			borderRadius: '50%',
			background: color,
			display: 'inline-block',
			flexShrink: 0,
		}}
	/>
);

const STATUS_OPTIONS: SelectOption[] = [
	{ value: 'active', label: 'Active', icon: <Dot color="#16a34a" />, description: 'User is currently active' },
	{ value: 'idle', label: 'Idle', icon: <Dot color="#d97706" />, description: 'No activity in 30 minutes' },
	{ value: 'offline', label: 'Offline', icon: <Dot color="#6b7280" />, description: 'Not connected' },
	{ value: 'banned', label: 'Banned', icon: <Dot color="#dc2626" />, description: 'Account suspended', disabled: true },
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
	tags: ['autodocs']
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
