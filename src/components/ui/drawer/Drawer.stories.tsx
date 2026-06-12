import type { Meta, StoryObj } from '@storybook/react';

import { Stack } from '@/components/layout/stack';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDisclosure } from '@/hooks/useDisclosure';

import { Drawer } from './Drawer';

const meta: Meta<typeof Drawer> = {
	title: 'UI/Drawer',
	component: Drawer,
	tags: ['autodocs'],
	argTypes: {
		side: {
			control: 'select',
			options: ['left', 'right'],
		},
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg'],
		},
		closeOnBackdropClick: { control: 'boolean' },
		title: { control: 'text' },
	},
};

export default meta;

type Story = StoryObj<typeof Drawer>;

const DrawerDemo = ({
	title,
	side,
	size,
	closeOnBackdropClick,
	footer,
	children,
}: Partial<React.ComponentProps<typeof Drawer>>) => {
	const { isOpen, open, close } = useDisclosure();

	return (
		<>
			<Button onClick={open}>Open drawer</Button>
			<Drawer
				isOpen={isOpen}
				onClose={close}
				title={title}
				side={side}
				size={size}
				closeOnBackdropClick={closeOnBackdropClick}
				footer={footer}
			>
				{children ?? (
					<p>
						Slide-in panel for secondary workflows — filters, settings, or
						detail views without leaving the page.
					</p>
				)}
			</Drawer>
		</>
	);
};

export const Default: Story = {
	render: () => <DrawerDemo title="Drawer" />,
};

export const LeftSide: Story = {
	name: 'Left side',
	render: () => <DrawerDemo title="Navigation" side="left" />,
};

export const WithFooter: Story = {
	name: 'With footer',
	render: () => {
		const FooterDemo = () => {
			const { isOpen, open, close } = useDisclosure();

			return (
				<>
					<Button onClick={open}>Open drawer</Button>
					<Drawer
						isOpen={isOpen}
						onClose={close}
						title="Edit settings"
						footer={
							<>
								<Button variant="secondary" onClick={close}>
									Cancel
								</Button>
								<Button variant="primary" onClick={close}>
									Save
								</Button>
							</>
						}
					>
						<p>Update your preferences and save when you are done.</p>
					</Drawer>
				</>
			);
		};

		return <FooterDemo />;
	},
};

export const WithForm: Story = {
	name: 'With form',
	render: () => {
		const FormDemo = () => {
			const { isOpen, open, close } = useDisclosure();

			return (
				<>
					<Button onClick={open}>Open drawer</Button>
					<Drawer
						isOpen={isOpen}
						onClose={close}
						title="New contact"
						size="md"
						footer={
							<>
								<Button variant="secondary" onClick={close}>
									Cancel
								</Button>
								<Button variant="primary" onClick={close}>
									Create
								</Button>
							</>
						}
					>
						<Stack gap="4">
							<Input id="drawer-name" label="Name" placeholder="Jane Smith" />
							<Input
								id="drawer-email"
								label="Email"
								type="email"
								placeholder="jane@example.com"
							/>
						</Stack>
					</Drawer>
				</>
			);
		};

		return <FormDemo />;
	},
};

export const Small: Story = {
	render: () => <DrawerDemo title="Compact drawer" size="sm" />,
};

export const Large: Story = {
	render: () => <DrawerDemo title="Wide drawer" size="lg" />,
};
