import { useId } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { Stack } from '@/components/layout/stack';
import { Overlay } from '@/components/patterns/overlay';
import { OverlayPanelFrame } from '@/components/ui/overlay-panel/OverlayPanelFrame';
import { useMounted } from '@/hooks/useMounted';
import type { Size } from '@/types/common';
import { cn } from '@/utils/cn';

import styles from './Modal.module.scss';
import { useModal } from './useModal';

type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	footer?: ReactNode;
	children: ReactNode;
	size?: Size;
	closeOnBackdropClick?: boolean;
};

export const Modal = ({
	isOpen,
	onClose,
	title,
	footer,
	children,
	size = 'md',
	closeOnBackdropClick = true,
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
		<Overlay center subtle blur onClick={handleOverlayClick}>
			<Stack
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby={title ? titleId : undefined}
				tabIndex={-1}
				align="stretch"
				className={cn(styles.modal, styles[`modal--${size}`])}
				onClick={handleDialogClick}
				onKeyDown={handleDialogKeyDown}
			>
				<OverlayPanelFrame
					title={title}
					titleId={titleId}
					footer={footer}
					onClose={onClose}
					closeLabel="Close modal"
					classNames={{
						header: styles['modal__header'],
						headerNoTitle: styles['modal__header--no-title'],
						title: styles['modal__title'],
						body: styles['modal__body'],
						footer: styles['modal__footer'],
					}}
				>
					{children}
				</OverlayPanelFrame>
			</Stack>
		</Overlay>,
		document.body
	);
};
