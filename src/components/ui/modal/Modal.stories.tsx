import type { Meta, StoryObj } from '@storybook/react';

import { Stack } from '@/components/layout/stack';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDisclosure } from '@/hooks/useDisclosure';

import { Modal } from './Modal';

const meta: Meta<typeof Modal> = {
	title: 'UI/Modal',
	component: Modal,
	tags: ['autodocs'],
	argTypes: {
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg'],
		},
		closeOnBackdropClick: { control: 'boolean' },
		title: { control: 'text' },
	},
};

export default meta;

type Story = StoryObj<typeof Modal>;

const ModalDemo = ({
	title,
	size,
	closeOnBackdropClick,
	footer,
	children,
}: Partial<React.ComponentProps<typeof Modal>>) => {
	const { isOpen, open, close } = useDisclosure();
	return (
		<>
			<Button onClick={open}>Open modal</Button>
			<Modal
				isOpen={isOpen}
				onClose={close}
				title={title}
				size={size}
				closeOnBackdropClick={closeOnBackdropClick}
				footer={footer}
			>
				{children ?? (
					<p>
						This is the modal body. Add any content here — forms, images,
						descriptions, or anything else.
					</p>
				)}
			</Modal>
		</>
	);
};

export const Default: Story = {
	render: () => <ModalDemo title="Default modal" />,
};

export const WithFooter: Story = {
	render: () => {
		const Footer = () => {
			const { isOpen, open, close } = useDisclosure();
			return (
				<>
					<Button onClick={open}>Open modal</Button>
					<Modal
						isOpen={isOpen}
						onClose={close}
						title="Confirm deletion"
						footer={
							<>
								<Button variant="secondary" onClick={close}>
									Cancel
								</Button>
								<Button variant="primary" onClick={close}>
									Delete
								</Button>
							</>
						}
					>
						<p>
							Are you sure you want to delete this item? This action cannot be
							undone.
						</p>
					</Modal>
				</>
			);
		};
		return <Footer />;
	},
};

export const WithForm: Story = {
	render: () => {
		const Form = () => {
			const { isOpen, open, close } = useDisclosure();
			return (
				<>
					<Button onClick={open}>Open modal</Button>
					<Modal
						isOpen={isOpen}
						onClose={close}
						title="Edit profile"
						footer={
							<>
								<Button variant="secondary" onClick={close}>
									Cancel
								</Button>
								<Button variant="primary" onClick={close}>
									Save changes
								</Button>
							</>
						}
					>
						<Stack gap="lg">
							<Input id="name" label="Full name" placeholder="Jane Smith" />

							<Input
								id="email"
								label="Email"
								type="email"
								placeholder="jane@example.com"
							/>
						</Stack>
					</Modal>
				</>
			);
		};
		return <Form />;
	},
};

export const WithoutTitle: Story = {
	render: () => (
		<ModalDemo title={undefined}>
			<p>
				A modal without a title — only the close button is shown in the header
				area.
			</p>
		</ModalDemo>
	),
};

export const Small: Story = {
	render: () => <ModalDemo title="Small modal" size="sm" />,
};

export const Large: Story = {
	render: () => <ModalDemo title="Large modal" size="lg" />,
};

export const NoBackdropClose: Story = {
	render: () => (
		<ModalDemo title="Backdrop click disabled" closeOnBackdropClick={false}>
			<p>
				Clicking the backdrop will not close this modal. Use the × button or
				press Escape.
			</p>
		</ModalDemo>
	),
};
