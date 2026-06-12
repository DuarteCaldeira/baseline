import type { Meta, StoryObj } from '@storybook/react';
import {
	Copy,
	LogOut,
	MoreHorizontal,
	Pencil,
	Settings,
	Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
	Menu,
	MenuContent,
	MenuItem,
	MenuLabel,
	MenuSeparator,
	MenuSub,
	MenuSubContent,
	MenuSubTrigger,
	MenuTrigger,
} from './Menu';

const meta: Meta<typeof Menu> = {
	title: 'UI/Menu',
	component: Menu,
	tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Menu>;

export const ActionMenu: Story = {
	name: 'Action menu',
	render: () => (
		<Menu>
			<MenuTrigger>
				<Button
					variant="secondary"
					iconOnly
					icon={MoreHorizontal}
					aria-label="Row actions"
				/>
			</MenuTrigger>
			<MenuContent align="end">
				<MenuItem icon={Pencil}>Edit</MenuItem>
				<MenuItem icon={Copy}>Duplicate</MenuItem>
				<MenuSeparator />
				<MenuItem icon={Trash2} destructive>
					Delete
				</MenuItem>
			</MenuContent>
		</Menu>
	),
};

export const WithSubmenu: Story = {
	name: 'With submenu',
	render: () => (
		<Menu>
			<MenuTrigger>
				<Button variant="secondary">Actions</Button>
			</MenuTrigger>
			<MenuContent>
				<MenuItem icon={Pencil}>Edit</MenuItem>
				<MenuSub>
					<MenuSubTrigger icon={Copy}>Share</MenuSubTrigger>
					<MenuSubContent>
						<MenuItem>Email</MenuItem>
						<MenuItem>Copy link</MenuItem>
						<MenuSub>
							<MenuSubTrigger>Export</MenuSubTrigger>
							<MenuSubContent>
								<MenuItem>PDF</MenuItem>
								<MenuItem>CSV</MenuItem>
							</MenuSubContent>
						</MenuSub>
					</MenuSubContent>
				</MenuSub>
				<MenuSeparator />
				<MenuItem icon={Trash2} destructive>
					Delete
				</MenuItem>
			</MenuContent>
		</Menu>
	),
};

export const ActionMenuWithGroups: Story = {
	name: 'Action menu with groups',
	render: () => (
		<Menu>
			<MenuTrigger>
				<Button variant="secondary">Account</Button>
			</MenuTrigger>
			<MenuContent>
				<MenuLabel>Account</MenuLabel>
				<MenuItem icon={Settings}>Settings</MenuItem>
				<MenuSeparator />
				<MenuLabel>Session</MenuLabel>
				<MenuItem icon={LogOut}>Sign out</MenuItem>
			</MenuContent>
		</Menu>
	),
};
