import type { Meta, StoryObj } from '@storybook/react';

import { Stack } from '@/components/layout/stack';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const meta: Meta = {
	title: 'Patterns/FormField',
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Composition reference for labeled controls. Primitives such as Input, Textarea, Select, and Checkbox ' +
					'wrap `FormField` internally — use this story to compare default, helper, error, and disabled states side by side.',
			},
		},
	},
};

export default meta;

type Story = StoryObj;

export const FieldStates: Story = {
	name: 'Field States',
	render: () => (
		<Stack gap="xl" style={{ maxWidth: '28rem' }}>
			<Input id="field-default" label="Default" placeholder="Placeholder…" />
			<Input
				id="field-helper"
				label="With helper"
				placeholder="Placeholder…"
				helperText="Shown below the control when no error is present."
			/>
			<Input
				id="field-error"
				label="With error"
				value=""
				onChange={() => {}}
				error="This field is required."
			/>
			<Input
				id="field-disabled"
				label="Disabled"
				disabled
				value="Cannot edit"
				onChange={() => {}}
			/>
			<Textarea
				id="field-textarea"
				label="Textarea"
				helperText="Supports the same label, helper, and error wiring."
				placeholder="Write a message…"
			/>
			<Select
				id="field-select"
				label="Select"
				placeholder="Choose one"
				options={[
					{ value: 'draft', label: 'Draft' },
					{ value: 'published', label: 'Published' },
				]}
			/>
			<Checkbox
				id="field-checkbox"
				label="Checkbox"
				helperText="Checkboxes use the same field message pattern."
			/>
		</Stack>
	),
};
