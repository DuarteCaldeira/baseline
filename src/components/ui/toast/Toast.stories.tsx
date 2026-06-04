import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '@/components/ui/button';

import { Toast } from './Toast';
import { ToastProvider } from './ToastProvider';
import { useToast } from './useToast';

// ─── Static Toast (visual-only stories) ──────────────────────────────────────

const meta: Meta<typeof Toast> = {
	title: 'UI/Toast',
	component: Toast,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['success', 'error', 'warning', 'info'],
		},
		title: { control: 'text' },
		message: { control: 'text' },
	},
	args: {
		id: 'preview',
		variant: 'success',
		message: 'Your changes have been saved.',
		onDismiss: () => {},
	},
};

export default meta;

type Story = StoryObj<typeof Toast>;

export const Success: Story = {
	args: { variant: 'success', title: 'Saved', message: 'Your changes have been saved.' },
};

export const Error: Story = {
	args: { variant: 'error', title: 'Error', message: 'Something went wrong. Please try again.' },
};

export const Warning: Story = {
	args: { variant: 'warning', title: 'Warning', message: 'Your session expires in 5 minutes.' },
};

export const Info: Story = {
	args: { variant: 'info', title: 'Heads up', message: 'A new version is available.' },
};

export const WithoutTitle: Story = {
	args: { variant: 'info', title: undefined, message: 'A new version is available.' },
};

export const AllVariants: Story = {
	render: () => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '20rem' }}>
			<Toast id="1" variant="success" title="Saved"   message="Your changes have been saved."          onDismiss={() => {}} />
			<Toast id="2" variant="error"   title="Error"   message="Something went wrong."                  onDismiss={() => {}} />
			<Toast id="3" variant="warning" title="Warning" message="Your session expires in 5 minutes."     onDismiss={() => {}} />
			<Toast id="4" variant="info"    title="Info"    message="A new version is available."            onDismiss={() => {}} />
		</div>
	),
};

// ─── Live demo with ToastProvider + useToast ─────────────────────────────────

const LiveDemo = () => {
	const { show } = useToast();
	return (
		<div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
			<Button variant="primary" size="sm" onClick={() => show({ variant: 'success', title: 'Saved', message: 'Your changes have been saved.' })}>
				Success
			</Button>
			<Button variant="secondary" size="sm" onClick={() => show({ variant: 'error', title: 'Error', message: 'Something went wrong. Please try again.' })}>
				Error
			</Button>
			<Button variant="secondary" size="sm" onClick={() => show({ variant: 'warning', title: 'Warning', message: 'Your session expires in 5 minutes.' })}>
				Warning
			</Button>
			<Button variant="secondary" size="sm" onClick={() => show({ variant: 'info', title: 'Info', message: 'A new version is available.' })}>
				Info
			</Button>
			<Button variant="ghost" size="sm" onClick={() => show({ variant: 'success', message: 'No title — just a message.' })}>
				No title
			</Button>
		</div>
	);
};

export const Interactive: Story = {
	render: () => (
		<ToastProvider>
			<LiveDemo />
		</ToastProvider>
	),
};
