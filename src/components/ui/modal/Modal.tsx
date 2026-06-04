import { useEffect, useId, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

import { Icon } from '@/components/ui/icon';
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
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	const {
		dialogRef,
		handleOverlayClick,
		handleDialogClick,
		handleDialogKeyDown,
	} = useModal({ isOpen, onClose, closeOnBackdropClick });

	if (!mounted || !isOpen) return null;

	return createPortal(
		<div className={styles['modal__overlay']} onClick={handleOverlayClick}>
			<div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby={title ? titleId : undefined}
				tabIndex={-1}
				className={cn(styles.modal, styles[`modal--${size}`], className)}
				onClick={handleDialogClick}
				onKeyDown={handleDialogKeyDown}
			>
				<div
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
					<button
						type="button"
						className={styles['modal__close']}
						onClick={onClose}
						aria-label="Close modal"
					>
						<Icon icon={X} size="sm" />
					</button>
				</div>
				<div className={styles['modal__body']}>{children}</div>
				{footer && (
					<div className={styles['modal__footer']}>{footer}</div>
				)}
			</div>
		</div>,
		document.body
	);
};
