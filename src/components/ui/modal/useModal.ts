import type { KeyboardEvent, MouseEvent, RefObject } from 'react';

import { useOverlayBehavior } from '@/hooks/useOverlayBehavior';

type UseModalOptions = {
	isOpen: boolean;
	onClose: () => void;
	closeOnBackdropClick: boolean;
};

type UseModalReturn = {
	dialogRef: RefObject<HTMLDivElement | null>;
	handleOverlayClick: () => void;
	handleDialogClick: (event: MouseEvent) => void;
	handleDialogKeyDown: (event: KeyboardEvent) => void;
};

export const useModal = ({
	isOpen,
	onClose,
	closeOnBackdropClick,
}: UseModalOptions): UseModalReturn =>
	useOverlayBehavior({ isOpen, onClose, closeOnBackdropClick });
