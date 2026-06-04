import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Stepper } from './Stepper';

const STEPS = [
	{ label: 'Account', description: 'Create your account' },
	{ label: 'Profile', description: 'Add your details' },
	{ label: 'Review', description: 'Confirm everything' },
	{ label: 'Done', description: 'All set!' },
];

const SIMPLE_STEPS = [
	{ label: 'Cart' },
	{ label: 'Shipping' },
	{ label: 'Payment' },
	{ label: 'Confirm' },
];

const meta: Meta<typeof Stepper> = {
	title: 'UI/Stepper',
	component: Stepper,
	tags: ['autodocs'],
	argTypes: {
		currentStep: {
			control: { type: 'range', min: 0, max: 4, step: 1 },
		},
	},
	args: {
		steps: STEPS,
		currentStep: 1,
	},
};

export default meta;

type Story = StoryObj<typeof Stepper>;

export const Default: Story = {};

export const FirstStep: Story = {
	args: { currentStep: 0 },
};

export const LastStep: Story = {
	args: { currentStep: 3 },
};

export const Completed: Story = {
	args: { currentStep: 4 },
};

export const WithoutDescriptions: Story = {
	args: { steps: SIMPLE_STEPS },
};

const InteractiveDemo = () => {
	const [current, setCurrent] = useState(0);
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
			<Stepper steps={STEPS} currentStep={current} />
			<div style={{ display: 'flex', gap: '0.75rem' }}>
				<button
					onClick={() => setCurrent((c) => Math.max(0, c - 1))}
					disabled={current === 0}
					style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
				>
					Back
				</button>
				<button
					onClick={() => setCurrent((c) => Math.min(STEPS.length, c + 1))}
					disabled={current === STEPS.length}
					style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
				>
					Next
				</button>
			</div>
		</div>
	);
};

export const Interactive: Story = {
	render: () => <InteractiveDemo />,
};
