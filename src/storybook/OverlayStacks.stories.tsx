import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import { Stack } from '@/components/layout/stack';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Menu,
	MenuContent,
	MenuItem,
	MenuTrigger,
} from '@/components/ui/menu';
import { Modal } from '@/components/ui/modal';
import { Select } from '@/components/ui/select';
import { Tooltip } from '@/components/ui/tooltip';
import { useDisclosure } from '@/hooks/useDisclosure';

const meta: Meta = {
	title: 'Guides/Overlay Stacks',
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Reference layouts for stacked floating layers — modal backdrop, portaled menus/selects, and tooltips. ' +
					'Use this story to verify z-index, focus order, and click-outside behaviour when multiple overlays compose.',
			},
		},
	},
};

export default meta;

type Story = StoryObj;

const ROLE_OPTIONS = [
	{ value: 'admin', label: 'Admin' },
	{ value: 'editor', label: 'Editor' },
	{ value: 'viewer', label: 'Viewer' },
];

const ModalWithFloatingControlsDemo = () => {
	const { isOpen, open, close } = useDisclosure();
	const [role, setRole] = useState('editor');

	return (
		<>
			<Button onClick={open}>Open modal with floating controls</Button>
			<Modal
				isOpen={isOpen}
				onClose={close}
				title="Edit member"
				footer={
					<Stack direction="row" gap="2" justify="end">
						<Button variant="secondary" onClick={close}>
							Cancel
						</Button>
						<Button onClick={close}>Save</Button>
					</Stack>
				}
			>
				<Stack gap="4">
					<Input
						id="overlay-name"
						label="Name"
						defaultValue="Alex Morgan"
						onChange={() => {}}
					/>
					<Select
						id="overlay-role"
						label="Role"
						options={ROLE_OPTIONS}
						value={role}
						onChange={setRole}
					/>
					<Stack direction="row" gap="2" align="center">
						<Menu>
							<MenuTrigger>
								<Button
									variant="secondary"
									iconOnly
									icon={MoreHorizontal}
									aria-label="More actions"
								/>
							</MenuTrigger>
							<MenuContent align="end">
								<MenuItem icon={Pencil}>Edit permissions</MenuItem>
								<MenuItem icon={Trash2} destructive>
									Remove member
								</MenuItem>
							</MenuContent>
						</Menu>
						<Tooltip content="Changes apply on save">
							<Button variant="ghost">Why is this disabled?</Button>
						</Tooltip>
					</Stack>
				</Stack>
			</Modal>
		</>
	);
};

export const ModalWithFloatingControls: Story = {
	name: 'Modal + Menu + Tooltip',
	render: () => <ModalWithFloatingControlsDemo />,
};
