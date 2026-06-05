import type { Meta, StoryObj } from '@storybook/react';

import { Breadcrumb } from './Breadcrumb';

const meta: Meta<typeof Breadcrumb> = {
	title: 'Patterns/Breadcrumb',
	component: Breadcrumb,
	tags: ['autodocs'],
	args: {
		items: [
			{ label: 'Home', href: '/' },
			{ label: 'Products', href: '/products' },
			{ label: 'Electronics', href: '/products/electronics' },
			{ label: 'Wireless headphones' },
		],
	},
};

export default meta;

type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {};

export const TwoLevels: Story = {
	args: {
		items: [{ label: 'Settings', href: '/settings' }, { label: 'Profile' }],
	},
};

export const CurrentPageOnly: Story = {
	args: {
		items: [{ label: 'Dashboard' }],
	},
};

export const LongPath: Story = {
	args: {
		items: [
			{ label: 'Home', href: '/' },
			{ label: 'Workspace', href: '/workspace' },
			{ label: 'Design system', href: '/workspace/design-system' },
			{ label: 'Components', href: '/workspace/design-system/components' },
			{
				label: 'Patterns',
				href: '/workspace/design-system/components/patterns',
			},
			{ label: 'Breadcrumb' },
		],
	},
	decorators: [
		(Story) => (
			<div style={{ maxWidth: '20rem' }}>
				<Story />
			</div>
		),
	],
};
