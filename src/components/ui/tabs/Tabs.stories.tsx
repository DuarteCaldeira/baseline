import type { Meta, StoryObj } from '@storybook/react';

import { Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
	title: 'UI/Tabs',
	component: Tabs,
	tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Tabs>;

const tabItems = [
	{
		id: 'overview',
		label: 'Overview',
		content: (
			<p>
				Baseline is a minimal React starter with Next.js, TypeScript, and SCSS
				Modules. Switch tabs to see the underline slide between selections.
			</p>
		),
	},
	{
		id: 'components',
		label: 'Components',
		content: (
			<p>
				The library includes buttons, inputs, modals, toasts, and layout
				primitives like Container and Stack. Each component ships with tests and
				Storybook stories.
			</p>
		),
	},
	{
		id: 'theming',
		label: 'Theming',
		content: (
			<p>
				Design tokens live in <code>src/styles/tokens/</code> and theme
				variables in <code>src/styles/theme/</code>. Light and dark modes share
				the same component markup.
			</p>
		),
	},
	{
		id: 'docs',
		label: 'Docs',
		content: (
			<p>
				Run <code>pnpm storybook</code> to browse components interactively, or{' '}
				<code>pnpm test</code> to run the Vitest suite.
			</p>
		),
	},
];

export const Default: Story = {
	args: { items: tabItems },
};

export const DefaultOpen: Story = {
	args: { items: tabItems, defaultValue: 'components' },
};

export const WithDisabledTab: Story = {
	args: {
		items: [
			tabItems[0],
			{ ...tabItems[1], disabled: true },
			tabItems[2],
			tabItems[3],
		],
	},
};

export const Narrow: Story = {
	args: { items: tabItems },
	decorators: [
		(Story) => (
			<div style={{ maxWidth: '20rem' }}>
				<Story />
			</div>
		),
	],
};

export const ManyTabs: Story = {
	args: {
		items: [
			...tabItems,
			{
				id: 'changelog',
				label: 'Changelog',
				content: <p>Release notes and version history.</p>,
			},
			{
				id: 'support',
				label: 'Support',
				content: <p>Get help or report an issue on GitHub.</p>,
			},
		],
	},
};
