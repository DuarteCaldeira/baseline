import type { Meta, StoryObj } from '@storybook/react';
import { Pencil, Trash2 } from 'lucide-react';

import { Stack } from '@/components/layout/stack';
import { Button } from '@/components/ui/button';

import { Accordion } from './Accordion';

const meta: Meta<typeof Accordion> = {
	title: 'UI/Accordion',
	component: Accordion,
	tags: ['autodocs'],
	argTypes: {
		type: {
			control: 'select',
			options: ['single', 'multiple'],
		},
	},
	args: {
		type: 'single',
	},
};

export default meta;

type Story = StoryObj<typeof Accordion>;

const faqItems = [
	{
		id: 'what',
		header: 'What is Baseline?',
		content: (
			<p>
				Baseline is a minimal React starter built with Next.js, TypeScript, and
				SCSS Modules. It provides a small, well-structured component library so
				you can build fast without starting from scratch.
			</p>
		),
	},
	{
		id: 'install',
		header: 'How do I get started?',
		content: (
			<p>
				Clone the repository and run <code>pnpm install</code>, then{' '}
				<code>pnpm dev</code> to start the development server. Storybook is
				available via <code>pnpm storybook</code>.
			</p>
		),
	},
	{
		id: 'license',
		header: 'What license does it use?',
		content: (
			<p>
				Baseline is open source and released under the MIT license. You are free
				to use it in personal and commercial projects.
			</p>
		),
	},
	{
		id: 'customize',
		header: 'Can I customise the design tokens?',
		content: (
			<p>
				Yes. All colours, spacing, typography, radius, and shadow values live in{' '}
				<code>src/styles/tokens/</code>. Theme variables are defined separately
				in <code>src/styles/theme/</code> so dark mode is straightforward to
				extend.
			</p>
		),
	},
];

export const Default: Story = {
	args: { items: faqItems },
};

export const DefaultOpen: Story = {
	args: { items: faqItems, defaultValue: 'what' },
};

export const Multiple: Story = {
	args: {
		items: faqItems,
		type: 'multiple',
		defaultValue: ['what', 'license'],
	},
};

export const WithDisabledItem: Story = {
	args: {
		items: [
			...faqItems.slice(0, 2),
			{ ...faqItems[2], disabled: true },
			faqItems[3],
		],
	},
};

const itemActions = (
	<Stack direction="row" gap="xs" align="center">
		<Button
			variant="ghost"
			size="sm"
			iconOnly
			icon={Pencil}
			aria-label="Edit"
		/>
		<Button
			variant="ghost"
			size="sm"
			iconOnly
			icon={Trash2}
			aria-label="Delete"
		/>
	</Stack>
);

const faqItemsWithActions = faqItems.map((item, index) =>
	index === 0 ? { ...item, actions: itemActions } : item
);

export const WithActions: Story = {
	name: 'With Actions',
	args: {
		items: faqItemsWithActions,
		defaultValue: 'what',
	},
};

export const Narrow: Story = {
	args: { items: faqItems },
	decorators: [
		(Story) => (
			<div style={{ maxWidth: '24rem' }}>
				<Story />
			</div>
		),
	],
};
