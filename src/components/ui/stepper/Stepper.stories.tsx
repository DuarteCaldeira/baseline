import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Stack } from '@/components/layout/stack';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import storyStyles from '@/storybook/storyHelpers.module.scss';

import { Stepper } from './Stepper';

const STEPS = [
	{
		label: 'Account',
		description: 'Create your account',
		content: (
			<Stack gap="sm" className={storyStyles.item}>
				<strong>Create your account</strong>
				<p>
					Enter your email address and choose a secure password to get started.
				</p>
			</Stack>
		),
	},
	{
		label: 'Profile',
		description: 'Add your details',
		content: (
			<Stack gap="sm" className={storyStyles.item}>
				<strong>Add your details</strong>
				<p>
					Tell us your name and upload a profile photo so others can recognise
					you.
				</p>
			</Stack>
		),
	},
	{
		label: 'Review',
		description: 'Confirm everything',
		content: (
			<Stack gap="sm" className={storyStyles.item}>
				<strong>Confirm everything</strong>
				<p>
					Review your information before submitting. You can go back to make
					changes.
				</p>
			</Stack>
		),
	},
	{
		label: 'Done',
		description: 'All set!',
		content: (
			<Stack gap="sm" className={storyStyles.item}>
				<strong>You are all set!</strong>
				<p>Your account has been created. Welcome aboard!</p>
			</Stack>
		),
	},
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

export const Interactive: Story = {
	render: () => <Stepper steps={STEPS} />,
};

const StepperInModal = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button onClick={() => setIsOpen(true)}>Open wizard</Button>
			<Modal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				title="Account Setup"
				size="lg"
			>
				<Stepper steps={STEPS} />
			</Modal>
		</>
	);
};

export const InsideModal: Story = {
	render: () => <StepperInModal />,
};
