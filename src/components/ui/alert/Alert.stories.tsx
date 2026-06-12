import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Stack } from '@/components/layout/stack';
import { Button } from '@/components/ui/button';

import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
	title: 'UI/Alert',
	component: Alert,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['success', 'error', 'warning', 'info'],
		},
		title: { control: 'text' },
		dismissLabel: { control: 'text' },
		icon: { control: false },
		onDismiss: { control: false },
	},
	args: {
		variant: 'info',
		children: 'This is an inline alert message.',
	},
};

export default meta;

type Story = StoryObj<typeof Alert>;

export const Default: Story = {};

export const WithTitle: Story = {
	args: {
		variant: 'success',
		title: 'Profile updated',
		children: 'Your account details were saved successfully.',
	},
};

export const TitleOnly: Story = {
	name: 'Title only',
	args: {
		variant: 'success',
		title: 'Profile updated',
		children: undefined,
	},
};

export const Dismissible: Story = {
	render: () => {
		const DismissibleDemo = () => {
			const [visible, setVisible] = useState(true);

			if (!visible) {
				return (
					<Button variant="secondary" onClick={() => setVisible(true)}>
						Show alert
					</Button>
				);
			}

			return (
				<Alert
					variant="warning"
					title="Session expiring"
					onDismiss={() => setVisible(false)}
				>
					Your session will expire in 5 minutes. Save your work to avoid losing
					changes.
				</Alert>
			);
		};

		return <DismissibleDemo />;
	},
};

export const AllVariants: Story = {
	render: () => (
		<Stack gap="3" style={{ maxWidth: '32rem' }}>
			<Alert variant="success" title="Payment received">
				Your invoice has been paid. A receipt was sent to your email.
			</Alert>
			<Alert variant="error" title="Upload failed">
				The file exceeds the 10 MB limit. Choose a smaller file and try again.
			</Alert>
			<Alert variant="warning" title="Action required">
				Verify your email address to keep full access to your account.
			</Alert>
			<Alert variant="info">
				Maintenance is scheduled for Sunday at 02:00 UTC. Expect brief downtime.
			</Alert>
		</Stack>
	),
};

export const InFormContext: Story = {
	name: 'In form context',
	render: () => (
		<Stack
			gap="4"
			style={{
				maxWidth: '28rem',
				padding: '1.5rem',
				border: '1px solid var(--color-border)',
				borderRadius: '0.75rem',
				background: 'var(--color-surface)',
			}}
		>
			<Stack gap="1">
				<label htmlFor="alert-email" style={{ font: 'var(--font-strong-sm)' }}>
					Email
				</label>
				<input
					id="alert-email"
					type="email"
					defaultValue="not-an-email"
					style={{
						padding: '0.5rem 0.75rem',
						border: '1px solid var(--color-border)',
						borderRadius: '0.375rem',
					}}
				/>
			</Stack>
			<Alert variant="error">
				Enter a valid email address before continuing.
			</Alert>
			<Button variant="primary">Continue</Button>
		</Stack>
	),
};
