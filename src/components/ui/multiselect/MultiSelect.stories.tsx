import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import { Apple, Cherry, Citrus } from 'lucide-react';

import type { SelectOption } from '@/components/ui/select';

import { MultiSelect } from './MultiSelect';

const SKILL_OPTIONS: SelectOption[] = [
	{ value: 'react', label: 'React', description: 'UI library' },
	{ value: 'typescript', label: 'TypeScript', description: 'Typed JavaScript' },
	{
		value: 'accessibility',
		label: 'Accessibility',
		description: 'Inclusive design',
	},
	{ value: 'testing', label: 'Testing', description: 'Quality assurance' },
];

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
];

const DefaultDemo = () => {
	const [value, setValue] = useState<string[]>(['react']);

	return (
		<MultiSelect
			id="skills-multiselect"
			label="Skills"
			options={SKILL_OPTIONS}
			value={value}
			onChange={setValue}
			placeholder="Select skills"
		/>
	);
};

const WithIconsDemo = () => {
	const [value, setValue] = useState<string[]>(['apple']);

	return (
		<MultiSelect
			id="fruit-multiselect"
			label="Favourite fruits"
			options={FRUIT_OPTIONS}
			value={value}
			onChange={setValue}
		/>
	);
};

const meta: Meta<typeof MultiSelect> = {
	title: 'UI/MultiSelect',
	component: MultiSelect,
	tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof MultiSelect>;

export const Default: Story = {
	render: () => <DefaultDemo />,
};

export const WithIcons: Story = {
	render: () => <WithIconsDemo />,
};

export const WithError: Story = {
	render: () => (
		<MultiSelect
			id="skills-error"
			label="Skills"
			options={SKILL_OPTIONS}
			error="Select at least one skill."
		/>
	),
};

export const Disabled: Story = {
	args: {
		id: 'skills-disabled',
		label: 'Skills',
		options: SKILL_OPTIONS,
		defaultValue: ['react', 'typescript'],
		disabled: true,
	},
};
