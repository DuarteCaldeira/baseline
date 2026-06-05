import { useId } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Stack } from '@/components/layout/stack';
import { useMounted } from '@/hooks/useMounted';
import type { Size } from '@/types/common';
import { cn } from '@/utils/cn';

import { useModal } from './useModal';
import styles from './Modal.module.scss';

export type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	footer?: ReactNode;
	children: ReactNode;
	size?: Size;
	closeOnBackdropClick?: boolean;
	className?: string;
};

export const Modal = ({
	isOpen,
	onClose,
	title,
	footer,
	children,
	size = 'md',
	closeOnBackdropClick = true,
	className,
}: ModalProps) => {
	const titleId = useId();
	const mounted = useMounted();

	const {
		dialogRef,
		handleOverlayClick,
		handleDialogClick,
		handleDialogKeyDown,
	} = useModal({ isOpen, onClose, closeOnBackdropClick });

	if (!mounted || !isOpen) return null;

	return createPortal(
		<Stack
			align="center"
			justify="center"
			className={styles['modal-overlay']}
			onClick={handleOverlayClick}
		>
			<Stack
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby={title ? titleId : undefined}
				tabIndex={-1}
				className={cn(styles.modal, styles[`modal--${size}`], className)}
				onClick={handleDialogClick}
				onKeyDown={handleDialogKeyDown}
			>
				<Stack
					as="header"
					direction="row"
					justify={title ? 'between' : 'end'}
					align="center"
					className={cn(
						styles['modal__header'],
						!title && styles['modal__header--no-title']
					)}
				>
					{title && (
						<h2 id={titleId} className={styles['modal__title']}>
							{title}
						</h2>
					)}
					<Button
						type="button"
						variant="ghost"
						size="sm"
						iconOnly
						onClick={onClose}
						aria-label="Close modal"
					>
						<Icon icon={X} size="sm" />
					</Button>
				</Stack>
				<div className={styles['modal__body']}>{children}</div>
				{footer && (
					<Stack
						as="footer"
						direction="row"
						justify="end"
						gap="2"
						className={styles['modal__footer']}
					>
						{footer}
					</Stack>
				)}
			</Stack>
		</Stack>,
		document.body
	);
};
