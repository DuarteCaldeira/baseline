import type { Meta, StoryObj } from '@storybook/react';

import { Link } from './Link';

const meta: Meta<typeof Link> = {
	title: 'UI/Link',
	component: Link,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'subtle', 'inherit'],
		},
		external: { control: 'boolean' },
		children: { control: 'text' },
	},
	args: {
		href: '#',
		children: 'Link text',
		variant: 'default',
		external: false,
	},
};

export default meta;

type Story = StoryObj<typeof Link>;

export const Default: Story = {};

export const Subtle: Story = {
	args: { variant: 'subtle' },
};

export const Inherit: Story = {
	decorators: [
		(Story) => (
			<p style={{ color: 'oklch(0.5 0.15 145)' }}>
				Some text with an inline <Story /> that inherits the parent colour.
			</p>
		),
	],
	args: { variant: 'inherit' },
};

export const External: Story = {
	args: {
		href: 'https://example.com',
		external: true,
		children: 'Opens in a new tab',
	},
};

export const AllVariants: Story = {
	render: () => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
			<Link href="#" variant="default">Default link</Link>
			<Link href="#" variant="subtle">Subtle link</Link>
			<p style={{ margin: 0 }}>
				Paragraph with a{' '}
				<Link href="#" variant="inherit">inherit link</Link>{' '}
				inside it.
			</p>
			<Link href="https://example.com" variant="default" external>
				External link
			</Link>
		</div>
	),
};
