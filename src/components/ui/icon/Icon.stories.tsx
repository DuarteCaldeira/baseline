import type { Meta, StoryObj } from '@storybook/react';
import {
	AlertCircle,
	AlertTriangle,
	CheckCircle,
	Info,
	Star,
	X,
} from 'lucide-react';

import { Icon } from './Icon';

const meta: Meta<typeof Icon> = {
	title: 'UI/Icon',
	component: Icon,
	tags: ['autodocs'],
	argTypes: {
		icon: { control: false },
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg'],
		},
		variant: {
			control: 'select',
			options: [
				'default', 'muted', 'subtle',
				'primary', 'success', 'warning', 'error', 'info',
			],
		},
		label: { control: 'text' },
		strokeWidth: { control: 'number' },
	},
	args: {
		icon: Star,
		size: 'md',
		variant: 'default',
	},
};

export default meta;

type Story = StoryObj<typeof Icon>;

export const Default: Story = {};

export const WithLabel: Story = {
	args: { label: 'Favourite' },
};

export const Sizes: Story = {
	render: () => (
		<div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
			<Icon icon={Star} size="sm" label="Small" />
			<Icon icon={Star} size="md" label="Medium" />
			<Icon icon={Star} size="lg" label="Large" />
		</div>
	),
};

export const Variants: Story = {
	render: () => (
		<div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
			<Icon icon={Star}          variant="default" label="Default" />
			<Icon icon={Star}          variant="muted"   label="Muted" />
			<Icon icon={Star}          variant="subtle"  label="Subtle" />
			<Icon icon={Star}          variant="primary" label="Primary" />
			<Icon icon={CheckCircle}   variant="success" label="Success" />
			<Icon icon={AlertTriangle} variant="warning" label="Warning" />
			<Icon icon={AlertCircle}   variant="error"   label="Error" />
			<Icon icon={Info}          variant="info"    label="Info" />
		</div>
	),
};

export const SemanticUsage: Story = {
	render: () => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
			<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
				<Icon icon={CheckCircle} variant="success" label="Success" />
				<span>Changes saved successfully.</span>
			</div>
			<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
				<Icon icon={AlertTriangle} variant="warning" label="Warning" />
				<span>This action cannot be undone.</span>
			</div>
			<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
				<Icon icon={AlertCircle} variant="error" label="Error" />
				<span>Something went wrong.</span>
			</div>
			<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
				<Icon icon={Info} variant="info" label="Info" />
				<span>Your session expires in 5 minutes.</span>
			</div>
			<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
				<Icon icon={X} variant="muted" />
				<span>Decorative icon (no label, aria-hidden).</span>
			</div>
		</div>
	),
};
