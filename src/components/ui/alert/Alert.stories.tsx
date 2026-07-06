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
		<Stack gap="md" style={{ maxWidth: '32rem' }}>
			<Alert variant="success" title="Payment received">
				Your invoice has been paid. A receipt was sent to your email.
			</Alert>
			<Alert variant="error" title="Upload failed">
				The file exceeds the 10 MB limit. Choose a smaller file and try again.
			</Alert>
			<Alert variant="warning" title="Action required" onDismiss={() => {}}>
				Verify your email address to keep full access to your account.
			</Alert>
			<Alert variant="info" onDismiss={() => {}}>
				Maintenance is scheduled for Sunday at 02:00 UTC. Expect brief downtime.
			</Alert>
		</Stack>
	),
};
